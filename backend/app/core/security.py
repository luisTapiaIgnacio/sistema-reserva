"""Contraseñas: se guardan como hash bcrypt, nunca en texto plano."""

import bcrypt

# bcrypt solo usa los primeros 72 bytes; más largo se rechaza para no truncar en silencio.
MAX_BYTES_PASSWORD = 72


def hash_password(password: str) -> str:
    datos = password.encode("utf-8")
    if len(datos) > MAX_BYTES_PASSWORD:
        raise ValueError("La contraseña es demasiado larga (máximo 72 bytes).")
    return bcrypt.hashpw(datos, bcrypt.gensalt(rounds=12)).decode("ascii")


def verify_password(password: str, password_hash: str) -> bool:
    datos = password.encode("utf-8")
    if len(datos) > MAX_BYTES_PASSWORD:
        return False
    return bcrypt.checkpw(datos, password_hash.encode("ascii"))
