"""Esquemas de disponibilidad (calendario)."""

from datetime import date

from pydantic import BaseModel


class DisponibilidadProducto(BaseModel):
    producto_id: int
    total: int  # unidades operativas
    libres: dict[date, int]  # día → unidades libres ese día


class DisponibilidadMes(BaseModel):
    mes: str  # "2026-11"
    productos: list[DisponibilidadProducto]
