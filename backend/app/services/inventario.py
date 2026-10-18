"""Inventario desde el panel: categorías, productos y unidades.

No se borra nada: se desactiva (categoría/producto) o se da de BAJA (unidad),
para no perder el historial de reservas.
"""

import re
import unicodedata

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.core.errores import ErrorNegocio
from app.core.fechas import hoy_local
from app.models import Asignacion, Categoria, EstadoReserva, EstadoUnidad, Producto, Reserva, ReservaItem, Unidad
from app.schemas.inventario import (
    CategoriaAdmin,
    CategoriaCambios,
    CategoriaEntrada,
    ProductoAdmin,
    ProductoCambios,
    ProductoDetalleAdmin,
    ProductoEntrada,
    UnidadAdmin,
    UnidadCambios,
)

# ---------- Slugs ----------


def crear_slug(texto: str) -> str:
    """ "Espejo Mágico 65″" → "espejo-magico-65" """
    sin_tildes = unicodedata.normalize("NFKD", texto).encode("ascii", "ignore").decode("ascii")
    return re.sub(r"[^a-z0-9]+", "-", sin_tildes.lower()).strip("-") or "item"


def _slug_libre(db: Session, modelo: type[Categoria] | type[Producto], nombre: str, excluir_id: int | None = None) -> str:
    """Slug que no esté usado (agrega -2, -3... si hace falta)."""
    base = crear_slug(nombre)
    slug, n = base, 2
    while True:
        existente = db.scalar(select(modelo.id).where(modelo.slug == slug))
        if existente is None or existente == excluir_id:
            return slug
        slug, n = f"{base}-{n}", n + 1


# ---------- Categorías ----------


def listar_categorias(db: Session) -> list[CategoriaAdmin]:
    filas = db.execute(
        select(Categoria, func.count(Producto.id))
        .outerjoin(Producto)
        .group_by(Categoria.id)
        .order_by(Categoria.orden, Categoria.id)
    ).all()
    return [
        CategoriaAdmin(
            id=c.id, nombre=c.nombre, slug=c.slug, orden=c.orden, activa=c.activa, productos=total
        )
        for c, total in filas
    ]


def _categoria_admin(db: Session, categoria_id: int) -> CategoriaAdmin:
    return next(c for c in listar_categorias(db) if c.id == categoria_id)


def crear_categoria(db: Session, datos: CategoriaEntrada) -> CategoriaAdmin:
    nombre = datos.nombre.strip()
    orden = datos.orden
    if orden is None:
        orden = (db.scalar(select(func.max(Categoria.orden))) or 0) + 1
    categoria = Categoria(nombre=nombre, slug=_slug_libre(db, Categoria, nombre), orden=orden)
    db.add(categoria)
    db.commit()
    return _categoria_admin(db, categoria.id)


def cambiar_categoria(db: Session, categoria_id: int, cambios: CategoriaCambios) -> CategoriaAdmin:
    categoria = db.get(Categoria, categoria_id)
    if categoria is None:
        raise ErrorNegocio(404, "No existe esa categoría.")
    datos = cambios.model_dump(exclude_unset=True, exclude_none=True)
    if "nombre" in datos:
        datos["nombre"] = datos["nombre"].strip()
        datos["slug"] = _slug_libre(db, Categoria, datos["nombre"], excluir_id=categoria.id)
    for campo, valor in datos.items():
        setattr(categoria, campo, valor)
    db.commit()
    return _categoria_admin(db, categoria.id)


# ---------- Productos ----------


def _a_admin(producto: Producto, detalle: bool = False) -> ProductoAdmin | ProductoDetalleAdmin:
    conteo = {estado: 0 for estado in EstadoUnidad}
    for unidad in producto.unidades:
        conteo[unidad.estado] += 1
    datos = {
        "id": producto.id,
        "categoria_id": producto.categoria_id,
        "categoria_nombre": producto.categoria.nombre,
        "tipo": producto.tipo,
        "nombre": producto.nombre,
        "slug": producto.slug,
        "descripcion": producto.descripcion,
        "precio": producto.precio,
        "imagen": producto.imagen,
        "activo": producto.activo,
        "unidades_por_estado": conteo,
    }
    if detalle:
        unidades = sorted(producto.unidades, key=lambda u: u.codigo)
        return ProductoDetalleAdmin(**datos, unidades=[UnidadAdmin.model_validate(u) for u in unidades])
    return ProductoAdmin(**datos)


def _obtener_producto(db: Session, producto_id: int) -> Producto:
    producto = db.scalar(
        select(Producto)
        .where(Producto.id == producto_id)
        .options(selectinload(Producto.categoria), selectinload(Producto.unidades))
    )
    if producto is None:
        raise ErrorNegocio(404, "No existe ese producto.")
    return producto


