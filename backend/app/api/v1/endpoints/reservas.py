"""Endpoints de Reservas: crear (con validación de disponibilidad),
listar, obtener y cancelar.
"""

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.articulo import Articulo
from app.models.cliente import Cliente
from app.models.reserva import DetalleReserva, EstadoReserva, Reserva
from app.schemas.reserva import (
    DisponibilidadRead,
    ReservaCreate,
    ReservaRead,
)
from app.services.disponibilidad import unidades_disponibles

router = APIRouter(prefix="/reservas", tags=["Reservas"])


def _obtener_o_crear_cliente(db: Session, datos) -> Cliente:
    """Reutiliza el cliente si ya existe ese correo; si no, lo crea."""
    cliente = db.query(Cliente).filter(Cliente.correo == datos.correo).first()
    if cliente is None:
        cliente = Cliente(
            nombre=datos.nombre, telefono=datos.telefono, correo=datos.correo
        )
        db.add(cliente)
        db.flush()  # asigna id sin cerrar la transacción
    return cliente


@router.get("/disponibilidad", response_model=DisponibilidadRead)
def consultar_disponibilidad(
    articulo_id: int = Query(...),
    fecha_inicio: date = Query(...),
    fecha_fin: date = Query(...),
    db: Session = Depends(get_db),
) -> DisponibilidadRead:
    """Cuántas unidades de un artículo quedan libres en el periodo indicado."""
    if fecha_fin < fecha_inicio:
        raise HTTPException(
            status_code=422, detail="fecha_fin no puede ser anterior a fecha_inicio."
        )
    articulo = db.get(Articulo, articulo_id)
    if articulo is None:
        raise HTTPException(status_code=404, detail="Artículo no encontrado.")
    libres = unidades_disponibles(db, articulo, fecha_inicio, fecha_fin)
    return DisponibilidadRead(
        articulo_id=articulo.id,
        fecha_inicio=fecha_inicio,
        fecha_fin=fecha_fin,
        stock_total=articulo.stock_total,
        unidades_disponibles=libres,
    )


@router.post("", response_model=ReservaRead, status_code=status.HTTP_201_CREATED)
def crear_reserva(datos: ReservaCreate, db: Session = Depends(get_db)) -> Reserva:
    # 1. Agrupar las cantidades pedidas por artículo (por si se repite uno).
    pedido: dict[int, int] = {}
    for item in datos.items:
        pedido[item.articulo_id] = pedido.get(item.articulo_id, 0) + item.cantidad

    # 2. Validar existencia y disponibilidad de CADA artículo en el periodo.
    for articulo_id, cantidad in pedido.items():
        articulo = db.get(Articulo, articulo_id)
        if articulo is None:
            raise HTTPException(
                status_code=400, detail=f"El artículo {articulo_id} no existe."
            )
        libres = unidades_disponibles(db, articulo, datos.fecha_inicio, datos.fecha_fin)
        if cantidad > libres:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"No hay disponibilidad de '{articulo.nombre}': "
                    f"pedidas {cantidad}, libres {libres} en ese periodo."
                ),
            )

    # 3. Todo disponible -> crear cliente, reserva y detalles.
    cliente = _obtener_o_crear_cliente(db, datos.cliente)
    reserva = Reserva(
        cliente=cliente,
        fecha_inicio=datos.fecha_inicio,
        fecha_fin=datos.fecha_fin,
        mensaje=datos.mensaje,
        estado=EstadoReserva.pendiente,
    )
    for articulo_id, cantidad in pedido.items():
        reserva.detalles.append(
            DetalleReserva(articulo_id=articulo_id, cantidad=cantidad)
        )
    db.add(reserva)
    db.commit()
    db.refresh(reserva)
    return reserva


@router.get("", response_model=list[ReservaRead])
def listar_reservas(
    estado: EstadoReserva | None = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[Reserva]:
    consulta = db.query(Reserva)
    if estado is not None:
        consulta = consulta.filter(Reserva.estado == estado)
    return consulta.order_by(Reserva.creada_en.desc()).offset(skip).limit(limit).all()


@router.get("/{reserva_id}", response_model=ReservaRead)
def obtener_reserva(reserva_id: int, db: Session = Depends(get_db)) -> Reserva:
    reserva = db.get(Reserva, reserva_id)
    if reserva is None:
        raise HTTPException(status_code=404, detail="Reserva no encontrada.")
    return reserva


@router.post("/{reserva_id}/cancelar", response_model=ReservaRead)
def cancelar_reserva(reserva_id: int, db: Session = Depends(get_db)) -> Reserva:
    reserva = db.get(Reserva, reserva_id)
    if reserva is None:
        raise HTTPException(status_code=404, detail="Reserva no encontrada.")
    if reserva.estado == EstadoReserva.cancelada:
        raise HTTPException(status_code=409, detail="La reserva ya está cancelada.")
    reserva.estado = EstadoReserva.cancelada  # libera las unidades
    db.commit()
    db.refresh(reserva)
    return reserva
