"""Crea (o actualiza) un usuario administrador.

Uso (desde backend/):
    python -m scripts.crear_admin correo@ejemplo.com "TuContraseña" "Nombre"
"""

import sys

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import hash_password
from app.models import Usuario

LARGO_MINIMO = 8


def crear_o_actualizar_admin(db: Session, correo: str, password: str, nombre: str) -> Usuario:
    if len(password) < LARGO_MINIMO:
        raise ValueError(f"La contraseña debe tener al menos {LARGO_MINIMO} caracteres.")

    email = correo.strip().lower()
    password_hash = hash_password(password)

    usuario = db.scalar(select(Usuario).where(Usuario.email == email))
    if usuario is None:
        usuario = Usuario(email=email, nombre=nombre, password_hash=password_hash)
        db.add(usuario)
    else:
        usuario.nombre = nombre
        usuario.password_hash = password_hash

    db.commit()
    return usuario


def main() -> None:
    if len(sys.argv) < 3:
        print('Uso: python -m scripts.crear_admin correo@ejemplo.com "TuContraseña" "Nombre"')
        sys.exit(1)

    correo, password = sys.argv[1], sys.argv[2]
    nombre = sys.argv[3] if len(sys.argv) > 3 else "Administrador"

    try:
        with SessionLocal() as db:
            usuario = crear_o_actualizar_admin(db, correo, password, nombre)
            email = usuario.email
    except ValueError as error:
        print(f"❌ {error}")
        sys.exit(1)

    print(f"✅ Admin listo: {email}")


if __name__ == "__main__":
    main()
