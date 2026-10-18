"""Panel: inventario (categorías, productos, unidades) y configuración. Solo ADMIN."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import Db, solo_admin
from app.schemas.configuracion import ConfiguracionCambios, ConfiguracionPublica
from app.schemas.inventario import (
    CategoriaAdmin,
    CategoriaCambios,
    CategoriaEntrada,
    ProductoAdmin,
    ProductoCambios,
    ProductoDetalleAdmin,
    ProductoEntrada,
    UnidadAdmin,
    UnidadCambios,
    UnidadesNuevasEntrada,
)
from app.services import inventario as servicio
from app.services.configuracion import actualizar_configuracion, obtener_configuracion

router = APIRouter(prefix="/admin", tags=["Admin · Inventario"], dependencies=[Depends(solo_admin)])


# ---------- Categorías ----------


@router.get("/categorias", response_model=list[CategoriaAdmin])
def listar_categorias(db: Db) -> list[CategoriaAdmin]:
    """Todas, incluidas las desactivadas."""
    return servicio.listar_categorias(db)


@router.post("/categorias", response_model=CategoriaAdmin, status_code=status.HTTP_201_CREATED)
def crear_categoria(datos: CategoriaEntrada, db: Db) -> CategoriaAdmin:
    return servicio.crear_categoria(db, datos)


@router.patch("/categorias/{categoria_id}", response_model=CategoriaAdmin)
def cambiar_categoria(categoria_id: int, cambios: CategoriaCambios, db: Db) -> CategoriaAdmin:
    """Renombrar, reordenar o activar/desactivar (desactivada no se ve en la web)."""
    return servicio.cambiar_categoria(db, categoria_id, cambios)


# ---------- Productos ----------


@router.get("/productos", response_model=list[ProductoAdmin])
def listar_productos(db: Db, categoria_id: Annotated[int | None, Query(gt=0)] = None) -> list[ProductoAdmin]:
    return servicio.listar_productos(db, categoria_id)


@router.get("/productos/{producto_id}", response_model=ProductoDetalleAdmin)
def ver_producto(producto_id: int, db: Db) -> ProductoDetalleAdmin:
    return servicio.ver_producto(db, producto_id)


@router.post("/productos", response_model=ProductoDetalleAdmin, status_code=status.HTTP_201_CREATED)
def crear_producto(datos: ProductoEntrada, db: Db) -> ProductoDetalleAdmin:
    return servicio.crear_producto(db, datos)


@router.patch("/productos/{producto_id}", response_model=ProductoDetalleAdmin)
def cambiar_producto(producto_id: int, cambios: ProductoCambios, db: Db) -> ProductoDetalleAdmin:
    return servicio.cambiar_producto(db, producto_id, cambios)


@router.post(
    "/productos/{producto_id}/unidades", response_model=ProductoDetalleAdmin, status_code=status.HTTP_201_CREATED
)
def crear_unidades(producto_id: int, datos: UnidadesNuevasEntrada, db: Db) -> ProductoDetalleAdmin:
    """Agrega unidades con código correlativo (ESP-005, ESP-006...)."""
    return servicio.crear_unidades(db, producto_id, datos.cantidad)


@router.patch("/unidades/{unidad_id}", response_model=UnidadAdmin)
def cambiar_unidad(unidad_id: int, cambios: UnidadCambios, db: Db) -> UnidadAdmin:
    """Estado (OPERATIVA / MANTENIMIENTO / BAJA) y notas."""
    return servicio.cambiar_unidad(db, unidad_id, cambios)


# ---------- Configuración ----------


@router.get("/configuracion", response_model=ConfiguracionPublica)
def ver_configuracion(db: Db) -> ConfiguracionPublica:
    return ConfiguracionPublica.model_validate(obtener_configuracion(db))


@router.patch("/configuracion", response_model=ConfiguracionPublica)
def cambiar_configuracion(cambios: ConfiguracionCambios, db: Db) -> ConfiguracionPublica:
    """Plazo para pagar, % de adelanto, WhatsApp y datos de pago.

    Solo afecta a las reservas nuevas: las existentes conservan su plazo y adelanto.
    """
    return ConfiguracionPublica.model_validate(actualizar_configuracion(db, cambios))
