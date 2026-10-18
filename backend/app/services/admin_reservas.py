"""Reservas desde el panel: listar, confirmar, pagos, unidades y cambios de estado.

Flujo
-----
RESERVADA ──(admin: CONFIRMAR con pago ≥ adelanto)──► CONFIRMADA ──► EN_CURSO ──► FINALIZADA
    │                                                     │
    └──(vence el plazo: automático)──► vencida            └──────────► CANCELADA
    └──────────────────────────────────────────────────────────────► CANCELADA
"""

from datetime import date, datetime, timedelta

from sqlalchemy import Select, and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, selectinload

from app.core.errores import ErrorNegocio
from app.core.fechas import ahora, en_utc, hoy_local, ya_paso
from app.models import (
    Asignacion,
    CanalPago,
    Cliente,
    EstadoPago,
    EstadoReserva,
    EstadoUnidad,
    MetodoPago,
    OrigenPago,
    Pago,
    Reserva,
    ReservaItem,
    Unidad,
)
from app.schemas.admin_reservas import (
    AsignacionEntrada,
    CambioEstadoEntrada,
    ClienteAdmin,
    ConfirmarEntrada,
    FiltroEstado,
    ItemAdmin,
    Novedades,
    PagoAdmin,
    PagoEntrada,
    ReservaDetalle,
    ReservaResumen,
    UltimaReserva,
    UnidadBreve,
    UnidadesItem,
)
from app.services.disponibilidad import libres_por_dia
from app.services.reservas import bloquear_productos, esta_vencida, soles, total_pagado

# Cambios de estado que puede hacer la admin con los botones (CONFIRMAR va aparte).
TRANSICIONES: dict[EstadoReserva, set[EstadoReserva]] = {
    EstadoReserva.RESERVADA: {EstadoReserva.CANCELADA},
    EstadoReserva.CONFIRMADA: {EstadoReserva.EN_CURSO, EstadoReserva.CANCELADA},
    EstadoReserva.EN_CURSO: {EstadoReserva.FINALIZADA},
}

ESTADOS_CON_UNIDADES = (EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO)


# ---------- Lectura ----------


def _con_relaciones(consulta: Select[tuple[Reserva]]) -> Select[tuple[Reserva]]:
    return consulta.options(
        selectinload(Reserva.cliente),
        selectinload(Reserva.items).selectinload(ReservaItem.producto),
        selectinload(Reserva.items).selectinload(ReservaItem.asignaciones).selectinload(Asignacion.unidad),
        selectinload(Reserva.pagos),
    )


def obtener(db: Session, codigo: str, bloquear: bool = False) -> Reserva:
    consulta = select(Reserva).where(Reserva.codigo == codigo)
    if bloquear:
        # Dos clics seguidos en CONFIRMAR (o dos admins a la vez): el segundo espera al primero.
        consulta = consulta.with_for_update(of=Reserva)
    reserva = db.scalar(_con_relaciones(consulta))
    if reserva is None:
        raise ErrorNegocio(404, "No existe esa reserva.")
    return reserva


def listar(
    db: Session,
    estado: FiltroEstado | None = None,
    desde: date | None = None,
    hasta: date | None = None,
    buscar: str | None = None,
    pagina: int = 1,
    por_pagina: int = 20,
) -> tuple[list[Reserva], int]:
    condiciones = []
    if estado == FiltroEstado.RESERVADA:
        condiciones += [Reserva.estado == EstadoReserva.RESERVADA, Reserva.expira_en > ahora()]
    elif estado == FiltroEstado.VENCIDA:
        condiciones += [
            Reserva.estado == EstadoReserva.RESERVADA,
            or_(Reserva.expira_en.is_(None), Reserva.expira_en <= ahora()),
        ]
    elif estado is not None:
        condiciones.append(Reserva.estado == EstadoReserva(estado.value))
    # Eventos que se cruzan con el rango [desde, hasta].
    if desde:
        condiciones.append(Reserva.fecha_fin >= desde)
    if hasta:
        condiciones.append(Reserva.fecha_inicio <= hasta)
    if buscar and buscar.strip():
        texto = f"%{buscar.strip()}%"
        condiciones.append(
            or_(Reserva.codigo.ilike(texto), Cliente.nombre.ilike(texto), Cliente.celular.ilike(texto))
        )

    base = select(Reserva).join(Cliente).where(*condiciones)
    total = db.scalar(select(func.count()).select_from(base.subquery()))

    if estado == FiltroEstado.RESERVADA:
        orden = [Reserva.expira_en.asc()]  # primero las que están por vencer
    elif estado in (FiltroEstado.CONFIRMADA, FiltroEstado.EN_CURSO):
        orden = [Reserva.fecha_inicio.asc(), Reserva.id.asc()]  # próximos eventos primero
    else:
        orden = [Reserva.id.desc()]  # las más recientes primero
    consulta = _con_relaciones(base.order_by(*orden).offset((pagina - 1) * por_pagina).limit(por_pagina))
    return list(db.scalars(consulta).all()), total


