"""Esquemas Pydantic de Reserva, sus detalles y la disponibilidad."""

from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.models.reserva import EstadoReserva
from app.schemas.articulo import ArticuloRead
from app.schemas.cliente import ClienteCreate, ClienteRead


class ReservaItemCreate(BaseModel):
    """Un artículo que el cliente quiere reservar, con su cantidad."""

    articulo_id: int
    cantidad: int = Field(gt=0, description="Debe ser mayor que 0")


class ReservaCreate(BaseModel):
    cliente: ClienteCreate
    fecha_inicio: date
    fecha_fin: date
    mensaje: str | None = Field(default=None, max_length=500)
    items: list[ReservaItemCreate] = Field(min_length=1)

    @model_validator(mode="after")
    def _validar_fechas(self) -> "ReservaCreate":
        if self.fecha_fin < self.fecha_inicio:
            raise ValueError("fecha_fin no puede ser anterior a fecha_inicio")
        return self


class DetalleReservaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    cantidad: int
    articulo: ArticuloRead


class ReservaRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    estado: EstadoReserva
    fecha_inicio: date
    fecha_fin: date
    mensaje: str | None
    creada_en: datetime
    cliente: ClienteRead
    detalles: list[DetalleReservaRead]


class DisponibilidadRead(BaseModel):
    """Respuesta de la consulta de disponibilidad de un artículo en un periodo."""

    articulo_id: int
    fecha_inicio: date
    fecha_fin: date
    stock_total: int
    unidades_disponibles: int
