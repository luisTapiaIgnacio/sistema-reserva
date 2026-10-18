"""Reservas del cliente.

El cliente no tiene cuenta: accede a su reserva con el link secreto
/reserva/{codigo}?t={token_acceso} que recibe al crearla.
"""

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.schemas.configuracion import ConfiguracionPublica
from app.schemas.reserva import ReservaCreada, ReservaEntrada, ReservaPublica
from app.services import reservas as servicio
from app.services.configuracion import obtener_configuracion

router = APIRouter(tags=["Reservas"])

Token = Annotated[str, Query(alias="t", min_length=1, max_length=64, description="Token del link de la reserva")]


@router.get("/configuracion", response_model=ConfiguracionPublica)
def ver_configuracion(db: Annotated[Session, Depends(get_db)]) -> ConfiguracionPublica:
    """Plazo para pagar, % de adelanto, WhatsApp y datos de pago (Yape/Plin, bancos)."""
    return ConfiguracionPublica.model_validate(obtener_configuracion(db))


@router.post("/reservas", response_model=ReservaCreada, status_code=status.HTTP_201_CREATED)
def crear_reserva(datos: ReservaEntrada, db: Annotated[Session, Depends(get_db)]) -> ReservaCreada:
    """Separa la fecha mientras el cliente manda su comprobante por WhatsApp.

    Errores: 409 si no hay stock suficiente o ya tiene esta misma reserva separada;
    422 si los datos no son válidos o algún producto no está disponible.
    """
    reserva = servicio.crear_reserva(db, datos)
    return ReservaCreada(**servicio.a_publica(db, reserva).model_dump(), token_acceso=reserva.token_acceso)


@router.get("/reservas/{codigo}", response_model=ReservaPublica)
def ver_reserva(codigo: str, t: Token, db: Annotated[Session, Depends(get_db)]) -> ReservaPublica:
    return servicio.a_publica(db, servicio.obtener_con_token(db, codigo, t))
