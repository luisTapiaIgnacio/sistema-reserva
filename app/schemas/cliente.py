"""Esquemas Pydantic de Cliente. El correo se valida con EmailStr."""

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ClienteBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=120, examples=["Ana Pérez"])
    telefono: str | None = Field(default=None, max_length=30, examples=["+51 999 888 777"])
    correo: EmailStr = Field(examples=["ana@correo.com"])


class ClienteCreate(ClienteBase):
    pass


class ClienteRead(ClienteBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
