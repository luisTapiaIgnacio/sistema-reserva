"""Reservas del lado del cliente: crear y consultar con su link.

El pago va por WhatsApp: el cliente manda la captura y el admin confirma
la reserva desde el panel (ver services/admin_reservas.py).
"""

import secrets
from datetime import timedelta
from decimal import ROUND_CEILING, Decimal
from urllib.parse import quote

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.errores import ErrorNegocio
from app.core.fechas import ahora, fecha_larga, hoy_local, ya_paso
from app.models import (
    Categoria,
    Cliente,
    Configuracion,
    EstadoPago,
    EstadoReserva,
    Producto,
    Reserva,
    ReservaItem,
)
from app.schemas.reserva import ItemPublico, ReservaEntrada, ReservaPublica
from app.services.configuracion import obtener_configuracion
from app.services.disponibilidad import libres_por_dia


def calcular_adelanto(total: Decimal, porcentaje: int) -> Decimal:
    """Porcentaje del total, redondeado hacia arriba al sol entero (850.50 → 851)."""
    return (total * porcentaje / 100).to_integral_value(rounding=ROUND_CEILING)


def esta_vencida(reserva: Reserva) -> bool:
    return reserva.estado == EstadoReserva.RESERVADA and ya_paso(reserva.expira_en)


def total_pagado(reserva: Reserva) -> Decimal:
    return sum((p.monto for p in reserva.pagos if p.estado == EstadoPago.VERIFICADO), Decimal(0))


def soles(monto: Decimal) -> str:
    return f"S/ {monto:,.2f}"


def bloquear_productos(db: Session, ids: list[int], solo_disponibles: bool = True) -> dict[int, Producto]:
    """Trae los productos y los BLOQUEA hasta el fin de la transacción.

    Si dos personas reservan a la vez el mismo producto, la segunda espera aquí
    a que la primera termine; al continuar ya ve esa reserva y no se vende de más.
    Se bloquean en orden de id para que dos reservas cruzadas no se esperen
    mutuamente (deadlock).
    """
    consulta = select(Producto).where(Producto.id.in_(ids)).order_by(Producto.id).with_for_update(of=Producto)
    if solo_disponibles:
        consulta = consulta.join(Categoria).where(Producto.activo, Categoria.activa)
    return {p.id: p for p in db.scalars(consulta).all()}


def _mismos_items(reserva: Reserva, pedidos: dict[int, int]) -> bool:
    return {item.producto_id: item.cantidad for item in reserva.items} == pedidos


def crear_reserva(db: Session, datos: ReservaEntrada) -> Reserva:
    assert datos.fecha_fin is not None  # el esquema la completa
    if datos.fecha_inicio <= hoy_local():
        raise ErrorNegocio(422, "Elige una fecha a partir de mañana.")

    pedidos = {item.producto_id: item.cantidad for item in datos.items}
    productos = bloquear_productos(db, sorted(pedidos))
    no_disponibles = sorted(set(pedidos) - set(productos))
    if no_disponibles:
        raise ErrorNegocio(
            422, "Algún producto elegido ya no está disponible.", productos_no_disponibles=no_disponibles
        )

    # Doble clic en "Reservar": si ya tiene una igual separada, no se duplica.
    # No devolvemos su link: con solo el celular, otra persona podría ver la reserva.
    separadas = db.scalars(
        select(Reserva)
        .join(Cliente)
        .where(
            Cliente.celular == datos.cliente.celular,
            Reserva.estado == EstadoReserva.RESERVADA,
            Reserva.expira_en > ahora(),
            Reserva.fecha_inicio == datos.fecha_inicio,
            Reserva.fecha_fin == datos.fecha_fin,
        )
        .options(selectinload(Reserva.items))
    ).all()
    repetida = next((r for r in separadas if _mismos_items(r, pedidos)), None)
    if repetida:
        raise ErrorNegocio(
            409,
            f"Ya tienes esta reserva separada con el código {repetida.codigo}. "
            "Revisa el enlace que recibiste para enviar tu comprobante.",
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
    # Plazo y adelanto se copian a la reserva: si luego cambian en el panel, esta no cambia.
    configuracion = obtener_configuracion(db)

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
        adelanto=calcular_adelanto(total, configuracion.porcentaje_adelanto),
        expira_en=ahora() + timedelta(hours=configuracion.horas_para_pagar),
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


def mensaje_whatsapp(reserva: Reserva) -> str:
    productos = ", ".join(f"{item.cantidad}× {item.producto.nombre}" for item in reserva.items)
    fecha = fecha_larga(reserva.fecha_inicio)
    if reserva.fecha_fin != reserva.fecha_inicio:
        fecha = f"del {fecha} al {fecha_larga(reserva.fecha_fin)}"
    else:
        fecha = f"para el {fecha}"
    detalles = ", ".join(d for d in (reserva.horario, reserva.distrito) if d)
    if detalles:
        fecha = f"{fecha} ({detalles})"
    return (
        f"Hola Miranda, separé {productos} {fecha}. "
        f"Mi código es {reserva.codigo}. "
        f"Total {soles(reserva.total)} · Adelanto {soles(reserva.adelanto)}. "
        "Te envío la captura del pago."
    )


def enlace_whatsapp(reserva: Reserva, configuracion: Configuracion) -> str:
    return f"https://wa.me/{configuracion.whatsapp}?text={quote(mensaje_whatsapp(reserva))}"


def a_publica(db: Session, reserva: Reserva) -> ReservaPublica:
    pagado = total_pagado(reserva)
    return ReservaPublica(
        codigo=reserva.codigo,
        estado=reserva.estado,
        vencida=esta_vencida(reserva),
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
        pagado=pagado,
        saldo=reserva.total - pagado,
        expira_en=reserva.expira_en,
        enlace_whatsapp=enlace_whatsapp(reserva, obtener_configuracion(db)),
        creado_en=reserva.creado_en,
    )
