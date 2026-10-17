"""Esquemas Pydantic de Categoría: validan la entrada y dan forma a la salida."""

from pydantic import BaseModel, ConfigDict, Field


class CategoriaBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100, examples=["Espejos"])
    descripcion: str | None = Field(default=None, max_length=255)


class CategoriaCreate(CategoriaBase):
    """Datos que envía el cliente para crear una categoría."""


class CategoriaUpdate(BaseModel):
    """Para actualizar: todos los campos son opcionales."""

    nombre: str | None = Field(default=None, min_length=1, max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)


class CategoriaRead(CategoriaBase):
    """Datos que devuelve la API (incluye el id generado)."""

    model_config = ConfigDict(from_attributes=True)  # permite leer desde el modelo ORM

    id: int
