"""Esquemas del inventario en el panel: categorías, productos y unidades."""

from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import EstadoUnidad, TipoProducto
from app.schemas.comun import Dinero


def _limpiar(valor: object) -> object:
    """Quita espacios; "" pasa a None (para campos opcionales)."""
    if isinstance(valor, str):
        return valor.strip() or None
    return valor


# ---------- Categorías ----------


class CategoriaAdmin(BaseModel):
    id: int
    nombre: str
    slug: str
    orden: int
    activa: bool
    productos: int  # cuántos productos tiene


class CategoriaEntrada(BaseModel):
    nombre: str = Field(min_length=2, max_length=100)
    orden: int | None = Field(default=None, ge=0)  # si no se envía, va al final


class CategoriaCambios(BaseModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=100)
    orden: int | None = Field(default=None, ge=0)
    activa: bool | None = None


# ---------- Unidades ----------


class UnidadAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codigo: str
    estado: EstadoUnidad
    notas: str | None


class UnidadesNuevasEntrada(BaseModel):
    cantidad: int = Field(default=1, ge=1, le=20)


class UnidadCambios(BaseModel):
    estado: EstadoUnidad | None = None
    notas: str | None = Field(default=None, max_length=500)

    @field_validator("notas", mode="before")
    @classmethod
    def limpiar_notas(cls, valor: object) -> object:
        return _limpiar(valor)


# ---------- Productos ----------


class ProductoAdmin(BaseModel):
    id: int
    categoria_id: int
    categoria_nombre: str
    tipo: TipoProducto
    nombre: str
    slug: str
    descripcion: str | None
    precio: Dinero
    imagen: str | None
    activo: bool
    unidades_por_estado: dict[EstadoUnidad, int]


class ProductoDetalleAdmin(ProductoAdmin):
    unidades: list[UnidadAdmin]


class ProductoEntrada(BaseModel):
    nombre: str = Field(min_length=2, max_length=150)
    categoria_id: int = Field(gt=0)
    precio: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    descripcion: str | None = Field(default=None, max_length=5000)
    imagen: str | None = Field(default=None, max_length=500)
    activo: bool = True
    tipo: TipoProducto = TipoProducto.ALQUILER

    @field_validator("descripcion", "imagen", mode="before")
    @classmethod
    def opcionales(cls, valor: object) -> object:
        return _limpiar(valor)


class ProductoCambios(BaseModel):
    nombre: str | None = Field(default=None, min_length=2, max_length=150)
    categoria_id: int | None = Field(default=None, gt=0)
    precio: Decimal | None = Field(default=None, gt=0, max_digits=10, decimal_places=2)
    descripcion: str | None = Field(default=None, max_length=5000)
    imagen: str | None = Field(default=None, max_length=500)
    activo: bool | None = None
    tipo: TipoProducto | None = None

    @field_validator("descripcion", "imagen", mode="before")
    @classmethod
    def opcionales(cls, valor: object) -> object:
        return _limpiar(valor)