def listar_productos(db: Session, categoria_id: int | None = None) -> list[ProductoAdmin]:
    consulta = (
        select(Producto)
        .options(selectinload(Producto.categoria), selectinload(Producto.unidades))
        .order_by(Producto.nombre)
    )
    if categoria_id is not None:
        consulta = consulta.where(Producto.categoria_id == categoria_id)
    return [_a_admin(p) for p in db.scalars(consulta).all()]


def ver_producto(db: Session, producto_id: int) -> ProductoDetalleAdmin:
    return _a_admin(_obtener_producto(db, producto_id), detalle=True)  # type: ignore[return-value]


def _exigir_categoria(db: Session, categoria_id: int) -> None:
    if db.get(Categoria, categoria_id) is None:
        raise ErrorNegocio(422, "Esa categoría no existe.")


def crear_producto(db: Session, datos: ProductoEntrada) -> ProductoDetalleAdmin:
    _exigir_categoria(db, datos.categoria_id)
    valores = datos.model_dump()
    valores["nombre"] = valores["nombre"].strip()
    producto = Producto(**valores, slug=_slug_libre(db, Producto, valores["nombre"]))
    db.add(producto)
    db.commit()
    return ver_producto(db, producto.id)


def cambiar_producto(db: Session, producto_id: int, cambios: ProductoCambios) -> ProductoDetalleAdmin:
    producto = _obtener_producto(db, producto_id)
    datos = cambios.model_dump(exclude_unset=True)
    # Nombre, categoría, precio, activo y tipo no pueden quedar vacíos; descripción e imagen sí.
    datos = {k: v for k, v in datos.items() if v is not None or k in ("descripcion", "imagen")}
    if "categoria_id" in datos:
        _exigir_categoria(db, datos["categoria_id"])
    if "nombre" in datos:
        datos["nombre"] = datos["nombre"].strip()
        datos["slug"] = _slug_libre(db, Producto, datos["nombre"], excluir_id=producto.id)
    # El precio nuevo solo aplica a reservas futuras: cada reserva guardó el suyo.
    for campo, valor in datos.items():
        setattr(producto, campo, valor)
    db.commit()
    return ver_producto(db, producto.id)


# ---------- Unidades ----------


def crear_unidades(db: Session, producto_id: int, cantidad: int) -> ProductoDetalleAdmin:
    """Agrega unidades con código correlativo: ESP-005, ESP-006..."""
    producto = _obtener_producto(db, producto_id)

    # Prefijo: el de sus unidades actuales (ESP) o 3 letras del nombre.
    if producto.unidades:
        prefijo = producto.unidades[0].codigo.split("-")[0]
    else:
        prefijo = crear_slug(producto.nombre).replace("-", "")[:3].upper() or "UNI"

    codigos = db.scalars(select(Unidad.codigo).where(Unidad.codigo.startswith(f"{prefijo}-"))).all()
    numeros = [int(c.split("-")[1]) for c in codigos if c.count("-") == 1 and c.split("-")[1].isdigit()]
    siguiente = max(numeros, default=0) + 1

    for n in range(siguiente, siguiente + cantidad):
        db.add(Unidad(codigo=f"{prefijo}-{n:03d}", producto_id=producto.id))
    db.commit()
    db.expire(producto)
    return ver_producto(db, producto.id)


def _reservas_futuras_con_unidad(db: Session, unidad_id: int) -> list[str]:
    return list(
        db.scalars(
            select(Reserva.codigo)
            .join(ReservaItem, ReservaItem.reserva_id == Reserva.id)
            .join(Asignacion, Asignacion.reserva_item_id == ReservaItem.id)
            .where(
                Asignacion.unidad_id == unidad_id,
                Reserva.estado.in_([EstadoReserva.CONFIRMADA, EstadoReserva.EN_CURSO]),
                Reserva.fecha_fin >= hoy_local(),
            )
            .order_by(Reserva.fecha_inicio)
        ).all()
    )


def cambiar_unidad(db: Session, unidad_id: int, cambios: UnidadCambios) -> UnidadAdmin:
    unidad = db.get(Unidad, unidad_id)
    if unidad is None:
        raise ErrorNegocio(404, "No existe esa unidad.")
    datos = cambios.model_dump(exclude_unset=True)

    nuevo_estado = datos.get("estado")
    if nuevo_estado is None:
        datos.pop("estado", None)
    elif nuevo_estado != EstadoUnidad.OPERATIVA and unidad.estado == EstadoUnidad.OPERATIVA:
        # Sacarla de servicio dejaría sin espejo a eventos ya confirmados.
        codigos = _reservas_futuras_con_unidad(db, unidad.id)
        if codigos:
            raise ErrorNegocio(
                409,
                f"{unidad.codigo} está asignada a reservas confirmadas: {', '.join(codigos)}. "
                "Cámbiale la unidad a esas reservas primero.",
                reservas=codigos,
            )

    for campo, valor in datos.items():
        setattr(unidad, campo, valor)
    db.commit()
    return UnidadAdmin.model_validate(unidad)
