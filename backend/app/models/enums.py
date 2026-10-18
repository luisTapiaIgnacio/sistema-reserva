"""Valores fijos que usan los modelos (estados, métodos de pago, roles...).

Se guardan en MAYÚSCULAS, igual que los usa el frontend ("RESERVADA", "YAPE"...).
"""

import enum


class TipoProducto(str, enum.Enum):
    ALQUILER = "ALQUILER"  # usa unidades físicas (espejos)
    SERVICIO = "SERVICIO"  # a futuro: no usa unidades


class EstadoUnidad(str, enum.Enum):
    OPERATIVA = "OPERATIVA"
    MANTENIMIENTO = "MANTENIMIENTO"
    BAJA = "BAJA"


class EstadoReserva(str, enum.Enum):
    RESERVADA = "RESERVADA"  # fecha separada; espera el comprobante por WhatsApp
    CONFIRMADA = "CONFIRMADA"
    EN_CURSO = "EN_CURSO"
    FINALIZADA = "FINALIZADA"
    CANCELADA = "CANCELADA"


class CanalPago(str, enum.Enum):
    WHATSAPP = "WHATSAPP"
    YAPE_PLIN = "YAPE_PLIN"
    TRANSFERENCIA = "TRANSFERENCIA"


class MetodoPago(str, enum.Enum):
    YAPE = "YAPE"
    PLIN = "PLIN"
    TRANSFERENCIA = "TRANSFERENCIA"
    EFECTIVO = "EFECTIVO"


class OrigenPago(str, enum.Enum):
    WHATSAPP = "WHATSAPP"  # mandó la captura por chat y el admin lo registró
    ADMIN = "ADMIN"  # pago registrado a mano (ej. saldo en efectivo)
    PASARELA = "PASARELA"  # a futuro: pago en línea (tarjeta / Yape)


class EstadoPago(str, enum.Enum):
    POR_VERIFICAR = "POR_VERIFICAR"  # a futuro: pago en línea aún sin confirmar
    VERIFICADO = "VERIFICADO"
    ANULADO = "ANULADO"  # registrado por error: no cuenta como pagado


class Rol(str, enum.Enum):
    ADMIN = "ADMIN"
    OPERADOR = "OPERADOR"
