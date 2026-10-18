import Link from "next/link";
import { apiAdmin, exigirAdmin } from "@/lib/admin";
import { soles } from "@/lib/fechas";
import { estadoVisible, fechaCorta, tiempoRestante } from "@/lib/estado-reserva";
import type { Novedades, PaginaReservas } from "@/lib/tipos";

export const dynamic = "force-dynamic";

const FILTROS = [
  { id: "RESERVADA", label: "Por confirmar" },
  { id: "CONFIRMADA", label: "Confirmadas" },
  { id: "EN_CURSO", label: "En curso" },
  { id: "VENCIDA", label: "Vencidas" },
  { id: "TODAS", label: "Todas" },
];

const POR_PAGINA = 30;

type Props = { searchParams: Promise<{ estado?: string; buscar?: string; pagina?: string }> };

export default async function ReservasPage({ searchParams }: Props) {
  await exigirAdmin();
  const { estado = "RESERVADA", buscar = "", pagina: paginaTexto } = await searchParams;
  const pagina = Math.max(1, Number(paginaTexto) || 1);

  const [lista, novedades] = await Promise.all([
    apiAdmin<PaginaReservas>("/admin/reservas", {
      query: {
        estado: estado === "TODAS" || !FILTROS.some((f) => f.id === estado) ? undefined : estado,
        buscar,
        pagina,
        por_pagina: POR_PAGINA,
      },
    }),
    apiAdmin<Novedades>("/admin/novedades"),
  ]);
  const paginas = Math.max(1, Math.ceil(lista.total / POR_PAGINA));
  const enlace = (cambios: Record<string, string | number>) =>
    `/admin/reservas?${new URLSearchParams({ estado, ...(buscar ? { buscar } : {}), ...Object.fromEntries(Object.entries(cambios).map(([k, v]) => [k, String(v)])) })}`;

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-white/60">Panel administrador</p>
      <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">Reservas</h1>

      {/* Búsqueda */}
      <form action="/admin/reservas" className="mt-6 flex gap-2">
        <input type="hidden" name="estado" value={estado} />
        <input
          name="buscar"
          defaultValue={buscar}
          placeholder="Buscar por código, nombre o celular"
          className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-base text-white outline-none placeholder:text-white/30 focus:border-[#f5c542] md:text-sm"
        />
        <button className="shrink-0 cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white hover:border-[#f5c542]">
          Buscar
        </button>
      </form>

      {/* Filtros */}
      <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {FILTROS.map((f) => (
          <Link
            key={f.id}
            href={enlace({ estado: f.id, pagina: 1 })}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              estado === f.id
                ? "border-[#f5c542] bg-[#f5c542] font-semibold text-[#02152b]"
                : "border-white/15 text-white/70 hover:border-[#f5c542]"
            }`}
          >
            {f.label}
            {f.id === "RESERVADA" && novedades.por_confirmar > 0 && ` · ${novedades.por_confirmar}`}
          </Link>
        ))}
      </div>

      {lista.items.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/60">
          {buscar ? `No hay reservas que coincidan con "${buscar}".` : "No hay reservas en esta lista."}
        </p>
      )}

      {/* Tarjetas */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {lista.items.map((r) => {
          const visible = estadoVisible(r);
          return (
            <Link
              key={r.id}
              href={`/admin/reservas/${r.codigo}`}
              className={`block rounded-2xl border border-white/10 bg-[#0d1b2a] p-4 transition-colors hover:border-[#f5c542]/50 ${
                visible.urgente ? "border-l-4 border-l-amber-400" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-[#ffe9a8]">{r.codigo}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${visible.clase}`}>{visible.texto}</span>
              </div>
              <p className="mt-2 font-semibold text-white">{r.cliente_nombre}</p>
              <div className="mt-1 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-white/60">
                <span className="min-w-0 truncate">{r.productos}</span>
                <span className="capitalize">{fechaCorta(r.fecha_inicio)}</span>
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-xs">
                <span className="text-white/70">
                  {soles(r.total)}
                  {r.pagado > 0 && <span className="text-emerald-300"> · pagado {soles(r.pagado)}</span>}
                </span>
                <span className={visible.urgente ? "text-amber-300" : "text-white/50"}>
                  {r.estado === "RESERVADA" && !r.vencida ? tiempoRestante(r.expira_en) : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Páginas */}
      {paginas > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-3 text-sm">
          {pagina > 1 && (
            <Link href={enlace({ pagina: pagina - 1 })} className="rounded-xl border border-white/15 px-4 py-2 text-white/80 hover:border-[#f5c542]">
              ‹ Anterior
            </Link>
          )}
          <span className="text-white/50">
            Página {pagina} de {paginas}
          </span>
          {pagina < paginas && (
            <Link href={enlace({ pagina: pagina + 1 })} className="rounded-xl border border-white/15 px-4 py-2 text-white/80 hover:border-[#f5c542]">
              Siguiente ›
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