def a_resumen(reserva: Reserva) -> ReservaResumen:
    return ReservaResumen(
        id=reserva.id,
        codigo=reserva.codigo,
        estado=reserva.estado,
        vencida=esta_vencida(reserva),
        fecha_inicio=reserva.fecha_inicio,
        fecha_fin=reserva.fecha_fin,
        horario=reserva.horario,
        distrito=reserva.distrito,
        cliente_nombre=reserva.cliente.nombre,
        cliente_celular=reserva.cliente.celular,
        productos=", ".join(f"{i.cantidad}× {i.producto.nombre}" for i in reserva.items),
        total=reserva.total,
        adelanto=reserva.adelanto,
        pagado=total_pagado(reserva),
        expira_en=reserva.expira_en,
        creado_en=reserva.creado_en,
    )


def a_detalle(reserva: Reserva) -> ReservaDetalle:
    pagado = total_pagado(reserva)
    return ReservaDetalle(
        id=reserva.id,
        codigo=reserva.codigo,
        estado=reserva.estado,
        vencida=esta_vencida(reserva),
        fecha_inicio=reserva.fecha_inicio,
        fecha_fin=reserva.fecha_fin,
        horario=reserva.horario,
        distrito=reserva.distrito,
        direccion=reserva.direccion,
        tipo_evento=reserva.tipo_evento,
        notas=reserva.notas,
        canal_pago=reserva.canal_pago,
        cliente=ClienteAdmin.model_validate(reserva.cliente),
        items=[
            ItemAdmin(
                id=item.id,
                producto_id=item.producto_id,
                nombre=item.producto.nombre,
                cantidad=item.cantidad,
                precio_unitario=item.precio_unitario,
                subtotal=item.precio_unitario * item.cantidad,
                unidades=[UnidadBreve.model_validate(a.unidad) for a in item.asignaciones],
            )
            for item in reserva.items
        ],
        pagos=[PagoAdmin.model_validate(p) for p in sorted(reserva.pagos, key=lambda p: p.id)],
        total=reserva.total,
        adelanto=reserva.adelanto,
        pagado=pagado,
        saldo=reserva.total - pagado,
        expira_en=reserva.expira_en,
        creado_en=reserva.creado_en,
        token_acceso=reserva.token_acceso,
        enlace_whatsapp_cliente=f"https://wa.me/51{reserva.cliente.celular}",
    )


# ---------- Unidades ----------


def unidades_ocupadas(db: Session, desde: date, hasta: date, excluir_reserva_id: int | None = None) -> set[int]:
    """Ids de unidades asignadas a reservas CONFIRMADAS o EN CURSO que se cruzan con esas fechas."""
    consulta = (
        select(Asignacion.unidad_id)
        .join(ReservaItem, Asignacion.reserva_item_id == ReservaItem.id)
        .join(Reserva, ReservaItem.reserva_id == Reserva.id)
        .where(
            Reserva.estado.in_(ESTADOS_CON_UNIDADES),
            Reserva.fecha_inicio <= hasta,
            Reserva.fecha_fin >= desde,
        )
    )
    if excluir_reserva_id is not None:
        consulta = consulta.where(Reserva.id != excluir_reserva_id)
    return set(db.scalars(consulta).all())


