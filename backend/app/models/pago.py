"""Modelo Pago: un abono a una reserva (adelanto, saldo...)."""

from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.models.enums import EstadoPago, MetodoPago, OrigenPago

if TYPE_CHECKING:
    from app.models.reserva import Reserva


class Pago(Base):
    __tablename__ = "pagos"

    id: Mapped[int] = mapped_column(primary_key=True)
    reserva_id: Mapped[int] = mapped_column(
        ForeignKey("reservas.id", ondelete="CASCADE"), index=True
    )
    monto: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    metodo: Mapped[MetodoPago] = mapped_column(Enum(MetodoPago, name="metodo_pago"))
    origen: Mapped[OrigenPago] = mapped_column(
        Enum(OrigenPago, name="origen_pago"), default=OrigenPago.WEB
    )
    # Único: evita que se use la misma captura de pago dos veces.
    numero_operacion: Mapped[str | None] = mapped_column(String(30), unique=True, default=None)
    comprobante_url: Mapped[str | None] = mapped_column(String(500), default=None)
    estado: Mapped[EstadoPago] = mapped_column(
        Enum(EstadoPago, name="estado_pago"), default=EstadoPago.POR_VERIFICAR
    )
    creado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    reserva: Mapped[Reserva] = relationship(back_populates="pagos")
