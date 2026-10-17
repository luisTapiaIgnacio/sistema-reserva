"""Lógica de disponibilidad: ¿cuántas unidades de un artículo quedan libres
durante un periodo de fechas?

Idea clave
----------
No basta con sumar todas las reservas que se solapan con el periodo pedido,
porque dos reservas pueden solaparse con nuestro periodo pero NO entre sí
(y entonces no compiten por el stock el mismo día).

Lo correcto es buscar el "pico" de uso: el día dentro del periodo pedido en el
que más unidades están ocupadas a la vez. Ese pico solo puede ocurrir al
comienzo del periodo pedido o el día en que empieza alguna otra reserva.
Comprobando esos días candidatos obtenemos el uso máximo real.
"""

from datetime import date

from sqlalchemy.orm import Session

from app.models.articulo import Articulo
from app.models.reserva import DetalleReserva, EstadoReserva, Reserva


def _reservas_solapadas(
    db: Session,
    articulo_id: int,
    inicio: date,
    fin: date,
    excluir_reserva_id: int | None,
) -> list[tuple[DetalleReserva, Reserva]]:
    """Detalles (de ese artículo) de reservas activas que solapan [inicio, fin]."""
    consulta = (
        db.query(DetalleReserva, Reserva)
        .join(Reserva, DetalleReserva.reserva_id == Reserva.id)
        .filter(DetalleReserva.articulo_id == articulo_id)
        .filter(Reserva.estado != EstadoReserva.cancelada)
        # Dos periodos se solapan si: inicio_A <= fin_B  y  fin_A >= inicio_B
        .filter(Reserva.fecha_inicio <= fin)
        .filter(Reserva.fecha_fin >= inicio)
    )
    if excluir_reserva_id is not None:
        consulta = consulta.filter(Reserva.id != excluir_reserva_id)
    return consulta.all()


def unidades_disponibles(
    db: Session,
    articulo: Articulo,
    inicio: date,
    fin: date,
    excluir_reserva_id: int | None = None,
) -> int:
    """Unidades libres de `articulo` durante todo el periodo [inicio, fin]."""
    solapes = _reservas_solapadas(db, articulo.id, inicio, fin, excluir_reserva_id)

    # Días candidatos donde puede estar el pico de uso.
    dias_candidatos = {inicio}
    for _detalle, reserva in solapes:
        if reserva.fecha_inicio > inicio:
            dias_candidatos.add(reserva.fecha_inicio)

    pico = 0
    for dia in dias_candidatos:
        usado = sum(
            detalle.cantidad
            for detalle, reserva in solapes
            if reserva.fecha_inicio <= dia <= reserva.fecha_fin
        )
        pico = max(pico, usado)

    return articulo.stock_total - pico
