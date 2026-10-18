"""Esquemas del inicio de sesión del panel."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import Rol


class LoginEntrada(BaseModel):
    email: str = Field(min_length=3, max_length=150)
    password: str = Field(min_length=1, max_length=200)


class UsuarioPublico(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    email: str
    rol: Rol


class Sesion(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expira_en: datetime
    usuario: UsuarioPublico
