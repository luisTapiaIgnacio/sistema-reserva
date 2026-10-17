"""Modelo Cliente: quien realiza una reserva. Se identifica por su correo."""

from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

if TYPE_CHECKING:
    from app.models.reserva import Reserva


class Cliente(Base):
    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120))
    telefono: Mapped[str | None] = mapped_column(String(30), default=None)
    correo: Mapped[str] = mapped_column(String(150), unique=True, index=True)

    reservas: Mapped[list[Reserva]] = relationship(
        back_populates="cliente",
        cascade="all, delete-orphan",
    )
