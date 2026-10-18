"""Esquemas del catálogo público: categorías y productos."""

from pydantic import BaseModel, ConfigDict

from app.models.enums import TipoProducto
from app.schemas.comun import Dinero


class CategoriaPublica(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str


class ProductoPublico(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoria_id: int
    tipo: TipoProducto
    nombre: str
    slug: str
    descripcion: str | None
    precio: Dinero
    imagen: str | None
    # Unidades OPERATIVAS: el máximo que se puede pedir en un mismo día.
    operativas: int
