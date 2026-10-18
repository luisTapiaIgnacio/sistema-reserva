// Cómo se muestra el estado de una reserva (web y panel)
import type { EstadoReserva, MetodoPago } from "./tipos";

type ReservaBasica = { estado: EstadoReserva; vencida: boolean };
type Estilo = { texto: string; clase: string; urgente: boolean };

const ESTILOS: Record<EstadoReserva, Omit<Estilo, "urgente">> = {
  RESERVADA: { texto: "Reservada", clase: "bg-amber-400/15 text-amber-300" },
  CONFIRMADA: { texto: "Confirmada", clase: "bg-emerald-400/15 text-emerald-300" },
  EN_CURSO: { texto: "En curso", clase: "bg-[#0054ef]/25 text-blue-200" },
  FINALIZADA: { texto: "Finalizada", clase: "bg-white/10 text-white/60" },
  CANCELADA: { texto: "Cancelada", clase: "bg-red-400/15 text-red-300" },
};

export function estadoVisible(r: ReservaBasica): Estilo {
  if (r.vencida) return { texto: "Vencida", clase: "bg-red-400/15 text-red-300", urgente: false };
  // Una RESERVADA vigente espera el comprobante: la admin debe revisarla
  return { ...ESTILOS[r.estado], urgente: r.estado === "RESERVADA" };
}

// "vence en 5 h 20 min"
export function tiempoRestante(expira: string | null) {
  if (!expira) return "";
  const ms = new Date(expira).getTime() - Date.now();
  if (ms <= 0) return "vencida";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `vence en ${h} h ${m} min` : `vence en ${m} min`;
}

// "dom 15 nov" (la fecha llega como "2026-11-15")
export function fechaCorta(fecha: string) {
  return new Intl.DateTimeFormat("es-PE", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(
    new Date(`${fecha}T00:00:00Z`)
  );
}

// "15/11 18:05" en hora de Lima
export function fechaHora(instante: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Lima",
  }).format(new Date(instante));
}

export const METODOS_PAGO: Record<MetodoPago, string> = {
  YAPE: "Yape",
  PLIN: "Plin",
  TRANSFERENCIA: "Transferencia",
  EFECTIVO: "Efectivo",
};
