"""Configuración de pruebas.

Creamos una base de datos SQLite en memoria, independiente de la real,
y hacemos que la API la use durante los tests (dependency override).
Así cada ejecución parte de cero y no toca tus datos.
"""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, create_engine, event
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  (registra los modelos)
from app.api.deps import get_db
from app.core.database import Base
from app.main import app


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
