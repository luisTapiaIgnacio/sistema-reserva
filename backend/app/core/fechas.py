"""Fechas y horas.

- Las fechas de evento son `date` (sin hora): el día en Lima.
- Los instantes (vencimientos, creación) se guardan en UTC.
"""

from datetime import UTC, date, datetime
from zoneinfo import ZoneInfo

from app.core.config import settings


def ahora() -> datetime:
    return datetime.now(UTC)


def hoy_local() -> date:
    """Hoy en la zona horaria del negocio (Lima), no la del servidor."""
    return datetime.now(ZoneInfo(settings.ZONA_HORARIA)).date()


def en_utc(instante: datetime) -> datetime:
    """SQLite devuelve las fechas sin zona horaria: las guardamos en UTC, así que lo son."""
    return instante.replace(tzinfo=UTC) if instante.tzinfo is None else instante


def ya_paso(instante: datetime | None) -> bool:
    return instante is None or en_utc(instante) <= ahora()