def unidades_libres(db: Session, reserva: Reserva) -> dict[int, list[Unidad]]:
    """Por cada item: unidades operativas de su producto que nadie más usa esas fechas."""
    ocupadas = unidades_ocupadas(db, reserva.fecha_inicio, reserva.fecha_fin, excluir_reserva_id=reserva.id)
    libres: dict[int, list[Unidad]] = {}
    for item in reserva.items:
        unidades = db.scalars(
            select(Unidad)
            .where(Unidad.producto_id == item.producto_id, Unidad.estado == EstadoUnidad.OPERATIVA)
            .order_by(Unidad.codigo)
        ).all()
        libres[item.id] = [u for u in unidades if u.id not in ocupadas]
    return libres


def unidades_por_item(db: Session, reserva: Reserva) -> list[UnidadesItem]:
    libres = unidades_libres(db, reserva)
    return [
        UnidadesItem(
            reserva_item_id=item.id,
            producto_id=item.producto_id,
            nombre=item.producto.nombre,
            cantidad=item.cantidad,
            asignadas=[UnidadBreve.model_validate(a.unidad) for a in item.asignaciones],
            libres=[UnidadBreve.model_validate(u) for u in libres[item.id]],
        )
        for item in reserva.items
    ]


def _asignar_unidades(db: Session, reserva: Reserva, elegidas: list[AsignacionEntrada] | None) -> None:
    """Asigna unidades a cada item: las elegidas por la admin o, si no, las primeras libres."""
    items = {item.id: item for item in reserva.items}
    manuales = {a.reserva_item_id: a.unidad_ids for a in elegidas or []}
    desconocidos = set(manuales) - set(items)
    if desconocidos:
        raise ErrorNegocio(422, "Alguna asignación no corresponde a esta reserva.")

    libres = unidades_libres(db, reserva)
    for item_id, item in items.items():
        libres_item = {u.id: u for u in libres[item_id]}
        if item_id in manuales:
            ids = manuales[item_id]
            if len(set(ids)) != len(ids) or len(ids) != item.cantidad:
                raise ErrorNegocio(422, f"Elige {item.cantidad} unidad(es) distintas de {item.producto.nombre}.")
            no_libres = [i for i in ids if i not in libres_item]
            if no_libres:
                raise ErrorNegocio(
                    409,
                    f"Alguna unidad elegida de {item.producto.nombre} no está operativa "
                    "o ya está en otra reserva esas fechas.",
                    unidades=no_libres,
                )
            unidades = [libres_item[i] for i in ids]
        else:
            if len(libres_item) < item.cantidad:
                raise ErrorNegocio(
                    409,
                    f"No hay {item.cantidad} unidad(es) de {item.producto.nombre} libres todos esos días. "
                    "Revisa las asignaciones de otras reservas.",
                )
            unidades = list(libres_item.values())[: item.cantidad]

        item.asignaciones.clear()
        db.flush()  # borra las anteriores antes de crear las nuevas (restricción única)
        item.asignaciones.extend(Asignacion(unidad=u) for u in unidades)


# ---------- Pagos ----------


def _agregar_pago(db: Session, reserva: Reserva, datos: PagoEntrada) -> None:
    pagado = total_pagado(reserva)
    if pagado + datos.monto > reserva.total:
        raise ErrorNegocio(
            422, f"El pago supera el saldo. Total {soles(reserva.total)}, ya pagado {soles(pagado)}."
        )
    if datos.numero_operacion and db.scalar(
        select(Pago.id).where(Pago.numero_operacion == datos.numero_operacion)
    ):
        raise ErrorNegocio(409, "Ese número de operación ya está registrado.")

    reserva.pagos.append(
        Pago(
            monto=datos.monto,
            metodo=datos.metodo,
            numero_operacion=datos.numero_operacion,
            origen=OrigenPago.ADMIN if datos.metodo == MetodoPago.EFECTIVO else OrigenPago.WHATSAPP,
            estado=EstadoPago.VERIFICADO,
        )
    )
    if reserva.canal_pago is None:
        reserva.canal_pago = {
            MetodoPago.YAPE: CanalPago.YAPE_PLIN,
            MetodoPago.PLIN: CanalPago.YAPE_PLIN,
            MetodoPago.TRANSFERENCIA: CanalPago.TRANSFERENCIA,
        }.get(datos.metodo, CanalPago.WHATSAPP)


