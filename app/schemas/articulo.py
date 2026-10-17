"""Esquemas Pydantic de Artículo."""

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.categoria import CategoriaRead


class ArticuloBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100, examples=["Espejo A"])
    descripcion: str | None = Field(default=None, max_length=255)
    stock_total: int = Field(default=0, ge=0, description="Unidades disponibles")
    precio_dia: float = Field(default=0.0, ge=0, description="Precio por día")


class ArticuloCreate(ArticuloBase):
    categoria_id: int = Field(description="ID de la categoría a la que pertenece")


class ArticuloUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=100)
    descripcion: str | None = Field(default=None, max_length=255)
    stock_total: int | None = Field(default=None, ge=0)
    precio_dia: float | None = Field(default=None, ge=0)
    categoria_id: int | None = None


class ArticuloRead(ArticuloBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoria: CategoriaRead  # devolvemos la categoría anidada
