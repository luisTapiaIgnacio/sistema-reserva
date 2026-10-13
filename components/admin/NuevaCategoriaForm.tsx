"use client";

import { useActionState } from "react";
import { crearCategoria, type EstadoForm } from "@/app/admin/(panel)/inventario/actions";

const inicial: EstadoForm = {};

export default function NuevaCategoriaForm() {
  const [estado, accion, cargando] = useActionState(crearCategoria, inicial);

  return (
    <div>
      {/* key: limpia el campo después de crear */}
      <form key={estado.ok} action={accion} className="flex gap-2">
        <input
          name="nombre"
          placeholder="Nueva categoría (ej. Accesorios)"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/30 focus:border-[#f5c542] md:text-sm"
        />
        <button
          type="submit"
          disabled={cargando}
          className="shrink-0 cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white transition-colors hover:border-[#f5c542] disabled:opacity-50"
        >
          + Categoría
        </button>
      </form>
      {estado.error && <p className="mt-2 text-sm text-red-300">{estado.error}</p>}
      {estado.ok && <p className="mt-2 text-sm text-emerald-300">{estado.ok}</p>}
    </div>
  );
}