def _guardar(db: Session) -> None:
    try:
        db.commit()
    except IntegrityError:
        # Otro pago con el mismo N.º de operación entró justo entre la comprobación y el guardado.
        db.rollback()
        raise ErrorNegocio(409, "Ese número de operación ya está registrado.") from None


def registrar_pago(db: Session, codigo: str, datos: PagoEntrada) -> Reserva:
    """Pagos posteriores (saldo, otro abono). El primero se registra al CONFIRMAR."""
    reserva = obtener(db, codigo, bloquear=True)
    if reserva.estado == EstadoReserva.CANCELADA:
        raise ErrorNegocio(409, "La reserva está cancelada.")
    _agregar_pago(db, reserva, datos)
    _guardar(db)
    return obtener(db, codigo)


def anular_pago(db: Session, codigo: str, pago_id: int) -> Reserva:
    """Pago registrado por error: deja de contar como pagado (queda en el historial)."""
    reserva = obtener(db, codigo, bloquear=True)
    pago = next((p for p in reserva.pagos if p.id == pago_id), None)  # debe ser de ESTA reserva
    if pago is None:
        raise ErrorNegocio(404, "Ese pago no pertenece a esta reserva.")
    if pago.estado == EstadoPago.ANULADO:
        raise ErrorNegocio(409, "Ese pago ya estaba anulado.")
    pago.estado = EstadoPago.ANULADO
    db.commit()
    return obtener(db, codigo)


# ---------- Confirmar ----------


def _hay_stock(db: Session, reserva: Reserva) -> bool:
    """¿Caben las cantidades de la reserva, sin contarla a ella misma?"""
    for item in reserva.items:
        _total, libres = libres_por_dia(
            db, item.producto_id, reserva.fecha_inicio, reserva.fecha_fin, excluir_reserva_id=reserva.id
        )
        if min(libres.values()) < item.cantidad:
            return False
    return True


def confirmar(db: Session, codigo: str, datos: ConfirmarEntrada) -> Reserva:
    reserva = obtener(db, codigo, bloquear=True)
    if reserva.estado != EstadoReserva.RESERVADA:
        raise ErrorNegocio(409, "Solo se confirman reservas en estado RESERVADA.")

    # Mismo bloqueo que al reservar desde la web: nadie toma el stock mientras confirmamos.
    bloquear_productos(db, sorted({i.producto_id for i in reserva.items}), solo_disponibles=False)
    # Si ya venció, otra persona pudo tomar la fecha en el intervalo.
    if not _hay_stock(db, reserva):
        raise ErrorNegocio(409, "Ya no quedan unidades libres para esas fechas: la fecha fue tomada por otra reserva.")

    if datos.pago:
        _agregar_pago(db, reserva, datos.pago)
    pagado = total_pagado(reserva)
    if pagado < reserva.adelanto:
        raise ErrorNegocio(
            422,
            f"Para confirmar, el pago mínimo es {soles(reserva.adelanto)}. Registrado: {soles(pagado)}.",
        )

    _asignar_unidades(db, reserva, datos.asignaciones)
    reserva.estado = EstadoReserva.CONFIRMADA
    reserva.expira_en = None
    _guardar(db)
    return obtener(db, codigo)


def cambiar_asignaciones(db: Session, codigo: str, asignaciones: list[AsignacionEntrada]) -> Reserva:
    """Cambiar de unidad una reserva ya confirmada (ej. el espejo asignado se dañó)."""
    reserva = obtener(db, codigo, bloquear=True)
    if reserva.estado not in ESTADOS_CON_UNIDADES:
        raise ErrorNegocio(409, "Solo se cambian unidades de reservas confirmadas o en curso.")
    _asignar_unidades(db, reserva, asignaciones)
    db.commit()
    return obtener(db, codigo)


# ---------- Estados ----------


