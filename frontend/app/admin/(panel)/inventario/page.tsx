import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import { alternarCategoria, crearUnidad } from "./actions";
import NuevaCategoriaForm from "@/components/admin/NuevaCategoriaForm";
import EstadoUnidadSelect from "@/components/admin/EstadoUnidadSelect";

const soles = (n: number) => `S/ ${n.toFixed(2)}`;

export default async function InventarioPage() {
  await exigirAdmin();

  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    include: {
      productos: {
        orderBy: { nombre: "asc" },
        include: { unidades: { orderBy: { codigo: "asc" } } },
      },
    },
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-white/60">Panel administrador</p>
          <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">Inventario</h1>
        </div>
        <div className="w-full md:max-w-sm">
          <NuevaCategoriaForm />
        </div>
      </div>

      {categorias.length === 0 && (
        <p className="mt-10 rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/60">
          Aún no hay categorías. Crea la primera con el campo de arriba.
        </p>
      )}

      <div className="mt-8 space-y-10">
        {categorias.map((cat) => (
          <section key={cat.id}>
            {/* Encabezado de la categoría */}
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <h2 className="text-lg font-semibold">{cat.nombre}</h2>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  cat.activa ? "bg-emerald-400/15 text-emerald-300" : "bg-white/10 text-white/50"
                }`}
              >
                {cat.activa ? "Visible" : "Oculta"}
              </span>

              <div className="ml-auto flex gap-2">
                <form action={alternarCategoria}>
                  <input type="hidden" name="id" value={cat.id} />
                  <button type="submit" className="cursor-pointer rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 transition-colors hover:border-[#f5c542] hover:text-white">
                    {cat.activa ? "Ocultar" : "Mostrar"}
                  </button>
                </form>
                <Link
                  href={`/admin/inventario/producto/nuevo?categoria=${cat.id}`}
                  className="rounded-xl bg-[#f5c542] px-3 py-2 text-xs font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8]"
                >
                  + Producto
                </Link>
              </div>
            </div>

            {cat.productos.length === 0 && (
              <p className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-white/50">
                Sin productos en esta categoría.
              </p>
            )}

            {/* Productos */}
            <div className="space-y-3">
              {cat.productos.map((p) => {
                const operativas = p.unidades.filter((u) => u.estado === "OPERATIVA").length;
                return (
                  <article key={p.id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1b2a]">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-white/10 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="flex flex-wrap items-center gap-2 font-semibold">
                          {p.nombre}
                          {!p.activo && (
                            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/50">
                              Inactivo
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-white/60">
                          {soles(Number(p.precio))} · {operativas} de {p.unidades.length} operativas
                        </p>
                      </div>
                      <Link
                        href={`/admin/inventario/producto/${p.id}`}
                        className="rounded-xl border border-white/15 px-3 py-2 text-xs text-white/70 transition-colors hover:border-[#f5c542] hover:text-white"
                      >
                        Editar
                      </Link>
                    </div>

                    {/* Unidades */}
                    <div className="flex flex-wrap items-center gap-2 p-4">
                      {p.unidades.map((u) => (
                        <EstadoUnidadSelect key={u.id} id={u.id} codigo={u.codigo} estado={u.estado} />
                      ))}
                      <form action={crearUnidad}>
                        <input type="hidden" name="productoId" value={p.id} />
                        <button
                          type="submit"
                          className="cursor-pointer rounded-xl border border-dashed border-[#f5c542]/50 px-3 py-2.5 text-xs text-[#ffe9a8] transition-colors hover:bg-[#f5c542]/10"
                        >
                          + Unidad
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
