"""Seguridad: contraseñas (hash bcrypt) y sesión del panel (JWT)."""

from datetime import datetime, timedelta

import bcrypt
import jwt

from app.core.config import settings
from app.core.fechas import ahora

# bcrypt solo usa los primeros 72 bytes; más largo se rechaza para no truncar en silencio.
MAX_BYTES_PASSWORD = 72


def hash_password(password: str) -> str:
    datos = password.encode("utf-8")
    if len(datos) > MAX_BYTES_PASSWORD:
        raise ValueError("La contraseña es demasiado larga (máximo 72 bytes).")
    return bcrypt.hashpw(datos, bcrypt.gensalt(rounds=settings.BCRYPT_ROUNDS)).decode("ascii")


def verify_password(password: str, password_hash: str) -> bool:
    datos = password.encode("utf-8")
    if len(datos) > MAX_BYTES_PASSWORD:
        return False
    return bcrypt.checkpw(datos, password_hash.encode("ascii"))


# ---------- Sesión del panel (JWT) ----------

ALGORITMO = "HS256"
LARGO_MINIMO_SECRET_KEY = 32


def verificar_secret_key() -> None:
    """Se llama al arrancar la API: mejor fallar al inicio que en el primer login."""
    _clave()


def _clave() -> str:
    clave = settings.SECRET_KEY
    if len(clave) < LARGO_MINIMO_SECRET_KEY:
        raise RuntimeError(
            "Falta SECRET_KEY (mínimo 32 caracteres) en el .env o en el entorno. "
            'Genera una con: python -c "import secrets; print(secrets.token_urlsafe(48))"'
        )
    return clave


def crear_token(usuario_id: int) -> tuple[str, datetime]:
    """Token firmado que identifica al usuario. Devuelve (token, vencimiento)."""
    expira = ahora() + timedelta(hours=settings.HORAS_SESION)
    datos = {"sub": str(usuario_id), "exp": expira}
    return jwt.encode(datos, _clave(), algorithm=ALGORITMO), expira


def leer_token(token: str) -> int | None:
    """Id del usuario si el token es válido y no venció; None si no."""
    try:
        datos = jwt.decode(token, _clave(), algorithms=[ALGORITMO], options={"require": ["exp", "sub"]})
        return int(datos["sub"])
    except (jwt.InvalidTokenError, ValueError):
        return None
