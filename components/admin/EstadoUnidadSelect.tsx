"use client";

import { cambiarEstadoUnidad } from "@/app/admin/(panel)/inventario/actions";

const ESTADOS = [
  { valor: "OPERATIVA", texto: "Operativa" },
  { valor: "MANTENIMIENTO", texto: "Mantenimiento" },
  { valor: "BAJA", texto: "De baja" },
];

const PUNTO: Record<string, string> = {
  OPERATIVA: "bg-emerald-400",
  MANTENIMIENTO: "bg-amber-400",
  BAJA: "bg-white/30",
};

type Props = { id: number; codigo: string; estado: string };

// Chip de una unidad: al cambiar el estado se guarda solo
export default function EstadoUnidadSelect({ id, codigo, estado }: Props) {
  return (
    <form
      action={cambiarEstadoUnidad}
      className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-1.5 pl-3 pr-1 ${
        estado === "BAJA" ? "opacity-50" : ""
      }`}
    >
      <input type="hidden" name="id" value={id} />
      <span className={`h-2 w-2 shrink-0 rounded-full ${PUNTO[estado] ?? "bg-white/30"}`} aria-hidden="true" />
      <span className="font-mono text-sm text-[#ffe9a8]">{codigo}</span>
      <select
        name="estado"
        defaultValue={estado}
        aria-label={`Estado de ${codigo}`}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="cursor-pointer rounded-lg bg-transparent py-1 text-xs text-white/70 outline-none focus:text-white"
      >
        {ESTADOS.map((e) => (
          <option key={e.valor} value={e.valor} className="bg-[#0d1b2a] text-white">
            {e.texto}
          </option>
        ))}
      </select>
    </form>
  );
}
