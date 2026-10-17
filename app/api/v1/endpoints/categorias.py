"""Endpoints CRUD de Categorías."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.categoria import Categoria
from app.schemas.categoria import CategoriaCreate, CategoriaRead, CategoriaUpdate

router = APIRouter(prefix="/categorias", tags=["Categorías"])


@router.post("", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED)
def crear_categoria(datos: CategoriaCreate, db: Session = Depends(get_db)) -> Categoria:
    existente = db.query(Categoria).filter(Categoria.nombre == datos.nombre).first()
    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe una categoría con el nombre '{datos.nombre}'.",
        )
    categoria = Categoria(**datos.model_dump())
    db.add(categoria)
    db.commit()
    db.refresh(categoria)
    return categoria


@router.get("", response_model=list[CategoriaRead])
def listar_categorias(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[Categoria]:
    return db.query(Categoria).offset(skip).limit(limit).all()


@router.get("/{categoria_id}", response_model=CategoriaRead)
def obtener_categoria(categoria_id: int, db: Session = Depends(get_db)) -> Categoria:
    categoria = db.get(Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada.")
    return categoria


@router.patch("/{categoria_id}", response_model=CategoriaRead)
def actualizar_categoria(
    categoria_id: int, datos: CategoriaUpdate, db: Session = Depends(get_db)
) -> Categoria:
    categoria = db.get(Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada.")
    # exclude_unset: solo actualiza los campos que el cliente envió.
    for campo, valor in datos.model_dump(exclude_unset=True).items():
        setattr(categoria, campo, valor)
    db.commit()
    db.refresh(categoria)
    return categoria


@router.delete("/{categoria_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_categoria(categoria_id: int, db: Session = Depends(get_db)) -> None:
    categoria = db.get(Categoria, categoria_id)
    if categoria is None:
        raise HTTPException(status_code=404, detail="Categoría no encontrada.")
    db.delete(categoria)
    db.commit()
