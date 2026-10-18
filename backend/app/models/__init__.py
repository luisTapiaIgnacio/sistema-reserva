"""Reúne los modelos para que SQLAlchemy los registre al importar el paquete."""

from app.models.categoria import Categoria
from app.models.cliente import Cliente
from app.models.enums import (
    CanalPago,
    EstadoPago,
    EstadoReserva,
    EstadoUnidad,
    MetodoPago,
    OrigenPago,
    Rol,
    TipoProducto,
)
from app.models.pago import Pago
from app.models.producto import Producto
from app.models.reserva import Asignacion, Reserva, ReservaItem
from app.models.unidad import Unidad
from app.models.usuario import Usuario

__all__ = [
    "Categoria",
    "Producto",
    "Unidad",
    "Cliente",
    "Reserva",
    "ReservaItem",
    "Asignacion",
    "Pago",
    "Usuario",
    "TipoProducto",
    "EstadoUnidad",
    "EstadoReserva",
    "CanalPago",
    "MetodoPago",
    "OrigenPago",
    "EstadoPago",
    "Rol",
]
