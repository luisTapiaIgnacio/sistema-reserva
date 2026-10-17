"""Endpoints de Clientes (solo lectura: se crean al hacer una reserva)."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.cliente import Cliente
from app.schemas.cliente import ClienteRead

router = APIRouter(prefix="/clientes", tags=["Clientes"])


@router.get("", response_model=list[ClienteRead])
def listar_clientes(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
) -> list[Cliente]:
    return db.query(Cliente).offset(skip).limit(limit).all()


@router.get("/{cliente_id}", response_model=ClienteRead)
def obtener_cliente(cliente_id: int, db: Session = Depends(get_db)) -> Cliente:
    cliente = db.get(Cliente, cliente_id)
    if cliente is None:
        raise HTTPException(status_code=404, detail="Cliente no encontrado.")
    return cliente
