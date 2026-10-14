// Cómo se muestra el estado de una reserva en el panel

type ReservaBasica = { estado: string; expiraEn: Date | null };

export function estadoVisible(r: ReservaBasica, pagoInformado = false) {
  if (r.estado === "PENDIENTE") {
    if (!r.expiraEn || r.expiraEn < new Date()) {
      return { texto: "Vencida", clase: "bg-red-400/15 text-red-300", urgente: false };
    }
    return pagoInformado
      ? { texto: "Pago por verificar", clase: "bg-sky-400/15 text-sky-300", urgente: true }
      : { texto: "Pendiente de pago", clase: "bg-amber-400/15 text-amber-300", urgente: true };
  }
  const mapa: Record<string, { texto: string; clase: string }> = {
    CONFIRMADA: { texto: "Confirmada", clase: "bg-emerald-400/15 text-emerald-300" },
    EN_CURSO: { texto: "En curso", clase: "bg-[#0054ef]/25 text-blue-200" },
    FINALIZADA: { texto: "Finalizada", clase: "bg-white/10 text-white/60" },
    CANCELADA: { texto: "Cancelada", clase: "bg-red-400/15 text-red-300" },
  };
  return { ...(mapa[r.estado] ?? { texto: r.estado, clase: "bg-white/10 text-white/60" }), urgente: false };
}

// "vence en 5 h 20 min"
export function tiempoRestante(expira: Date | null) {
  if (!expira) return "";
  const ms = expira.getTime() - Date.now();
  if (ms <= 0) return "vencida";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return h > 0 ? `vence en ${h} h ${m} min` : `vence en ${m} min`;
}

// "dom 15 nov"
export function fechaCorta(fecha: Date) {
  return new Intl.DateTimeFormat("es-PE", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(fecha);
}

export const METODOS_PAGO: Record<string, string> = {
  YAPE: "Yape",
  PLIN: "Plin",
  TRANSFERENCIA: "Transferencia",
  EFECTIVO: "Efectivo",
};
