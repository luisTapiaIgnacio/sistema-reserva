// Fechas como texto "YYYY-MM-DD" para evitar errores de zona horaria.
// En la base se guardan como DATE (sin hora).

// Hoy en Lima, ej. "2026-10-13"
export function hoyLima() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export const aFecha = (texto: string) => new Date(`${texto}T00:00:00.000Z`);
export const aTexto = (fecha: Date) => fecha.toISOString().slice(0, 10);

export function sumarDias(texto: string, dias: number) {
  const f = aFecha(texto);
  f.setUTCDate(f.getUTCDate() + dias);
  return aTexto(f);
}

// "2026-11" + 1 → "2026-12"
export function moverMes(mes: string, cantidad: number) {
  const [a, m] = mes.split("-").map(Number);
  return new Date(Date.UTC(a, m - 1 + cantidad, 1)).toISOString().slice(0, 7);
}

// "domingo, 15 de noviembre de 2026"
export function fechaLarga(texto: string) {
  return new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(aFecha(texto));
}

export const soles = (n: number) => `S/ ${n.toFixed(2)}`;

// "sábado 15 de noviembre" o "del 15 al 17 de noviembre" para eventos de varios días
export function rangoFechas(inicio: string, fin: string) {
  return inicio === fin ? fechaLarga(inicio) : `del ${fechaLarga(inicio)} al ${fechaLarga(fin)}`;
}
