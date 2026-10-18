"""Modelo Configuracion: ajustes del negocio que el admin cambia desde el panel.

Es una sola fila (id = 1). Cambiarla no afecta a las reservas ya hechas:
cada reserva guarda su propio adelanto y vencimiento al crearse.
"""

from typing import Any

from sqlalchemy import JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base

# Datos de ejemplo: el admin los reemplaza por los reales desde el panel.
BANCOS_EJEMPLO: list[dict[str, str]] = [
    {"banco": "BCP", "tipo": "Cuenta corriente soles", "numero": "191-0000000-0-00"},
    {"banco": "Interbank", "tipo": "Cuenta corriente soles", "numero": "200-0000000000"},
    {"banco": "Otros bancos", "tipo": "CCI", "numero": "002-191-000000000000-00"},
]


class Configuracion(Base):
    __tablename__ = "configuracion"

    id: Mapped[int] = mapped_column(primary_key=True)

    # Reglas de la reserva
    horas_para_pagar: Mapped[int] = mapped_column(default=4)  # plazo para mandar el comprobante
    porcentaje_adelanto: Mapped[int] = mapped_column(default=50)  # mínimo para confirmar

    # Contacto y datos de pago que ve el cliente
    whatsapp: Mapped[str] = mapped_column(String(20), default="51913956853")  # sin + ni espacios
    yape_plin_numero: Mapped[str] = mapped_column(String(20), default="999 999 999")
    yape_plin_titular: Mapped[str] = mapped_column(String(120), default="Miranda Magic Mirror")
    yape_plin_qr: Mapped[str | None] = mapped_column(String(500), default="/images/pagos/qr-ejemplo.svg")
    bancos: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=lambda: list(BANCOS_EJEMPLO))
    bancos_titular: Mapped[str] = mapped_column(String(120), default="Miranda Magic Mirror")