def cambiar_estado(db: Session, codigo: str, datos: CambioEstadoEntrada) -> Reserva:
    reserva = obtener(db, codigo, bloquear=True)
    if datos.estado not in TRANSICIONES.get(reserva.estado, set()):
        raise ErrorNegocio(409, f"No se puede pasar de {reserva.estado.value} a {datos.estado.value}.")

    if datos.unidades_mantenimiento:
        if datos.estado != EstadoReserva.FINALIZADA:
            raise ErrorNegocio(422, "Las unidades a mantenimiento se marcan al finalizar.")
        asignadas = {a.unidad_id: a.unidad for item in reserva.items for a in item.asignaciones}
        ajenas = set(datos.unidades_mantenimiento) - set(asignadas)
        if ajenas:
            raise ErrorNegocio(422, "Alguna unidad no pertenece a esta reserva.", unidades=sorted(ajenas))
        for unidad_id in datos.unidades_mantenimiento:
            asignadas[unidad_id].estado = EstadoUnidad.MANTENIMIENTO

    reserva.estado = datos.estado
    if datos.estado == EstadoReserva.CANCELADA:
        reserva.expira_en = None
    if datos.nota:
        marca = ahora().strftime("%Y-%m-%d %H:%M UTC")
        linea = f"[{marca}] {datos.estado.value}: {datos.nota.strip()}"
        reserva.notas = f"{reserva.notas}\n{linea}" if reserva.notas else linea
    db.commit()
    return obtener(db, codigo)


def ampliar_plazo(db: Session, codigo: str, horas: int) -> Reserva:
    reserva = obtener(db, codigo, bloquear=True)
    if reserva.estado != EstadoReserva.RESERVADA:
        raise ErrorNegocio(409, "Solo se amplía el plazo de reservas en estado RESERVADA.")

    vencida = ya_paso(reserva.expira_en)
    if vencida:
        # Mientras estuvo vencida, otra persona pudo tomar la fecha.
        bloquear_productos(db, sorted({i.producto_id for i in reserva.items}), solo_disponibles=False)
        if not _hay_stock(db, reserva):
            raise ErrorNegocio(409, "La fecha ya fue tomada por otra reserva.")

    base: datetime = ahora() if vencida or reserva.expira_en is None else en_utc(reserva.expira_en)
    reserva.expira_en = base + timedelta(hours=horas)
    db.commit()
    return obtener(db, codigo)


def guardar_notas(db: Session, codigo: str, notas: str | None) -> Reserva:
    reserva = obtener(db, codigo)
    reserva.notas = notas.strip() if notas and notas.strip() else None
    db.commit()
    return obtener(db, codigo)


# ---------- Novedades ----------


def novedades(db: Session) -> Novedades:
    momento = ahora()
    hoy = hoy_local()

    def contar(*condiciones: object) -> int:
        return db.scalar(select(func.count()).select_from(Reserva).where(*condiciones))  # type: ignore[arg-type]

    vigente = and_(Reserva.estado == EstadoReserva.RESERVADA, Reserva.expira_en > momento)
    por_confirmar = contar(vigente)
    por_vencer = contar(vigente, Reserva.expira_en <= momento + timedelta(hours=1))
    entregas = contar(Reserva.estado == EstadoReserva.CONFIRMADA, Reserva.fecha_inicio <= hoy)
    recojos = contar(Reserva.estado == EstadoReserva.EN_CURSO, Reserva.fecha_fin <= hoy)

    ultima = db.scalar(select(Reserva).options(selectinload(Reserva.cliente)).order_by(Reserva.id.desc()).limit(1))
    return Novedades(
        por_confirmar=por_confirmar,
        por_vencer=por_vencer,
        entregas_pendientes=entregas,
        recojos_pendientes=recojos,
        ultima_reserva=(
            UltimaReserva(
                id=ultima.id, codigo=ultima.codigo, cliente_nombre=ultima.cliente.nombre, creado_en=ultima.creado_en
            )
            if ultima
            else None
        ),
        firma="|".join(str(n) for n in (ultima.id if ultima else 0, por_confirmar, entregas, recojos)),
    )

