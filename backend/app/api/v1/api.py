"""Router principal de la versión v1: une todos los endpoints."""

from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin_auth,
    admin_inventario,
    admin_reservas,
    catalogo,
    disponibilidad,
    reservas,
)

api_router = APIRouter()

# Públicos (la web)
api_router.include_router(catalogo.router)
api_router.include_router(disponibilidad.router)
api_router.include_router(reservas.router)

# Panel de administración (requieren sesión)
api_router.include_router(admin_auth.router)
api_router.include_router(admin_reservas.router)
api_router.include_router(admin_inventario.router)
