"""Router principal de la versión v1: une todos los endpoints.

Los endpoints públicos y de administración se añaden en las fases 3 y 4.
"""

from fastapi import APIRouter

api_router = APIRouter()
