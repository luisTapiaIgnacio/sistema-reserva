"""Router principal de la versión v1: une todos los endpoints.

Los endpoints de administración se añaden en la fase 4.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import catalogo, disponibilidad, reservas

api_router = APIRouter()
api_router.include_router(catalogo.router)
api_router.include_router(disponibilidad.router)
api_router.include_router(reservas.router)
