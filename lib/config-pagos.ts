// ⚠️ DATOS DE EJEMPLO: reemplázalos por los reales de Miranda.
// Todo lo relacionado a pagos se cambia solo en este archivo.

export const PAGOS = {
  porcentajeAdelanto: 50, // % del total que se paga para confirmar
  horasParaPagar: 24, // tiempo que la fecha queda separada

  // WhatsApp de Miranda (sin + ni espacios)
  whatsapp: "51913956853",

  yapePlin: {
    numero: "999 999 999", // ← EJEMPLO
    titular: "Miranda Magic Mirror",
    qr: "/images/pagos/qr-ejemplo.svg", // ← reemplaza por el QR real
  },

  bancos: [
    { banco: "BCP", tipo: "Cuenta corriente soles", numero: "191-0000000-0-00" }, // ← EJEMPLO
    { banco: "Interbank", tipo: "Cuenta corriente soles", numero: "200-0000000000" }, // ← EJEMPLO
    { banco: "Otros bancos", tipo: "CCI", numero: "002-191-000000000000-00" }, // ← EJEMPLO
  ],
  titularBancos: "Miranda Magic Mirror",
};
