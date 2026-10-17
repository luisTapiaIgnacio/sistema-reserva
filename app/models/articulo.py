"""Modelo Artículo: un objeto alquilable (Espejo A, Mesa redonda...).

Pertenece a una categoría y tiene un stock (cuántas unidades existen) y
un precio por día de alquiler.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.categoria import Categoria


class Articulo(Base):
    __tablename__ = "articulos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), index=True)
    descripcion: Mapped[str | None] = mapped_column(String(255), default=None)
    # Unidades totales que posees de este artículo.
    stock_total: Mapped[int] = mapped_column(Integer, default=0)
    precio_dia: Mapped[float] = mapped_column(Float, default=0.0)

    categoria_id: Mapped[int] = mapped_column(ForeignKey("categorias.id"))
    categoria: Mapped[Categoria] = relationship(back_populates="articulos")
