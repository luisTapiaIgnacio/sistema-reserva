"""Configuración central de la aplicación.

Lee las variables desde un archivo .env (si existe) o desde el entorno.
Así los valores sensibles (como la URL de la base de datos) no van en el código.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Sistema de Reservas API"
    DATABASE_URL: str = "postgresql+psycopg://reservas:reservas@localhost:5432/reservas"

    # Reglas de negocio de las reservas.
    ZONA_HORARIA: str = "America/Lima"
    PORCENTAJE_ADELANTO: int = 50  # % del total que se paga para confirmar
    HORAS_PARA_PAGAR: int = 24  # tiempo que la fecha queda separada sin pagar
    DIAS_MAXIMOS_RESERVA: int = 7  # de fecha_inicio a fecha_fin, ambos incluidos
    MAX_CANTIDAD_POR_PRODUCTO: int = 10
    MAX_PRODUCTOS_POR_RESERVA: int = 10


# Instancia única que importaremos en el resto del proyecto.
settings = Settings()
