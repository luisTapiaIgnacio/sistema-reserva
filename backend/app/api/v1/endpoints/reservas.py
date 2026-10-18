"""Reservas del cliente.

El cliente no tiene cuenta: accede a su reserva con el link secreto
/reserva/{codigo}?t={token_acceso} que recibe al crearla.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.reserva import InformePagoEntrada, ReservaCreada, ReservaEntrada, ReservaPublica
from app.services import reservas as servicio

router = APIRouter(prefix="/reservas", tags=["Reservas"])

Token = Annotated[str, Query(alias="t", min_length=1, max_length=64, description="Token del link de la reserva")]


@router.post("", response_model=ReservaCreada, status_code=status.HTTP_201_CREATED)
def crear_reserva(datos: ReservaEntrada, db: Annotated[Session, Depends(get_db)]) -> ReservaCreada:
    """Separa la fecha por unas horas mientras el cliente paga el adelanto.

    Errores: 409 si no hay stock suficiente o ya tiene esta misma reserva pendiente;
    422 si los datos no son válidos o algún producto no está disponible.
    """
    reserva = servicio.crear_reserva(db, datos)
    return ReservaCreada(**servicio.a_publica(reserva).model_dump(), token_acceso=reserva.token_acceso)


@router.get("/{codigo}", response_model=ReservaPublica)
def ver_reserva(codigo: str, t: Token, db: Annotated[Session, Depends(get_db)]) -> ReservaPublica:
    return servicio.a_publica(servicio.obtener_con_token(db, codigo, t))


@router.post("/{codigo}/pagos", response_model=ReservaPublica, status_code=status.HTTP_201_CREATED)
def informar_pago(
    codigo: str, t: Token, datos: InformePagoEntrada, db: Annotated[Session, Depends(get_db)]
) -> ReservaPublica:
    """El cliente informa el N.º de operación de su adelanto; el admin lo verifica."""
    return servicio.a_publica(servicio.informar_pago(db, codigo, t, datos))
