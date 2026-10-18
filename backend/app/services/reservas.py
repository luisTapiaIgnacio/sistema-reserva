"""Reservas del lado del cliente: crear, consultar con su link e informar el pago."""

import secrets
from decimal import ROUND_CEILING, Decimal
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.core.errores import ErrorNegocio
from app.core.fechas import ahora, hoy_local, ya_paso
from app.models import (
    CanalPago,
    Categoria,
    Cliente,
    EstadoPago,
    EstadoReserva,
    MetodoPago,
    OrigenPago,
    Pago,
    Producto,
    Reserva,
    ReservaItem,
)
from app.schemas.reserva import (
    InformePagoEntrada,
    ItemPublico,
    PagoPublico,
    ReservaEntrada,
    ReservaPublica,
)
from app.services.disponibilidad import libres_por_dia


def calcular_adelanto(total: Decimal) -> Decimal:
    """Porcentaje del total, redondeado hacia arriba al sol entero (325.50 → 326)."""
    return (total * settings.PORCENTAJE_ADELANTO / 100).to_integral_value(rounding=ROUND_CEILING)


def esta_vencida(reserva: Reserva) -> bool:
    return reserva.estado == EstadoReserva.PENDIENTE and ya_paso(reserva.expira_en)


def _cargar_productos_bloqueados(db: Session, ids: list[int]) -> dict[int, Producto]:
    """Trae los productos pedidos y los BLOQUEA hasta el fin de la transacción.

    Si dos clientes reservan a la vez el mismo producto, el segundo espera aquí
    a que el primero termine; al continuar ya ve esa reserva y no se vende de más.
    Se bloquean en orden de id para que dos reservas cruzadas no se esperen
    mutuamente (deadlock).
    """
    productos = db.scalars(
        select(Producto)
        .join(Categoria)
        .where(Producto.id.in_(ids), Producto.activo, Categoria.activa)
        .order_by(Producto.id)
        .with_for_update(of=Producto)
    ).all()
    return {p.id: p for p in productos}


def _mismos_items(reserva: Reserva, pedidos: dict[int, int]) -> bool:
    return {item.producto_id: item.cantidad for item in reserva.items} == pedidos


def crear_reserva(db: Session, datos: ReservaEntrada) -> Reserva:
    assert datos.fecha_fin is not None  # el esquema la completa
    if datos.fecha_inicio <= hoy_local():
        raise ErrorNegocio(422, "Elige una fecha a partir de mañana.")

    pedidos = {item.producto_id: item.cantidad for item in datos.items}
    productos = _cargar_productos_bloqueados(db, sorted(pedidos))
    no_disponibles = sorted(set(pedidos) - set(productos))
    if no_disponibles:
        raise ErrorNegocio(
            422, "Algún producto elegido ya no está disponible.", productos_no_disponibles=no_disponibles
        )

    # Doble envío del formulario: si ya tiene una pendiente igual, no se duplica.
    # No devolvemos su link: con solo el celular, otra persona podría ver la reserva.
    pendientes = db.scalars(
        select(Reserva)
        .join(Cliente)
        .where(
            Cliente.celular == datos.cliente.celular,
            Reserva.estado == EstadoReserva.PENDIENTE,
            Reserva.expira_en > ahora(),
            Reserva.fecha_inicio == datos.fecha_inicio,
            Reserva.fecha_fin == datos.fecha_fin,
        )
        .options(selectinload(Reserva.items))
    ).all()
    repetida = next((r for r in pendientes if _mismos_items(r, pedidos)), None)
    if repetida:
        raise ErrorNegocio(
            409,
            f"Ya tienes esta reserva separada con el código {repetida.codigo}. "
            "Revisa el enlace que recibiste para pagar el adelanto.",
            codigo=repetida.codigo,
        )

    sin_stock = []
    for producto_id, cantidad in pedidos.items():
        _total, libres = libres_por_dia(db, producto_id, datos.fecha_inicio, datos.fecha_fin)
        disponibles = min(libres.values())
        if disponibles < cantidad:
            sin_stock.append({"producto_id": producto_id, "pedido": cantidad, "disponibles": disponibles})
    if sin_stock:
        raise ErrorNegocio(
            409, "No quedan suficientes unidades para esas fechas. Elige otra fecha o cantidad.", sin_stock=sin_stock
        )

    cliente = db.scalar(select(Cliente).where(Cliente.celular == datos.cliente.celular))
    if cliente is None:
        cliente = Cliente(celular=datos.cliente.celular, nombre=datos.cliente.nombre)
        db.add(cliente)
    cliente.nombre = datos.cliente.nombre
    if datos.cliente.email:
        cliente.email = str(datos.cliente.email)

    items = [
        ReservaItem(producto_id=pid, cantidad=cantidad, precio_unitario=productos[pid].precio)
        for pid, cantidad in pedidos.items()
    ]
    total = sum((item.precio_unitario * item.cantidad for item in items), Decimal(0))

    reserva = Reserva(
        # Código provisional: el definitivo usa el id, que se conoce tras el INSERT.
        codigo=f"TMP-{secrets.token_hex(8)}",
        token_acceso=secrets.token_urlsafe(16),
        cliente=cliente,
        fecha_inicio=datos.fecha_inicio,
        fecha_fin=datos.fecha_fin,
        horario=datos.horario,
        distrito=datos.distrito,
        direccion=datos.direccion,
        tipo_evento=datos.tipo_evento,
        total=total,
        adelanto=calcular_adelanto(total),
        expira_en=ahora() + timedelta(hours=settings.HORAS_PARA_PAGAR),
        items=items,
    )
    db.add(reserva)
    db.flush()
    # R-2026-0042: el id es único, así el código nunca se repite (aunque se borren reservas).
    reserva.codigo = f"R-{hoy_local().year}-{reserva.id:04d}"
    db.commit()
    return reserva


