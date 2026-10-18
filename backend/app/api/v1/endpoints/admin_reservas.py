"""Panel: reservas, pagos, unidades asignadas y novedades. Requiere sesión."""

from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, Query, status

from app.api.deps import Db, usuario_actual
from app.schemas.admin_reservas import (
    AmpliarPlazoEntrada,
    AsignacionEntrada,
    CambioEstadoEntrada,
    ConfirmarEntrada,
    FiltroEstado,
    NotasEntrada,
    Novedades,
    PagoEntrada,
    PaginaReservas,
    ReservaDetalle,
    UnidadesItem,
)
from app.services import admin_reservas as servicio

router = APIRouter(prefix="/admin", tags=["Admin · Reservas"], dependencies=[Depends(usuario_actual)])


@router.get("/novedades", response_model=Novedades)
def ver_novedades(db: Db) -> Novedades:
    """Contadores para los avisos del panel. Pensado para consultarse cada 15 s."""
    return servicio.novedades(db)


@router.get("/reservas", response_model=PaginaReservas)
def listar_reservas(
    db: Db,
    estado: FiltroEstado | None = None,
    desde: Annotated[date | None, Query(description="Eventos que terminan este día o después")] = None,
    hasta: Annotated[date | None, Query(description="Eventos que empiezan este día o antes")] = None,
    buscar: Annotated[str | None, Query(max_length=100, description="Código, nombre o celular")] = None,
    pagina: Annotated[int, Query(ge=1)] = 1,
    por_pagina: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PaginaReservas:
    """Lista con filtros. Con estado=RESERVADA salen primero las que están por vencer."""
    reservas, total = servicio.listar(db, estado, desde, hasta, buscar, pagina, por_pagina)
    return PaginaReservas(
        items=[servicio.a_resumen(r) for r in reservas], total=total, pagina=pagina, por_pagina=por_pagina
    )


@router.get("/reservas/{codigo}", response_model=ReservaDetalle)
def ver_reserva(codigo: str, db: Db) -> ReservaDetalle:
    return servicio.a_detalle(servicio.obtener(db, codigo))


@router.get("/reservas/{codigo}/unidades", response_model=list[UnidadesItem])
def ver_unidades(codigo: str, db: Db) -> list[UnidadesItem]:
    """Unidades asignadas y libres de cada producto, para elegir al confirmar."""
    return servicio.unidades_por_item(db, servicio.obtener(db, codigo))


@router.post("/reservas/{codigo}/confirmar", response_model=ReservaDetalle)
def confirmar(codigo: str, datos: ConfirmarEntrada, db: Db) -> ReservaDetalle:
    """Botón CONFIRMAR: registra el pago del comprobante y asigna las unidades.

    Exige que lo pagado llegue al adelanto mínimo de la reserva.
    """
    return servicio.a_detalle(servicio.confirmar(db, codigo, datos))


@router.put("/reservas/{codigo}/unidades", response_model=ReservaDetalle)
def cambiar_unidades(codigo: str, asignaciones: list[AsignacionEntrada], db: Db) -> ReservaDetalle:
    return servicio.a_detalle(servicio.cambiar_asignaciones(db, codigo, asignaciones))


@router.post("/reservas/{codigo}/estado", response_model=ReservaDetalle)
def cambiar_estado(codigo: str, datos: CambioEstadoEntrada, db: Db) -> ReservaDetalle:
    """EN_CURSO (se entregó), FINALIZADA (se recogió) o CANCELADA."""
    return servicio.a_detalle(servicio.cambiar_estado(db, codigo, datos))


@router.post("/reservas/{codigo}/ampliar-plazo", response_model=ReservaDetalle)
def ampliar_plazo(codigo: str, datos: AmpliarPlazoEntrada, db: Db) -> ReservaDetalle:
    return servicio.a_detalle(servicio.ampliar_plazo(db, codigo, datos.horas))


@router.put("/reservas/{codigo}/notas", response_model=ReservaDetalle)
def guardar_notas(codigo: str, datos: NotasEntrada, db: Db) -> ReservaDetalle:
    return servicio.a_detalle(servicio.guardar_notas(db, codigo, datos.notas))


@router.post("/reservas/{codigo}/pagos", response_model=ReservaDetalle, status_code=status.HTTP_201_CREATED)
def registrar_pago(codigo: str, datos: PagoEntrada, db: Db) -> ReservaDetalle:
    """Pagos después de confirmar: otro abono o el saldo del día del evento."""
    return servicio.a_detalle(servicio.registrar_pago(db, codigo, datos))


@router.post("/reservas/{codigo}/pagos/{pago_id}/anular", response_model=ReservaDetalle)
def anular_pago(codigo: str, pago_id: int, db: Db) -> ReservaDetalle:
    return servicio.a_detalle(servicio.anular_pago(db, codigo, pago_id))
