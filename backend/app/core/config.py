"""Configuración central de la aplicación.

Lee las variables desde un archivo .env (si existe) o desde el entorno.
Así los valores sensibles (como la URL de la base de datos) no van en el código.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Sistema de Reservas API"
    # Por defecto usamos un archivo SQLite local. Fácil de cambiar por PostgreSQL.
    DATABASE_URL: str = "sqlite:///./reservas.db"


# Instancia única que importaremos en el resto del proyecto.
settings = Settings()
