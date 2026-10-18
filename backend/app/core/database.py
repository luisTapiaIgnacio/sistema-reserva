"""Conexión a la base de datos con SQLAlchemy.

- `engine`: el motor que habla con la base de datos.
- `SessionLocal`: fábrica de sesiones (cada petición usa una).
- `Base`: clase base de la que heredan todos los modelos (tablas).
"""

from sqlalchemy import MetaData, create_engine
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

# Nombres fijos para índices y restricciones: así Alembic genera
# migraciones estables (sin nombres aleatorios que cambian entre bases).
NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Todos los modelos heredan de aquí para que SQLAlchemy los registre."""

    metadata = MetaData(naming_convention=NAMING_CONVENTION)
