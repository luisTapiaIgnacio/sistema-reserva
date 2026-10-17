"""Dependencias reutilizables para los endpoints.

`get_db` abre una sesión de base de datos para cada petición y la cierra
al terminar, pase lo que pase. FastAPI la inyecta con Depends(get_db).
"""

from collections.abc import Generator

from sqlalchemy.orm import Session

from app.core.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
