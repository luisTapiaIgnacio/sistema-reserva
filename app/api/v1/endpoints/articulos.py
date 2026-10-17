"""Endpoints CRUD de Artículos."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.articulo import Articulo
from app.models.categoria import Categoria
from app.schemas.articulo import ArticuloCreate, ArticuloRead, ArticuloUpdate

router = APIRouter(prefix="/articulos", tags=["Artículos"])


def _validar_categoria(categoria_id: int, db: Session) -> None:
    if db.get(Categoria, categoria_id) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La categoría {categoria_id} no existe.",
        )


@router.post("", response_model=ArticuloRead, status_code=status.HTTP_201_CREATED)
def crear_articulo(datos: ArticuloCreate, db: Session = Depends(get_db)) -> Articulo:
    _validar_categoria(datos.categoria_id, db)
    articulo = Articulo(**datos.model_dump())
    db.add(articulo)
    db.commit()
    db.refresh(articulo)
    return articulo


@router.get("", response_model=list[ArticuloRead])
def listar_articulos(
    categoria_id: int | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[Articulo]:
    consulta = db.query(Articulo)
    if categoria_id is not None:  # filtro opcional por categoría
        consulta = consulta.filter(Articulo.categoria_id == categoria_id)
    return consulta.offset(skip).limit(limit).all()


@router.get("/{articulo_id}", response_model=ArticuloRead)
def obtener_articulo(articulo_id: int, db: Session = Depends(get_db)) -> Articulo:
    articulo = db.get(Articulo, articulo_id)
    if articulo is None:
        raise HTTPException(status_code=404, detail="Artículo no encontrado.")
    return articulo


@router.patch("/{articulo_id}", response_model=ArticuloRead)
def actualizar_articulo(
    articulo_id: int, datos: ArticuloUpdate, db: Session = Depends(get_db)
) -> Articulo:
    articulo = db.get(Articulo, articulo_id)
    if articulo is None:
        raise HTTPException(status_code=404, detail="Artículo no encontrado.")
    cambios = datos.model_dump(exclude_unset=True)
    if "categoria_id" in cambios:
        _validar_categoria(cambios["categoria_id"], db)
    for campo, valor in cambios.items():
        setattr(articulo, campo, valor)
    db.commit()
    db.refresh(articulo)
    return articulo


@router.delete("/{articulo_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_articulo(articulo_id: int, db: Session = Depends(get_db)) -> None:
    articulo = db.get(Articulo, articulo_id)
    if articulo is None:
        raise HTTPException(status_code=404, detail="Artículo no encontrado.")
    db.delete(articulo)
    db.commit()
