"use client";

import { useState } from "react";

export default function CopiarBoton({ texto, etiqueta = "Copiar" }: { texto: string; etiqueta?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    // Si es una ruta ("/reserva/..."), copia el enlace completo
    const valor = texto.startsWith("/") ? `${window.location.origin}${texto}` : texto;
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      window.prompt("Copia este texto:", valor); // respaldo si el navegador no deja copiar
    }
  }

  return (
    <button
      type="button"
      onClick={copiar}
      className="shrink-0 cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold text-[#f5c542] transition-colors hover:bg-[#f5c542]/10"
    >
      {copiado ? "¡Copiado!" : etiqueta}
    </button>
  );
}