"""Configuración de pruebas.

Creamos una base de datos SQLite en memoria, independiente de la real,
y hacemos que la API la use durante los tests (dependency override).
Así cada ejecución parte de cero y no toca tus datos.
"""

import os

# Antes de importar la app: la configuración se lee al importarla.
os.environ.setdefault("SECRET_KEY", "clave-de-pruebas-de-al-menos-32-caracteres")
os.environ.setdefault("BCRYPT_ROUNDS", "4")  # el mínimo: las pruebas no necesitan un hash lento

from collections.abc import Generator  # noqa: E402
from decimal import Decimal  # noqa: E402

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import Engine, create_engine, event  # noqa: E402
from sqlalchemy.orm import Session, sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

import app.models  # noqa: F401, E402  (registra los modelos)
from app.api.deps import get_db  # noqa: E402
from app.core.database import Base  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Categoria, EstadoUnidad, Producto, Rol, Unidad  # noqa: E402
from scripts.crear_admin import crear_o_actualizar_admin  # noqa: E402


@pytest.fixture()
def engine() -> Generator[Engine, None, None]:
    engine = create_engine(
        "sqlite://",  # base de datos en memoria
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # misma conexión en todo el test
    )

    # SQLite no aplica las claves foráneas (ni ON DELETE CASCADE) si no se le pide.
    @event.listens_for(engine, "connect")
    def activar_claves_foraneas(conexion, _registro) -> None:  # type: ignore[no-untyped-def]
        conexion.execute("PRAGMA foreign_keys=ON")

    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def session_factory(engine: Engine) -> sessionmaker[Session]:
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)


@pytest.fixture()
def db(session_factory: sessionmaker[Session]) -> Generator[Session, None, None]:
    """Sesión para preparar datos o comprobarlos directamente en la base."""
    with session_factory() as sesion:
        yield sesion


@pytest.fixture()
def client(session_factory: sessionmaker[Session]) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        sesion = session_factory()
        try:
            yield sesion
        finally:
            sesion.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture()
def catalogo(db: Session) -> dict[str, int]:
    """Espejo (2 unidades operativas + 1 en mantenimiento) y Cabina (1 unidad)."""
    espejos = Categoria(nombre="Espejos", slug="espejos", orden=1)
    cabinas = Categoria(nombre="Cabinas", slug="cabinas", orden=2)
    oculta = Categoria(nombre="Oculta", slug="oculta", orden=3, activa=False)
    espejo = Producto(nombre="Espejo 65″", slug="espejo-65", precio=Decimal("650"), categoria=espejos)
    cabina = Producto(nombre="Cabina 360", slug="cabina-360", precio=Decimal("401"), categoria=cabinas)
    inactivo = Producto(nombre="Espejo viejo", slug="espejo-viejo", precio=Decimal("100"), categoria=espejos, activo=False)
    escondido = Producto(nombre="Secreto", slug="secreto", precio=Decimal("100"), categoria=oculta)
    db.add_all([espejos, cabinas, oculta, espejo, cabina, inactivo, escondido])
    db.add_all(
        [
            Unidad(codigo="ESP-001", producto=espejo),
            Unidad(codigo="ESP-002", producto=espejo),
            Unidad(codigo="ESP-003", producto=espejo, estado=EstadoUnidad.MANTENIMIENTO),
            Unidad(codigo="CAB-001", producto=cabina),
        ]
    )
    db.commit()
    return {"espejo": espejo.id, "cabina": cabina.id, "inactivo": inactivo.id, "escondido": escondido.id}


def _cabeceras(client: TestClient, email: str, password: str) -> dict[str, str]:
    token = client.post("/api/v1/admin/login", json={"email": email, "password": password}).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture()
def admin(client: TestClient, db: Session) -> dict[str, str]:
    """Cabeceras de un usuario ADMIN con sesión iniciada."""
    crear_o_actualizar_admin(db, "admin@miranda.pe", "clave-admin-123", "Admin")
    return _cabeceras(client, "admin@miranda.pe", "clave-admin-123")


@pytest.fixture()
def operador(client: TestClient, db: Session) -> dict[str, str]:
    """Cabeceras de un usuario OPERADOR (puede gestionar reservas, no inventario)."""
    usuario = crear_o_actualizar_admin(db, "operador@miranda.pe", "clave-operador-123", "Operador")
    usuario.rol = Rol.OPERADOR
    db.commit()
    return _cabeceras(client, "operador@miranda.pe", "clave-operador-123")
