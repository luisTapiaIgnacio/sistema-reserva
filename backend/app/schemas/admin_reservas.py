"""Esquemas del panel: reservas, pagos, asignación de unidades y novedades."""

import re
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.enums import CanalPago, EstadoPago, EstadoReserva, MetodoPago, OrigenPago
from app.schemas.comun import Dinero


class FiltroEstado(str, Enum):
    """Estados para filtrar. VENCIDA = RESERVADA cuyo plazo ya pasó."""

    RESERVADA = "RESERVADA"
    VENCIDA = "VENCIDA"
    CONFIRMADA = "CONFIRMADA"
    EN_CURSO = "EN_CURSO"
    FINALIZADA = "FINALIZADA"
    CANCELADA = "CANCELADA"


# ---------- Lectura ----------


class ReservaResumen(BaseModel):
    """Una fila de la lista de reservas."""

    id: int
    codigo: str
    estado: EstadoReserva
    vencida: bool
    fecha_inicio: date
    fecha_fin: date
    horario: str | None
    distrito: str | None
    cliente_nombre: str
    cliente_celular: str
    productos: str  # "2× Espejo 65″, 1× Cabina 360"
    total: Dinero
    adelanto: Dinero
    pagado: Dinero
    expira_en: datetime | None
    creado_en: datetime


class PaginaReservas(BaseModel):
    items: list[ReservaResumen]
    total: int
    pagina: int
    por_pagina: int


class ClienteAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    celular: str
    email: str | None


class UnidadBreve(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codigo: str


class ItemAdmin(BaseModel):
    id: int
    producto_id: int
    nombre: str
    cantidad: int
    precio_unitario: Dinero
    subtotal: Dinero
    unidades: list[UnidadBreve]  # asignadas al confirmar


class PagoAdmin(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    monto: Dinero
    metodo: MetodoPago
    origen: OrigenPago
    numero_operacion: str | None
    estado: EstadoPago
    creado_en: datetime


class ReservaDetalle(BaseModel):
    id: int
    codigo: str
    estado: EstadoReserva
    vencida: bool
    fecha_inicio: date
    fecha_fin: date
    horario: str | None
    distrito: str | None
    direccion: str | None
    tipo_evento: str | None
    notas: str | None
    canal_pago: CanalPago | None
    cliente: ClienteAdmin
    items: list[ItemAdmin]
    pagos: list[PagoAdmin]
    total: Dinero
    adelanto: Dinero
    pagado: Dinero
    saldo: Dinero
    expira_en: datetime | None
    creado_en: datetime
    # Para reenviarle al cliente su link: /reserva/{codigo}?t={token_acceso}
    token_acceso: str
    # Abre el chat con el cliente.
    enlace_whatsapp_cliente: str


class UnidadesItem(BaseModel):
    reserva_item_id: int
    producto_id: int
    nombre: str
    cantidad: int
    asignadas: list[UnidadBreve]
    libres: list[UnidadBreve]  # operativas y sin otra reserva confirmada esas fechas


# ---------- Acciones ----------


class PagoEntrada(BaseModel):
    monto: Decimal = Field(gt=0, max_digits=10, decimal_places=2)
    metodo: MetodoPago
    numero_operacion: str | None = None

    @field_validator("numero_operacion")
    @classmethod
    def validar_numero(cls, valor: str | None) -> str | None:
        if valor is None:
            return None
        valor = re.sub(r"\s", "", valor)
        if not valor:
            return None
        if not re.fullmatch(r"[A-Za-z0-9-]{4,30}", valor):
            raise ValueError("Revisa el número de operación.")
        return valor


class AsignacionEntrada(BaseModel):
    reserva_item_id: int
    unidad_ids: list[int] = Field(min_length=1)


class ConfirmarEntrada(BaseModel):
    """Lo que envía el botón CONFIRMAR.

    - pago: el comprobante que mandó por WhatsApp. Puede omitirse si los pagos
      ya registrados cubren el adelanto mínimo.
    - asignaciones: qué unidades van. Si se omite, el sistema elige unidades libres.
    """

    pago: PagoEntrada | None = None
    asignaciones: list[AsignacionEntrada] | None = None


class CambioEstadoEntrada(BaseModel):
    estado: Literal[EstadoReserva.EN_CURSO, EstadoReserva.FINALIZADA, EstadoReserva.CANCELADA]
    # Al FINALIZAR: unidades que volvieron dañadas → pasan a MANTENIMIENTO.
    unidades_mantenimiento: list[int] = Field(default_factory=list)
    nota: str | None = Field(default=None, max_length=500)


class AmpliarPlazoEntrada(BaseModel):
    horas: int = Field(ge=1, le=168)


class NotasEntrada(BaseModel):
    notas: str | None = Field(default=None, max_length=2000)


# ---------- Novedades ----------


class UltimaReserva(BaseModel):
    id: int
    codigo: str
    cliente_nombre: str
    creado_en: datetime


class Novedades(BaseModel):
    """Resumen que el panel consulta cada pocos segundos para avisar a la admin."""

    por_confirmar: int  # RESERVADAS vigentes: esperan comprobante
    por_vencer: int  # de esas, las que vencen en menos de 1 hora
    entregas_pendientes: int  # CONFIRMADAS cuyo evento ya empezó (hoy o antes)
    recojos_pendientes: int  # EN CURSO cuyo evento ya terminó (hoy o antes)
    ultima_reserva: UltimaReserva | None
    # Cambia cuando hay algo nuevo: si el panel ve otra firma, recarga y suena.
    firma: str
