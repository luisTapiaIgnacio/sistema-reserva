"""Catálogo público: categorías y productos que se pueden reservar."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models import Categoria, EstadoUnidad, Producto, Unidad
from app.schemas.catalogo import CategoriaPublica, ProductoPublico

router = APIRouter(tags=["Catálogo"])


@router.get("/categorias", response_model=list[CategoriaPublica])
def listar_categorias(db: Annotated[Session, Depends(get_db)]) -> list[Categoria]:
    """Categorías activas que tienen al menos un producto activo."""
    con_productos = select(Producto.id).where(Producto.categoria_id == Categoria.id, Producto.activo)
    return list(
        db.scalars(
            select(Categoria).where(Categoria.activa, con_productos.exists()).order_by(Categoria.orden, Categoria.id)
        )
    )


@router.get("/productos", response_model=list[ProductoPublico])
def listar_productos(
    db: Annotated[Session, Depends(get_db)],
    categoria_id: Annotated[int | None, Query(gt=0)] = None,
) -> list[ProductoPublico]:
    """Productos activos (de categorías activas), con cuántas unidades operativas tienen."""
    operativas = (
        select(func.count(Unidad.id))
        .where(Unidad.producto_id == Producto.id, Unidad.estado == EstadoUnidad.OPERATIVA)
        .scalar_subquery()
    )
    consulta = (
        select(Producto, operativas)
        .join(Categoria)
        .where(Producto.activo, Categoria.activa)
        .order_by(Producto.nombre)
    )
    if categoria_id is not None:
        consulta = consulta.where(Producto.categoria_id == categoria_id)

    return [
        ProductoPublico.model_validate({**vars(producto), "operativas": total})
        for producto, total in db.execute(consulta).all()
    ]
