"""Reúne los modelos para que SQLAlchemy los registre al importar el paquete."""

from app.models.articulo import Articulo
from app.models.categoria import Categoria
from app.models.cliente import Cliente
from app.models.reserva import DetalleReserva, EstadoReserva, Reserva

__all__ = [
    "Categoria",
    "Articulo",
    "Cliente",
    "Reserva",
    "DetalleReserva",
    "EstadoReserva",
]
