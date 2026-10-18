"""Datos de prueba: categorías, productos y sus unidades.

Uso (desde backend/):
    python -m scripts.seed

Se puede ejecutar varias veces: lo que ya existe no se duplica.
"""

from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models import Categoria, Producto, Unidad

CATEGORIAS = [
    {"nombre": "Espejos", "slug": "espejos", "orden": 1},
    {"nombre": "Cabinas 360°", "slug": "cabinas-360", "orden": 2},
]

# Código de cada unidad = prefijo + número (ESP-001, ESP-002...).
PRODUCTOS = [
    {"nombre": "Espejo Mágico 65″", "slug": "espejo-magico-65", "precio": "650", "prefijo": "ESP", "unidades": 4},
    {"nombre": "Espejo Mágico Premium", "slug": "espejo-magico-premium", "precio": "890", "prefijo": "PRE", "unidades": 2},
    {"nombre": "Espejo Mini Selfie", "slug": "espejo-mini-selfie", "precio": "420", "prefijo": "MIN", "unidades": 3},
]


def cargar_datos(db: Session) -> None:
    categorias: dict[str, Categoria] = {}
    for datos in CATEGORIAS:
        categoria = db.scalar(select(Categoria).where(Categoria.slug == datos["slug"]))
        if categoria is None:
            categoria = Categoria(**datos)
            db.add(categoria)
        categorias[datos["slug"]] = categoria
    db.flush()

    for p in PRODUCTOS:
        producto = db.scalar(select(Producto).where(Producto.slug == p["slug"]))
        if producto is None:
            producto = Producto(
                nombre=p["nombre"],
                slug=p["slug"],
                precio=Decimal(p["precio"]),
                categoria=categorias["espejos"],
            )
            db.add(producto)
            db.flush()

        for n in range(1, p["unidades"] + 1):
            codigo = f"{p['prefijo']}-{n:03d}"
            if db.scalar(select(Unidad).where(Unidad.codigo == codigo)) is None:
                db.add(Unidad(codigo=codigo, producto_id=producto.id))

    db.commit()


def main() -> None:
    with SessionLocal() as db:
        cargar_datos(db)
    print("✅ Datos de prueba cargados")


if __name__ == "__main__":
    main()
