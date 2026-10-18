"""Modelo Producto: lo que se alquila (Espejo Mágico 65″, Espejo Premium...).

El stock no es un número: son las Unidades físicas del producto (ESP-001,
ESP-002...). Así se sabe exactamente qué espejo va a cada evento.
"""

from __future__ import annotations

from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import Enum, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import TipoProducto

if TYPE_CHECKING:
    from app.models.categoria import Categoria
    from app.models.reserva import ReservaItem
    from app.models.unidad import Unidad


class Producto(Base):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(primary_key=True)
    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"), index=True)
    tipo: Mapped[TipoProducto] = mapped_column(
        Enum(TipoProducto, name="tipo_producto"), default=TipoProducto.ALQUILER
    )
    nombre: Mapped[str] = mapped_column(String(150))
    slug: Mapped[str] = mapped_column(String(170), unique=True)
    descripcion: Mapped[str | None] = mapped_column(Text, default=None)
    precio: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    imagen: Mapped[str | None] = mapped_column(String(500), default=None)
    activo: Mapped[bool] = mapped_column(default=True)

    categoria: Mapped[Categoria] = relationship(back_populates="productos")
    unidades: Mapped[list[Unidad]] = relationship(back_populates="producto")
    items: Mapped[list[ReservaItem]] = relationship(back_populates="producto")
