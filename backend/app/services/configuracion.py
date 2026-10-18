"""Lectura y cambio de la configuración del negocio (una sola fila)."""

from sqlalchemy.orm import Session

from app.models import Configuracion
from app.schemas.configuracion import ConfiguracionCambios

ID_CONFIGURACION = 1


def obtener_configuracion(db: Session) -> Configuracion:
    """Devuelve la configuración; la crea con valores por defecto la primera vez."""
    configuracion = db.get(Configuracion, ID_CONFIGURACION)
    if configuracion is None:
        configuracion = Configuracion(id=ID_CONFIGURACION)
        db.add(configuracion)
        db.flush()
    return configuracion


def actualizar_configuracion(db: Session, cambios: ConfiguracionCambios) -> Configuracion:
    configuracion = obtener_configuracion(db)
    for campo, valor in cambios.model_dump(exclude_unset=True).items():
        setattr(configuracion, campo, valor)
    db.commit()
    return configuracion
