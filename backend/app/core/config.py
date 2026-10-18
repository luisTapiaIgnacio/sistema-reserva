"""Configuración central de la aplicación.

Lee las variables desde un archivo .env (si existe) o desde el entorno.
Así los valores sensibles (como la URL de la base de datos) no van en el código.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Sistema de Reservas API"
    DATABASE_URL: str = "postgresql+psycopg://reservas:reservas@localhost:5432/reservas"

    # Sesión del panel de administración (JWT).
    # Obligatorio: una frase larga y aleatoria. Genera una con:
    #   python -c "import secrets; print(secrets.token_urlsafe(48))"
    SECRET_KEY: str = ""
    HORAS_SESION: int = 12
    BCRYPT_ROUNDS: int = 12  # costo del hash de contraseñas (las pruebas usan menos)

    # Límites de las reservas. El plazo para pagar y el % de adelanto
    # se cambian desde el panel (tabla "configuracion").
    ZONA_HORARIA: str = "America/Lima"
    DIAS_MAXIMOS_RESERVA: int = 7  # de fecha_inicio a fecha_fin, ambos incluidos
    MAX_CANTIDAD_POR_PRODUCTO: int = 10
    MAX_PRODUCTOS_POR_RESERVA: int = 10


# Instancia única que importaremos en el resto del proyecto.
settings = Settings()
