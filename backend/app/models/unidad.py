"""Modelo Unidad: cada ejemplar físico de un producto (ESP-001, ESP-002...)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import EstadoUnidad

if TYPE_CHECKING:
    from app.models.producto import Producto
    from app.models.reserva import Asignacion


class Unidad(Base):
    __tablename__ = "unidades"

    id: Mapped[int] = mapped_column(primary_key=True)
    producto_id: Mapped[int] = mapped_column(ForeignKey("productos.id"), index=True)
    codigo: Mapped[str] = mapped_column(String(30), unique=True)  # ESP-001
    # Solo las OPERATIVAS cuentan como stock disponible.
    estado: Mapped[EstadoUnidad] = mapped_column(
        Enum(EstadoUnidad, name="estado_unidad"), default=EstadoUnidad.OPERATIVA
    )
    notas: Mapped[str | None] = mapped_column(Text, default=None)

    producto: Mapped[Producto] = relationship(back_populates="unidades")
    asignaciones: Mapped[list[Asignacion]] = relationship(back_populates="unidad")
