"use client";

import Link from "next/link";
import { useActionState } from "react";
import { guardarProducto, type EstadoForm } from "@/app/admin/(panel)/inventario/actions";

type Categoria = { id: number; nombre: string };

export type ProductoInicial = {
  id?: number;
  nombre: string;
  categoriaId?: number;
  precio: string;
  descripcion: string;
  imagen: string;
  activo: boolean;
};

const inicial: EstadoForm = {};

const campo =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-white/30 focus:border-[#f5c542] md:text-sm";

export default function ProductoForm({ categorias, producto }: { categorias: Categoria[]; producto: ProductoInicial }) {
  const [estado, accion, guardando] = useActionState(guardarProducto, inicial);
  // Tras un error se muestra lo que había escrito, no los datos originales
  const v = estado.valores;
  const texto = (campo: string, original: string) => (v ? String(v[campo] ?? "") : original);

  return (
    <form action={accion} className="space-y-5 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 md:p-7">
      {producto.id && <input type="hidden" name="id" value={producto.id} />}

      <div className="space-y-2">
        <label htmlFor="nombre" className="block text-sm text-white/80">Nombre *</label>
        <input id="nombre" name="nombre" defaultValue={texto("nombre", producto.nombre)} placeholder="Espejo Mágico 65″" className={campo} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="categoriaId" className="block text-sm text-white/80">Categoría *</label>
          <select id="categoriaId" name="categoriaId" defaultValue={texto("categoria_id", String(producto.categoriaId ?? ""))} className={`${campo} cursor-pointer`}>
            {categorias.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0d1b2a]">
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="precio" className="block text-sm text-white/80">Precio (S/) *</label>
          <input id="precio" name="precio" type="number" inputMode="decimal" step="0.01" min="0" defaultValue={texto("precio", producto.precio)} placeholder="650" className={campo} />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="descripcion" className="block text-sm text-white/80">Descripción</label>
        <textarea id="descripcion" name="descripcion" rows={3} defaultValue={texto("descripcion", producto.descripcion)} className={campo} />
      </div>

      <div className="space-y-2">
        <label htmlFor="imagen" className="block text-sm text-white/80">Imagen (ruta)</label>
        <input id="imagen" name="imagen" defaultValue={texto("imagen", producto.imagen)} placeholder="/images/productos/espejo-65.jpg" className={campo} />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
        <input type="checkbox" name="activo" defaultChecked={v ? Boolean(v.activo) : producto.activo} className="h-5 w-5 accent-[#f5c542]" />
        Activo (se muestra en la web para reservar)
      </label>

      {estado.error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {estado.error}
        </p>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link href="/admin/inventario" className="rounded-xl border border-white/15 px-5 py-3 text-center text-sm text-white/70 hover:text-white">
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={guardando}
          className="cursor-pointer rounded-xl bg-[#f5c542] px-6 py-3 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8] disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar producto"}
        </button>
      </div>
    </form>
  );
}
