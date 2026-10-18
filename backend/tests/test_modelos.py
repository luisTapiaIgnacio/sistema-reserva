"""Pruebas de los modelos: valores por defecto, restricciones y borrado en cascada."""

from datetime import date
from decimal import Decimal

import pytest
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import (
    Asignacion,
    Categoria,
    Cliente,
    EstadoPago,
    EstadoReserva,
    EstadoUnidad,
    MetodoPago,
    OrigenPago,
    Pago,
    Producto,
    Reserva,
    ReservaItem,
    TipoProducto,
    Unidad,
)


def crear_producto_con_unidad(db: Session) -> tuple[Producto, Unidad]:
    categoria = Categoria(nombre="Espejos", slug="espejos")
    producto = Producto(nombre="Espejo 65″", slug="espejo-65", precio=Decimal("650"), categoria=categoria)
    unidad = Unidad(codigo="ESP-001", producto=producto)
    db.add_all([categoria, producto, unidad])
    db.commit()
    return producto, unidad


def crear_reserva(db: Session, producto: Producto, codigo: str = "R-2026-0001") -> Reserva:
    cliente = db.scalar(select(Cliente).where(Cliente.celular == "987654321"))
    if cliente is None:
        cliente = Cliente(nombre="Ana Pérez", celular="987654321")
    reserva = Reserva(
        codigo=codigo,
        token_acceso=f"token-{codigo}",
        cliente=cliente,
        fecha_inicio=date(2026, 11, 15),
        fecha_fin=date(2026, 11, 15),
        total=Decimal("650"),
        adelanto=Decimal("325"),
        items=[ReservaItem(producto=producto, precio_unitario=Decimal("650"))],
    )
    db.add(reserva)
    db.commit()
    return reserva


def test_valores_por_defecto(db: Session) -> None:
    producto, unidad = crear_producto_con_unidad(db)
    reserva = crear_reserva(db, producto)

    assert producto.tipo == TipoProducto.ALQUILER
    assert producto.activo is True
    assert unidad.estado == EstadoUnidad.OPERATIVA
    assert reserva.estado == EstadoReserva.RESERVADA
    assert reserva.items[0].cantidad == 1
    assert reserva.creado_en is not None


def test_precio_se_guarda_como_decimal(db: Session) -> None:
    producto, _ = crear_producto_con_unidad(db)
    db.expire_all()

    assert db.get(Producto, producto.id).precio == Decimal("650.00")


def test_celular_de_cliente_es_unico(db: Session) -> None:
    db.add(Cliente(nombre="Ana", celular="987654321"))
    db.commit()
    db.add(Cliente(nombre="Otra Ana", celular="987654321"))

    with pytest.raises(IntegrityError):
        db.commit()


def test_numero_de_operacion_no_se_repite(db: Session) -> None:
    producto, _ = crear_producto_con_unidad(db)
    reserva = crear_reserva(db, producto)
    db.add(Pago(reserva=reserva, monto=Decimal("325"), metodo=MetodoPago.YAPE, numero_operacion="123456"))
    db.commit()
    db.add(Pago(reserva=reserva, monto=Decimal("325"), metodo=MetodoPago.YAPE, numero_operacion="123456"))

    with pytest.raises(IntegrityError):
        db.commit()


def test_pago_sin_numero_de_operacion_se_puede_repetir(db: Session) -> None:
    """Los pagos en efectivo no tienen N.º de operación: varios NULL deben convivir."""
    producto, _ = crear_producto_con_unidad(db)
    reserva = crear_reserva(db, producto)
    for _ in range(2):
        db.add(Pago(reserva=reserva, monto=Decimal("100"), metodo=MetodoPago.EFECTIVO, origen=OrigenPago.ADMIN))
    db.commit()

    assert len(reserva.pagos) == 2
    assert reserva.pagos[0].estado == EstadoPago.VERIFICADO  # lo registra el admin


def test_no_se_asigna_la_misma_unidad_dos_veces_al_mismo_item(db: Session) -> None:
    producto, unidad = crear_producto_con_unidad(db)
    item = crear_reserva(db, producto).items[0]
    db.add(Asignacion(reserva_item=item, unidad=unidad))
    db.commit()
    db.add(Asignacion(reserva_item_id=item.id, unidad_id=unidad.id))

    with pytest.raises(IntegrityError):
        db.commit()


def test_borrar_reserva_borra_items_pagos_y_asignaciones(db: Session) -> None:
    producto, unidad = crear_producto_con_unidad(db)
    reserva = crear_reserva(db, producto)
    db.add(Asignacion(reserva_item=reserva.items[0], unidad=unidad))
    db.add(Pago(reserva=reserva, monto=Decimal("325"), metodo=MetodoPago.PLIN))
    db.commit()

    db.delete(reserva)
    db.commit()

    for modelo in (ReservaItem, Pago, Asignacion):
        assert db.scalar(select(func.count()).select_from(modelo)) == 0
    # La unidad y el producto no se tocan.
    assert db.get(Unidad, unidad.id) is not None
