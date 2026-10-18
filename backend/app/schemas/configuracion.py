"""Esquemas de la configuración del negocio."""

import re

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CuentaBancaria(BaseModel):
    banco: str = Field(min_length=2, max_length=60)
    tipo: str = Field(min_length=2, max_length=60)
    numero: str = Field(min_length=4, max_length=40)


class ConfiguracionPublica(BaseModel):
    """Lo que necesita la web: plazo, adelanto y datos para pagar."""

    model_config = ConfigDict(from_attributes=True)

    horas_para_pagar: int
    porcentaje_adelanto: int
    whatsapp: str
    yape_plin_numero: str
    yape_plin_titular: str
    yape_plin_qr: str | None
    bancos: list[CuentaBancaria]
    bancos_titular: str


class ConfiguracionCambios(BaseModel):
    """Solo se envían los campos que cambian."""

    horas_para_pagar: int | None = Field(default=None, ge=1, le=72)
    porcentaje_adelanto: int | None = Field(default=None, ge=1, le=100)
    whatsapp: str | None = None
    yape_plin_numero: str | None = Field(default=None, min_length=6, max_length=20)
    yape_plin_titular: str | None = Field(default=None, min_length=2, max_length=120)
    yape_plin_qr: str | None = Field(default=None, max_length=500)
    bancos: list[CuentaBancaria] | None = Field(default=None, max_length=10)
    bancos_titular: str | None = Field(default=None, min_length=2, max_length=120)

    @field_validator("whatsapp")
    @classmethod
    def normalizar_whatsapp(cls, valor: str | None) -> str | None:
        """Acepta "+51 913 956 853" o "913956853" y guarda "51913956853"."""
        if valor is None:
            return None
        digitos = re.sub(r"\D", "", valor)
        if re.fullmatch(r"9\d{8}", digitos):
            digitos = "51" + digitos
        if not re.fullmatch(r"\d{10,15}", digitos):
            raise ValueError("Escribe el WhatsApp con código de país, ej. 51913956853.")
        return digitos

    @field_validator(
        "horas_para_pagar", "porcentaje_adelanto", "whatsapp", "yape_plin_numero",
        "yape_plin_titular", "bancos", "bancos_titular",
    )
    @classmethod
    def no_nulo(cls, valor: object) -> object:
        # null explícito no borra el valor: estos campos siempre deben existir.
        if valor is None:
            raise ValueError("Este campo no puede quedar vacío.")
        return valor
