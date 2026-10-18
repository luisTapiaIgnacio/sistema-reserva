"""Disponibilidad por mes, para pintar el calendario de reservas."""

import calendar
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.config import settings
from app.schemas.disponibilidad import DisponibilidadMes, DisponibilidadProducto
from app.services.disponibilidad import libres_por_dia

router = APIRouter(tags=["Disponibilidad"])


@router.get("/disponibilidad", response_model=DisponibilidadMes)
def disponibilidad_del_mes(
    db: Annotated[Session, Depends(get_db)],
    mes: Annotated[str, Query(pattern=r"^\d{4}-(0[1-9]|1[0-2])$", examples=["2026-11"])],
    producto_id: Annotated[
        list[int],
        Query(min_length=1, max_length=settings.MAX_PRODUCTOS_POR_RESERVA, description="Repetible: ?producto_id=1&producto_id=2"),
    ],
) -> DisponibilidadMes:
    """Unidades libres de cada día del mes, para uno o varios productos.

    Con varios productos (un carrito), un día sirve si en todos ellos
    `libres[día]` alcanza para la cantidad elegida.
    """
    anio, numero_mes = map(int, mes.split("-"))
    desde = date(anio, numero_mes, 1)
    hasta = date(anio, numero_mes, calendar.monthrange(anio, numero_mes)[1])

    productos = []
    for pid in dict.fromkeys(producto_id):  # sin repetidos, en el orden recibido
        total, libres = libres_por_dia(db, pid, desde, hasta)
        productos.append(DisponibilidadProducto(producto_id=pid, total=total, libres=libres))
    return DisponibilidadMes(mes=mes, productos=productos)
