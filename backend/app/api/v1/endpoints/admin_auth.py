"""Inicio de sesión del panel de administración."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import Db, UsuarioActual
from app.core.security import crear_token, hash_password, verify_password
from app.models import Usuario
from app.schemas.auth import LoginEntrada, Sesion, UsuarioPublico

router = APIRouter(prefix="/admin", tags=["Admin · Sesión"])

# Si el correo no existe se compara contra este hash igualmente: así la respuesta
# tarda lo mismo y no revela qué correos están registrados.
_HASH_SEÑUELO = hash_password("contraseña-que-nunca-coincide")


@router.post("/login", response_model=Sesion)
def iniciar_sesion(datos: LoginEntrada, db: Db) -> Sesion:
    email = datos.email.strip().lower()
    usuario = db.scalar(select(Usuario).where(Usuario.email == email))
    correcta = verify_password(datos.password, usuario.password_hash if usuario else _HASH_SEÑUELO)

    # Mismo mensaje en ambos casos: no revela si el correo existe.
    if usuario is None or not correcta:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Correo o contraseña incorrectos.")

    token, expira = crear_token(usuario.id)
    return Sesion(access_token=token, expira_en=expira, usuario=UsuarioPublico.model_validate(usuario))


@router.get("/yo", response_model=UsuarioPublico)
def usuario_conectado(usuario: UsuarioActual) -> Usuario:
    return usuario
