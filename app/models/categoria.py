"""Modelo Categoría: agrupa artículos (Espejos, Mesas, Sillas, Sombrillas...)."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:  # solo para type hints, evita imports circulares en ejecución
    from app.models.articulo import Articulo


class Categoria(Base):
    __tablename__ = "categorias"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    descripcion: Mapped[str | None] = mapped_column(String(255), default=None)

    # Una categoría tiene muchos artículos. Si se borra la categoría,
    # se borran sus artículos (cascade).
    articulos: Mapped[list[Articulo]] = relationship(
        back_populates="categoria",
        cascade="all, delete-orphan",
    )
