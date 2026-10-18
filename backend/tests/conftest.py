"""Configuración de pruebas.

Creamos una base de datos SQLite en memoria, independiente de la real,
y hacemos que la API la use durante los tests (dependency override).
Así cada ejecución parte de cero y no toca tus datos.
"""

from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401  (registra los modelos)
from app.api.deps import get_db
from app.core.database import Base
from app.main import app


@pytest.fixture()
def client() -> Generator[TestClient, None, None]:
    engine = create_engine(
        "sqlite://",  # base de datos en memoria
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,  # misma conexión en todo el test
    )
    TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
    Base.metadata.create_all(bind=engine)

    def override_get_db() -> Generator:
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
