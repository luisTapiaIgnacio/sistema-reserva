"""Esquemas de reservas y pagos para la parte pública (el cliente)."""

import re
from datetime import date, datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

from app.core.config import settings
from app.models.enums import EstadoPago, EstadoReserva, MetodoPago
from app.schemas.comun import Dinero

# Texto opcional: "" o solo espacios se guarda como None.
TextoOpcional = Annotated[str | None, Field(default=None, max_length=60)]


def _vacio_a_none(valor: object) -> object:
    if isinstance(valor, str):
        valor = valor.strip()
        return valor or None
    return valor


# ---------- Crear reserva ----------


class ClienteEntrada(BaseModel):
    nombre: str = Field(min_length=3, max_length=120)
    celular: str
    email: EmailStr | None = None

    @field_validator("nombre", mode="before")
    @classmethod
    def limpiar_nombre(cls, valor: object) -> object:
        return " ".join(valor.split()) if isinstance(valor, str) else valor

    @field_validator("email", mode="before")
    @classmethod
    def email_vacio(cls, valor: object) -> object:
        return _vacio_a_none(valor)

    @field_validator("celular")
    @classmethod
    def normalizar_celular(cls, valor: str) -> str:
        """Acepta "+51 987 654 321", "987-654-321"... y guarda "987654321"."""
        digitos = re.sub(r"\D", "", valor)
        if len(digitos) == 11 and digitos.startswith("51"):
            digitos = digitos[2:]
        if not re.fullmatch(r"9\d{8}", digitos):
            raise ValueError("El celular debe tener 9 dígitos y empezar con 9.")
        return digitos


class ItemEntrada(BaseModel):
    producto_id: int = Field(gt=0)
    cantidad: int = Field(default=1, ge=1, le=settings.MAX_CANTIDAD_POR_PRODUCTO)


class ReservaEntrada(BaseModel):
    fecha_inicio: date
    # Si no se envía, el evento es de un solo día.
    fecha_fin: date | None = None
    horario: TextoOpcional
    distrito: TextoOpcional
    direccion: Annotated[str | None, Field(default=None, max_length=255)]
    tipo_evento: TextoOpcional
    cliente: ClienteEntrada
    items: list[ItemEntrada] = Field(min_length=1, max_length=settings.MAX_PRODUCTOS_POR_RESERVA)

    @field_validator("horario", "distrito", "direccion", "tipo_evento", mode="before")
    @classmethod
    def textos_vacios(cls, valor: object) -> object:
        return _vacio_a_none(valor)

    @model_validator(mode="after")
    def validar(self) -> "ReservaEntrada":
        if self.fecha_fin is None:
            self.fecha_fin = self.fecha_inicio
        if self.fecha_fin < self.fecha_inicio:
            raise ValueError("La fecha de fin no puede ser anterior a la de inicio.")
        if (self.fecha_fin - self.fecha_inicio).days + 1 > settings.DIAS_MAXIMOS_RESERVA:
            raise ValueError(f"La reserva puede durar como máximo {settings.DIAS_MAXIMOS_RESERVA} días.")

        ids = [item.producto_id for item in self.items]
        if len(ids) != len(set(ids)):
            raise ValueError("Cada producto debe aparecer una sola vez (usa la cantidad).")
        return self


# ---------- Ver reserva ----------


class ItemPublico(BaseModel):
    producto_id: int
    nombre: str
    cantidad: int
    precio_unitario: Dinero
    subtotal: Dinero


class PagoPublico(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    monto: Dinero
    metodo: MetodoPago
    estado: EstadoPago
    creado_en: datetime


class ReservaPublica(BaseModel):
    codigo: str
    estado: EstadoReserva
    vencida: bool  # PENDIENTE cuyo plazo de pago ya pasó (la fecha se liberó)
    pago_en_revision: bool  # hay un pago POR_VERIFICAR
    fecha_inicio: date
    fecha_fin: date
    horario: str | None
    distrito: str | None
    direccion: str | None
    tipo_evento: str | None
    cliente_nombre: str
    items: list[ItemPublico]
    total: Dinero
    adelanto: Dinero
    saldo: Dinero
    expira_en: datetime | None
    pagos: list[PagoPublico]
    creado_en: datetime


class ReservaCreada(ReservaPublica):
    # Solo se devuelve al crearla: con él se arma el link /reserva/{codigo}?t={token}
    token_acceso: str


# ---------- Informar pago ----------


class InformePagoEntrada(BaseModel):
    # En efectivo no se informa desde la web: lo registra el admin.
    metodo: Literal[MetodoPago.YAPE, MetodoPago.PLIN, MetodoPago.TRANSFERENCIA]
    numero_operacion: str

    @field_validator("numero_operacion")
    @classmethod
    def validar_numero(cls, valor: str) -> str:
        valor = re.sub(r"\s", "", valor)
        if not re.fullmatch(r"[A-Za-z0-9-]{4,30}", valor):
            raise ValueError("Revisa el número de operación.")
        return valor
