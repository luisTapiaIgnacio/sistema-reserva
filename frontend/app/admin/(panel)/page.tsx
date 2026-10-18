import Link from "next/link";
import { apiAdmin, exigirAdmin } from "@/lib/admin";
import { hoyLima, soles, sumarDias } from "@/lib/fechas";
import { fechaCorta, tiempoRestante } from "@/lib/estado-reserva";
import type { Novedades, PaginaReservas } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function ResumenPage() {
  const usuario = await exigirAdmin();
  const hoy = hoyLima();
  const proximos = { desde: hoy, hasta: sumarDias(hoy, 7), por_pagina: 20 };

  const [novedades, porConfirmar, confirmadas, enCurso] = await Promise.all([
    apiAdmin<Novedades>("/admin/novedades"),
    apiAdmin<PaginaReservas>("/admin/reservas", { query: { estado: "RESERVADA", por_pagina: 5 } }),
    apiAdmin<PaginaReservas>("/admin/reservas", { query: { estado: "CONFIRMADA", ...proximos } }),
    apiAdmin<PaginaReservas>("/admin/reservas", { query: { estado: "EN_CURSO", ...proximos } }),
  ]);
  const eventos = [...enCurso.items, ...confirmadas.items].sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));

  const tarjetas = [
    { label: "Por confirmar", valor: novedades.por_confirmar, alerta: novedades.por_confirmar > 0, href: "/admin/reservas?estado=RESERVADA" },
    { label: "Vencen en < 1 h", valor: novedades.por_vencer, alerta: novedades.por_vencer > 0, href: "/admin/reservas?estado=RESERVADA" },
    { label: "Por entregar", nota: "eventos de hoy o antes", valor: novedades.entregas_pendientes, alerta: novedades.entregas_pendientes > 0, href: "/admin/reservas?estado=CONFIRMADA" },
    { label: "Por recoger", nota: "eventos que ya terminaron", valor: novedades.recojos_pendientes, alerta: novedades.recojos_pendientes > 0, href: "/admin/reservas?estado=EN_CURSO" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-white/60">Panel administrador</p>
      <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">
        Hola, <span className="text-[#f5c542]">{usuario.nombre}</span>
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tarjetas.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`rounded-2xl border bg-[#0d1b2a] p-4 transition-colors hover:border-[#f5c542]/50 ${t.alerta ? "border-amber-400/40" : "border-white/10"}`}
          >
            <p className="text-xs text-white/60">{t.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${t.alerta ? "text-amber-300" : "text-white"}`}>{t.valor}</p>
            {t.nota && <p className="mt-0.5 text-[11px] text-white/40">{t.nota}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Reservas que esperan comprobante, las que vencen primero arriba */}
        <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Esperan comprobante</h2>
          {porConfirmar.items.length === 0 && <p className="text-sm text-white/50">No hay reservas por confirmar.</p>}
          <ul className="space-y-2">
            {porConfirmar.items.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/reservas/${r.codigo}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5">
                  <span className="min-w-0">
                    <span className="block truncate text-white">{r.cliente_nombre}</span>
                    <span className="font-mono text-xs text-[#ffe9a8]">{r.codigo}</span>
                  </span>
                  <span className="shrink-0 text-xs text-amber-300">{tiempoRestante(r.expira_en)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Próximos eventos */}
        <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Próximos 7 días</h2>
          {eventos.length === 0 && <p className="text-sm text-white/50">Sin eventos en los próximos 7 días.</p>}
          <ul className="space-y-2">
            {eventos.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/reservas/${r.codigo}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5">
                  <span className="min-w-0">
                    <span className="block truncate text-white">{r.cliente_nombre}</span>
                    <span className="block truncate text-xs text-white/50">{r.productos}</span>
                  </span>
                  <span className="shrink-0 text-right text-xs">
                    <span className="block capitalize text-white">{fechaCorta(r.fecha_inicio)}</span>
                    <span className={r.estado === "EN_CURSO" ? "text-blue-200" : "text-white/50"}>
                      {r.estado === "EN_CURSO" ? "En curso" : soles(r.total)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
