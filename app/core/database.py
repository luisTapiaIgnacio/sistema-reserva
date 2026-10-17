"""Conexión a la base de datos con SQLAlchemy.

- `engine`: el motor que habla con la base de datos.
- `SessionLocal`: fábrica de sesiones (cada petición usa una).
- `Base`: clase base de la que heredan todos los modelos (tablas).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import settings

# SQLite necesita este argumento extra cuando se usa con varios hilos (como hace FastAPI).
connect_args = (
    {"check_same_thread": False}
    if settings.DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Todos los modelos heredan de aquí para que SQLAlchemy los registre."""

    pass
