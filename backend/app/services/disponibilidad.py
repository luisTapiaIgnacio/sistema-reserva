"""Disponibilidad: cuántas unidades de un producto quedan libres cada día.

Regla de negocio
----------------
libres(día) = unidades OPERATIVAS − unidades comprometidas ese día.

Comprometen unidades las reservas CONFIRMADA, EN_CURSO y las RESERVADA cuyo
plazo de pago aún no vence (una reservada vencida ya no cuenta: la fecha se libera).
"""

from datetime import date, timedelta

from sqlalchemy import ColumnElement, and_, func, or_, select
from sqlalchemy.orm import Session

from app.core.fechas import ahora
from app.models import EstadoReserva, EstadoUnidad, Reserva, ReservaItem, Unidad


def reserva_ocupa_unidades() -> ColumnElement[bool]:
    """Condición SQL: la reserva aparta unidades (confirmada, en curso o reservada vigente)."""
    return or_(
        Reserva.estado.in_([EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO]),
        and_(Reserva.estado == EstadoReserva.RESERVADA, Reserva.expira_en > ahora()),
    )


def dias_entre(desde: date, hasta: date) -> list[date]:
    return [desde + timedelta(days=n) for n in range((hasta - desde).days + 1)]


def unidades_operativas(db: Session, producto_id: int) -> int:
    return db.scalar(
        select(func.count())
        .select_from(Unidad)
        .where(Unidad.producto_id == producto_id, Unidad.estado == EstadoUnidad.OPERATIVA)
    )


def libres_por_dia(
    db: Session,
    producto_id: int,
    desde: date,
    hasta: date,
    excluir_reserva_id: int | None = None,
) -> tuple[int, dict[date, int]]:
    """Devuelve (unidades operativas, {día: unidades libres}) entre `desde` y `hasta`."""
    total = unidades_operativas(db, producto_id)

    consulta = (
        select(ReservaItem.cantidad, Reserva.fecha_inicio, Reserva.fecha_fin)
        .join(Reserva, ReservaItem.reserva_id == Reserva.id)
        .where(
            ReservaItem.producto_id == producto_id,
            # Dos periodos se cruzan si: inicio_A <= fin_B y fin_A >= inicio_B
            Reserva.fecha_inicio <= hasta,
            Reserva.fecha_fin >= desde,
            reserva_ocupa_unidades(),
        )
    )
    if excluir_reserva_id is not None:
        consulta = consulta.where(Reserva.id != excluir_reserva_id)
    ocupaciones = db.execute(consulta).all()

    libres: dict[date, int] = {}
    for dia in dias_entre(desde, hasta):
        ocupadas = sum(cantidad for cantidad, inicio, fin in ocupaciones if inicio <= dia <= fin)
        libres[dia] = max(0, total - ocupadas)
    return total, libres
