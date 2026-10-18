"""Modelo Cliente: quien realiza una reserva. Se identifica por su celular."""

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
    # Obligatorio y único: 9 dígitos, sin +51 (ej. "987654321").
    celular: Mapped[str] = mapped_column(String(15), unique=True)
    email: Mapped[str | None] = mapped_column(String(150), default=None)

    reservas: Mapped[list[Reserva]] = relationship(back_populates="cliente")