def obtener_con_token(db: Session, codigo: str, token: str) -> Reserva:
    reserva = db.scalar(
        select(Reserva)
        .where(Reserva.codigo == codigo)
        .options(
            selectinload(Reserva.cliente),
            selectinload(Reserva.items).selectinload(ReservaItem.producto),
            selectinload(Reserva.pagos),
        )
    )
    # Mismo error si no existe o si el token no coincide: no revela qué códigos existen.
    if reserva is None or not secrets.compare_digest(reserva.token_acceso, token):
        raise ErrorNegocio(404, "No encontramos tu reserva.")
    return reserva


def informar_pago(db: Session, codigo: str, token: str, datos: InformePagoEntrada) -> Reserva:
    """El cliente informa su N.º de operación: queda un pago POR_VERIFICAR para el admin."""
    reserva = obtener_con_token(db, codigo, token)

    if reserva.estado != EstadoReserva.PENDIENTE or esta_vencida(reserva):
        raise ErrorNegocio(409, "Esta reserva ya no está pendiente de pago.")
    if any(p.estado == EstadoPago.POR_VERIFICAR for p in reserva.pagos):
        raise ErrorNegocio(409, "Ya recibimos un pago que estamos verificando.")
    if db.scalar(select(Pago.id).where(Pago.numero_operacion == datos.numero_operacion)):
        raise ErrorNegocio(409, "Ese número de operación ya fue registrado.")

    reserva.pagos.append(
        Pago(
            monto=reserva.adelanto,
            metodo=datos.metodo,
            origen=OrigenPago.WEB,
            numero_operacion=datos.numero_operacion,
        )
    )
    reserva.canal_pago = (
        CanalPago.TRANSFERENCIA if datos.metodo == MetodoPago.TRANSFERENCIA else CanalPago.YAPE_PLIN
    )
    try:
        db.commit()
    except IntegrityError:
        # Otro pago con el mismo número entró justo entre la comprobación y el guardado.
        db.rollback()
        raise ErrorNegocio(409, "Ese número de operación ya fue registrado.") from None
    db.refresh(reserva)
    return reserva


def a_publica(reserva: Reserva) -> ReservaPublica:
    pagos = sorted(reserva.pagos, key=lambda p: p.creado_en, reverse=True)
    return ReservaPublica(
        codigo=reserva.codigo,
        estado=reserva.estado,
        vencida=esta_vencida(reserva),
        pago_en_revision=any(p.estado == EstadoPago.POR_VERIFICAR for p in reserva.pagos),
        fecha_inicio=reserva.fecha_inicio,
        fecha_fin=reserva.fecha_fin,
        horario=reserva.horario,
        distrito=reserva.distrito,
        direccion=reserva.direccion,
        tipo_evento=reserva.tipo_evento,
        cliente_nombre=reserva.cliente.nombre,
        items=[
            ItemPublico(
                producto_id=item.producto_id,
                nombre=item.producto.nombre,
                cantidad=item.cantidad,
                precio_unitario=item.precio_unitario,
                subtotal=item.precio_unitario * item.cantidad,
            )
            for item in reserva.items
        ],
        total=reserva.total,
        adelanto=reserva.adelanto,
        saldo=reserva.total - reserva.adelanto,
        expira_en=reserva.expira_en,
        pagos=[PagoPublico.model_validate(p) for p in pagos],
        creado_en=reserva.creado_en,
    )
