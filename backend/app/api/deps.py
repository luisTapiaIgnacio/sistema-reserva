"""Dependencias reutilizables para los endpoints.

- `get_db` abre una sesión de base de datos para cada petición y la cierra
  al terminar, pase lo que pase.
- `usuario_actual` exige el token del panel (cabecera Authorization: Bearer ...).
- `solo_admin` además exige el rol ADMIN.
"""

from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.core.security import leer_token
from app.models import Rol, Usuario


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


Db = Annotated[Session, Depends(get_db)]

_bearer = HTTPBearer(auto_error=False, description="Token que devuelve POST /admin/login")


def usuario_actual(
    db: Db, credenciales: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)]
) -> Usuario:
    usuario_id = leer_token(credenciales.credentials) if credenciales else None
    # Se busca en la base en cada petición: si se borra el usuario, pierde el acceso al instante.
    usuario = db.get(Usuario, usuario_id) if usuario_id else None
    if usuario is None:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Inicia sesión para continuar.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return usuario


UsuarioActual = Annotated[Usuario, Depends(usuario_actual)]


def solo_admin(usuario: UsuarioActual) -> Usuario:
    if usuario.rol != Rol.ADMIN:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Solo un administrador puede hacer esto.")
    return usuario


AdminActual = Annotated[Usuario, Depends(solo_admin)]
