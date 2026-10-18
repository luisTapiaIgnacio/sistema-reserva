"""Modelos Reserva, ReservaItem y Asignacion.

- Reserva: un cliente separa productos para un periodo (fecha_inicio..fecha_fin).
- ReservaItem: un producto dentro de la reserva, con cantidad y precio.
- Asignacion: qué unidad física (ESP-001...) cubre cada item. Se hace al confirmar.
"""

from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    Numeric,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import CanalPago, EstadoReserva

if TYPE_CHECKING:
    from app.models.cliente import Cliente
    from app.models.pago import Pago
    from app.models.producto import Producto
    from app.models.unidad import Unidad


class Reserva(Base):
    __tablename__ = "reservas"
    # Consulta más frecuente: reservas activas que se cruzan con unas fechas.
    __table_args__ = (Index("ix_reservas_estado_fechas", "estado", "fecha_inicio", "fecha_fin"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    codigo: Mapped[str] = mapped_column(String(20), unique=True)  # R-2026-0142
    # Secreto del link que recibe el cliente: /reserva/{codigo}?t={token_acceso}
    token_acceso: Mapped[str] = mapped_column(String(64), unique=True)
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"), index=True)
    fecha_inicio: Mapped[date] = mapped_column(Date)  # incluye montaje
    fecha_fin: Mapped[date] = mapped_column(Date)  # incluye recojo
    horario: Mapped[str | None] = mapped_column(String(60), default=None)
    distrito: Mapped[str | None] = mapped_column(String(60), default=None)
    direccion: Mapped[str | None] = mapped_column(String(255), default=None)
    tipo_evento: Mapped[str | None] = mapped_column(String(60), default=None)
    estado: Mapped[EstadoReserva] = mapped_column(
        Enum(EstadoReserva, name="estado_reserva"), default=EstadoReserva.PENDIENTE
    )
    canal_pago: Mapped[CanalPago | None] = mapped_column(
        Enum(CanalPago, name="canal_pago"), default=None
    )
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    adelanto: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    # Si sigue PENDIENTE después de esta hora, la fecha se libera.
    expira_en: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), default=None)
    notas: Mapped[str | None] = mapped_column(Text, default=None)
    creado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    cliente: Mapped[Cliente] = relationship(back_populates="reservas")
    items: Mapped[list[ReservaItem]] = relationship(
        back_populates="reserva", cascade="all, delete-orphan"
    )
    pagos: Mapped[list[Pago]] = relationship(
        back_populates="reserva", cascade="all, delete-orphan"
    )


class ReservaItem(Base):
    __tablename__ = "reserva_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    reserva_id: Mapped[int] = mapped_column(
        ForeignKey("reservas.id", ondelete="CASCADE"), index=True
    )
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"), index=True)
    cantidad: Mapped[int] = mapped_column(default=1)
    # Precio al momento de reservar (si luego cambia el del producto, este no).
    precio_unitario: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    reserva: Mapped[Reserva] = relationship(back_populates="items")
    producto: Mapped[Producto] = relationship(back_populates="items")
    asignaciones: Mapped[list[Asignacion]] = relationship(
        back_populates="reserva_item", cascade="all, delete-orphan"
    )


class Asignacion(Base):
    __tablename__ = "asignaciones"
    __table_args__ = (
        UniqueConstraint("reserva_item_id", "unidad_id", name="uq_asignaciones_item_unidad"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    reserva_item_id: Mapped[int] = mapped_column(
        ForeignKey("reserva_items.id", ondelete="CASCADE")
    )
    unidad_id: Mapped[int] = mapped_column(ForeignKey("unidades.id"), index=True)

    reserva_item: Mapped[ReservaItem] = relationship(back_populates="asignaciones")
    unidad: Mapped[Unidad] = relationship(back_populates="asignaciones")
