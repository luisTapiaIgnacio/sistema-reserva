"""Punto de entrada de la API del Sistema de Reservas."""

from fastapi import FastAPI

from app import models  # noqa: F401  (importa los modelos para registrarlos)
from app.api.v1.api import api_router
from app.core.config import settings
from app.core.errores import ErrorNegocio, manejar_error_negocio

# Las tablas las crea Alembic: `alembic upgrade head` (ver README).

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API para la gestión de alquileres y reservas.",
    version="0.1.0",
)

app.add_exception_handler(ErrorNegocio, manejar_error_negocio)  # type: ignore[arg-type]
app.include_router(api_router, prefix="/api/v1")


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
