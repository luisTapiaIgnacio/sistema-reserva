"""Modelo Usuario: personas que entran al panel de administración."""

from sqlalchemy import Enum, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base
from app.models.enums import Rol


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120))
    email: Mapped[str] = mapped_column(String(150), unique=True)  # siempre en minúsculas
    # Nunca la contraseña en texto: solo su hash bcrypt.
    password_hash: Mapped[str] = mapped_column(String(100))
    rol: Mapped[Rol] = mapped_column(Enum(Rol, name="rol"), default=Rol.ADMIN)
