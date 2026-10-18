"""Router principal de la versión v1: une todos los endpoints."""

from fastapi import APIRouter

from app.api.v1.endpoints import articulos, categorias, clientes, reservas

api_router = APIRouter()
api_router.include_router(categorias.router)
api_router.include_router(articulos.router)
api_router.include_router(clientes.router)
api_router.include_router(reservas.router)
