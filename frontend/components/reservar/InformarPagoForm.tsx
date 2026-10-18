"use client";

import { useActionState } from "react";
import { informarPago, type EstadoInformePago } from "@/app/reserva/[codigo]/actions";

const campo =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-white/30 focus:border-[#f5c542]";

export default function InformarPagoForm({ codigo, token }: { codigo: string; token: string }) {
  const [estado, accion, enviando] = useActionState(informarPago, {} as EstadoInformePago);

  return (
    <form action={accion} className="space-y-3">
      <input type="hidden" name="codigo" value={codigo} />
      <input type="hidden" name="t" value={token} />

      <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
        <select name="metodo" defaultValue="YAPE" aria-label="Cómo pagaste" className={`${campo} cursor-pointer`}>
          <option value="YAPE" className="bg-[#0d1b2a]">Yape</option>
          <option value="PLIN" className="bg-[#0d1b2a]">Plin</option>
          <option value="TRANSFERENCIA" className="bg-[#0d1b2a]">Transferencia</option>
        </select>
        <input
          name="numeroOperacion"
          inputMode="numeric"
          required
          placeholder="N.º de operación"
          aria-label="Número de operación"
          className={campo}
        />
      </div>

      {estado.error && <p role="alert" className="text-sm text-red-300">{estado.error}</p>}

      <button
        type="submit"
        disabled={enviando}
        className="w-full cursor-pointer rounded-xl bg-[#f5c542] py-3.5 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8] disabled:opacity-60"
      >
        {enviando ? "Enviando…" : "Ya pagué, enviar N.º de operación"}
      </button>
    </form>
  );
}