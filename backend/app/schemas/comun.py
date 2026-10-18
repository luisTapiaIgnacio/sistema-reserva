"""Tipos compartidos por varios esquemas."""

from decimal import Decimal
from typing import Annotated

from pydantic import PlainSerializer

# Importes: Decimal dentro de la API (sin errores de redondeo) y número en el JSON
# (Pydantic los enviaría como texto "650.00", incómodo para el frontend).
Dinero = Annotated[Decimal, PlainSerializer(float, return_type=float, when_used="json")]
