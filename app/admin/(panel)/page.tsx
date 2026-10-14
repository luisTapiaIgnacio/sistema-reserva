import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import { aFecha, hoyLima, soles, sumarDias } from "@/lib/fechas";
import { fechaCorta, tiempoRestante } from "@/lib/estado-reserva";

export const dynamic = "force-dynamic";

export default async function ResumenPage() {
  const sesion = await exigirAdmin();
  const ahora = new Date();
  const hoy = hoyLima();

  const [totalPendientes, pendientes, porVerificar, operativas, mantenimiento, proximas] = await Promise.all([
    prisma.reserva.count({ where: { estado: "PENDIENTE", expiraEn: { gt: ahora } } }),
    prisma.reserva.findMany({
      where: { estado: "PENDIENTE", expiraEn: { gt: ahora } },
      orderBy: { expiraEn: "asc" },
      take: 5,
      include: { cliente: true },
    }),
    prisma.pago.count({ where: { estado: "POR_VERIFICAR", reserva: { estado: "PENDIENTE" } } }),
    prisma.unidad.count({ where: { estado: "OPERATIVA" } }),
    prisma.unidad.count({ where: { estado: "MANTENIMIENTO" } }),
    prisma.reserva.findMany({
      where: {
        estado: { in: ["CONFIRMADA", "EN_CURSO"] },
        fechaInicio: { gte: aFecha(hoy), lte: aFecha(sumarDias(hoy, 7)) },
      },
      orderBy: { fechaInicio: "asc" },
      include: { cliente: true, items: { include: { producto: true, asignaciones: { include: { unidad: true } } } } },
    }),
  ]);

  const tarjetas = [
    { label: "Pendientes de pago", valor: totalPendientes, alerta: totalPendientes > 0, href: "/admin/reservas?filtro=pendientes" },
    { label: "Pagos por verificar", valor: porVerificar, alerta: porVerificar > 0, href: "/admin/reservas?filtro=pendientes" },
    { label: "Eventos próximos 7 días", valor: proximas.length, href: "/admin/reservas?filtro=confirmadas" },
    { label: "Unidades operativas", valor: operativas, nota: mantenimiento ? `${mantenimiento} en mantenimiento` : undefined, href: "/admin/inventario" },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-white/60">Panel administrador</p>
      <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">
        Hola, <span className="text-[#f5c542]">{sesion.nombre}</span>
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
            {t.nota && <p className="mt-0.5 text-[11px] text-amber-300">{t.nota}</p>}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {/* Pendientes que vencen pronto */}
        <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Vencen pronto</h2>
          {pendientes.length === 0 && <p className="text-sm text-white/50">No hay reservas pendientes.</p>}
          <ul className="space-y-2">
            {pendientes.map((r) => (
              <li key={r.id}>
                <Link href={`/admin/reservas/${r.codigo}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5">
                  <span className="min-w-0">
                    <span className="block truncate text-white">{r.cliente.nombre}</span>
                    <span className="font-mono text-xs text-[#ffe9a8]">{r.codigo}</span>
                  </span>
                  <span className="shrink-0 text-xs text-amber-300">{tiempoRestante(r.expiraEn)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Próximos eventos */}
        <section className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/50">Próximos eventos</h2>
          {proximas.length === 0 && <p className="text-sm text-white/50">Sin eventos en los próximos 7 días.</p>}
          <ul className="space-y-2">
            {proximas.map((r) => {
              const item = r.items[0];
              return (
                <li key={r.id}>
                  <Link href={`/admin/reservas/${r.codigo}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-white/5">
                    <span className="min-w-0">
                      <span className="block truncate text-white">{r.cliente.nombre}</span>
                      <span className="text-xs text-white/50">
                        {item?.producto.nombre} · <span className="font-mono text-[#ffe9a8]">{item?.asignaciones.map((a) => a.unidad.codigo).join(", ")}</span>
                      </span>
                    </span>
                    <span className="shrink-0 text-right text-xs">
                      <span className="block capitalize text-white">{fechaCorta(r.fechaInicio)}</span>
                      <span className="text-white/50">{soles(Number(r.total))}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
