"""Punto de entrada de la API del Sistema de Reservas."""

from fastapi import FastAPI

from app import models  # noqa: F401  (importa los modelos para registrarlos)
from app.api.v1.api import api_router
from app.core.config import settings
from app.core.database import Base, engine

# Crea las tablas en la base de datos si no existen.
# (Más adelante esto lo sustituiremos por migraciones con Alembic.)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la gestión de alquileres y reservas.",
    version="0.1.0",
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
