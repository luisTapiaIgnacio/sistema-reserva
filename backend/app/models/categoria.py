"""Modelo Categoría: agrupa productos (Espejos, Cabinas 360°...)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:  # solo para type hints, evita imports circulares en ejecución
    from app.models.producto import Producto


class Categoria(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(120), unique=True)
    # Posición en los listados (1, 2, 3...).
    orden: Mapped[int] = mapped_column(default=0)
    # Desactivarla la oculta de la web sin borrar nada.
    activa: Mapped[bool] = mapped_column(default=True)

    productos: Mapped[list[Producto]] = relationship(back_populates="categoria")
