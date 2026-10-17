"""Modelos Reserva y DetalleReserva.

Una reserva es de un cliente, cubre un periodo (fecha_inicio..fecha_fin) y
agrupa varios artículos con su cantidad (los "detalles").
"""

from __future__ import annotations

import enum
from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.articulo import Articulo
    from app.models.cliente import Cliente


class EstadoReserva(str, enum.Enum):
    pendiente = "pendiente"
    confirmada = "confirmada"
    cancelada = "cancelada"


class Reserva(Base):
    __tablename__ = "reservas"

    id: Mapped[int] = mapped_column(primary_key=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"))
    fecha_inicio: Mapped[date] = mapped_column(Date)
    fecha_fin: Mapped[date] = mapped_column(Date)
    estado: Mapped[EstadoReserva] = mapped_column(
        Enum(EstadoReserva), default=EstadoReserva.pendiente
    )
    mensaje: Mapped[str | None] = mapped_column(String(500), default=None)
    creada_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    cliente: Mapped[Cliente] = relationship(back_populates="reservas")
    detalles: Mapped[list[DetalleReserva]] = relationship(
        back_populates="reserva",
        cascade="all, delete-orphan",
    )


class DetalleReserva(Base):
    """Un artículo dentro de una reserva, con la cantidad pedida."""

    __tablename__ = "detalles_reserva"

    id: Mapped[int] = mapped_column(primary_key=True)
    reserva_id: Mapped[int] = mapped_column(ForeignKey("reservas.id"))
    articulo_id: Mapped[int] = mapped_column(ForeignKey("articulos.id"))
    cantidad: Mapped[int] = mapped_column(Integer)

    reserva: Mapped[Reserva] = relationship(back_populates="detalles")
    articulo: Mapped[Articulo] = relationship()
