"""Pruebas de los scripts de datos (seed y crear admin) y del hash de contraseñas."""

import pytest
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models import Categoria, Producto, Rol, Unidad, Usuario
from scripts.crear_admin import crear_o_actualizar_admin
from scripts.seed import cargar_datos


def contar(db: Session, modelo: type) -> int:
    return db.scalar(select(func.count()).select_from(modelo))


def test_seed_carga_categorias_productos_y_unidades(db: Session) -> None:
    cargar_datos(db)

    assert contar(db, Categoria) == 2
    assert contar(db, Producto) == 3
    assert contar(db, Unidad) == 9
    espejo = db.scalar(select(Producto).where(Producto.slug == "espejo-magico-65"))
    assert sorted(u.codigo for u in espejo.unidades) == ["ESP-001", "ESP-002", "ESP-003", "ESP-004"]


def test_seed_se_puede_ejecutar_dos_veces_sin_duplicar(db: Session) -> None:
    cargar_datos(db)
    cargar_datos(db)

    assert contar(db, Categoria) == 2
    assert contar(db, Producto) == 3
    assert contar(db, Unidad) == 9


def test_hash_de_contrasena() -> None:
    hash_ = hash_password("clave-segura-123")

    assert hash_ != "clave-segura-123"
    assert verify_password("clave-segura-123", hash_)
    assert not verify_password("otra-clave", hash_)


def test_contrasena_de_mas_de_72_bytes_se_rechaza() -> None:
    with pytest.raises(ValueError):
        hash_password("a" * 73)
    assert not verify_password("a" * 73, hash_password("a" * 72))


def test_crear_admin_guarda_email_en_minusculas_y_hash(db: Session) -> None:
    usuario = crear_o_actualizar_admin(db, "  Admin@Miranda.PE ", "clave-segura-123", "Luis")

    assert usuario.email == "admin@miranda.pe"
    assert usuario.rol == Rol.ADMIN
    assert verify_password("clave-segura-123", usuario.password_hash)


def test_crear_admin_actualiza_si_ya_existe(db: Session) -> None:
    crear_o_actualizar_admin(db, "admin@miranda.pe", "clave-vieja-123", "Luis")
    usuario = crear_o_actualizar_admin(db, "admin@miranda.pe", "clave-nueva-456", "Luis T.")

    assert contar(db, Usuario) == 1
    assert usuario.nombre == "Luis T."
    assert verify_password("clave-nueva-456", usuario.password_hash)


def test_crear_admin_rechaza_contrasena_corta(db: Session) -> None:
    with pytest.raises(ValueError):
        crear_o_actualizar_admin(db, "admin@miranda.pe", "corta", "Luis")
    assert contar(db, Usuario) == 0
