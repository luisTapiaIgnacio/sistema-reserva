import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import { soles } from "@/lib/fechas";
import { estadoVisible, fechaCorta, tiempoRestante } from "@/lib/estado-reserva";

export const dynamic = "force-dynamic";

const FILTROS = [
  { id: "pendientes", label: "Pendientes" },
  { id: "confirmadas", label: "Confirmadas" },
  { id: "todas", label: "Todas" },
];

type Props = { searchParams: Promise<{ filtro?: string }> };

export default async function ReservasPage({ searchParams }: Props) {
  await exigirAdmin();
  const { filtro = "pendientes" } = await searchParams;
  const ahora = new Date();

  const where: Prisma.ReservaWhereInput =
    filtro === "pendientes"
      ? { estado: "PENDIENTE", expiraEn: { gt: ahora } }
      : filtro === "confirmadas"
        ? { estado: { in: ["CONFIRMADA", "EN_CURSO"] } }
        : {};

  const orderBy: Prisma.ReservaOrderByWithRelationInput =
    filtro === "pendientes" ? { expiraEn: "asc" } : filtro === "confirmadas" ? { fechaInicio: "asc" } : { creadoEn: "desc" };

  const [reservas, totalPendientes] = await Promise.all([
    prisma.reserva.findMany({
      where,
      orderBy,
      take: 100,
      include: {
        cliente: true,
        items: { include: { producto: true, asignaciones: { include: { unidad: true } } } },
        pagos: { select: { estado: true } },
      },
    }),
    prisma.reserva.count({ where: { estado: "PENDIENTE", expiraEn: { gt: ahora } } }),
  ]);

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-white/60">Panel administrador</p>
      <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">Reservas</h1>

      {/* Filtros */}
      <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {FILTROS.map((f) => (
          <Link
            key={f.id}
            href={`/admin/reservas?filtro=${f.id}`}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
              filtro === f.id
                ? "border-[#f5c542] bg-[#f5c542] font-semibold text-[#02152b]"
                : "border-white/15 text-white/70 hover:border-[#f5c542]"
            }`}
          >
            {f.label}
            {f.id === "pendientes" && totalPendientes > 0 && ` · ${totalPendientes}`}
          </Link>
        ))}
      </div>

      {reservas.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/60">
          No hay reservas en esta lista.
        </p>
      )}

      {/* Tarjetas */}
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        {reservas.map((r) => {
          const item = r.items[0];
          const pagoInformado = r.pagos.some((p) => p.estado === "POR_VERIFICAR");
          const estado = estadoVisible(r, pagoInformado);
          const unidades = item?.asignaciones.map((a) => a.unidad.codigo).join(", ");

          return (
            <Link
              key={r.id}
              href={`/admin/reservas/${r.codigo}`}
              className={`block rounded-2xl border border-white/10 bg-[#0d1b2a] p-4 transition-colors hover:border-[#f5c542]/50 ${
                estado.urgente ? "border-l-4 border-l-amber-400" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm text-[#ffe9a8]">{r.codigo}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${estado.clase}`}>{estado.texto}</span>
              </div>
              <p className="mt-2 font-semibold text-white">{r.cliente.nombre}</p>
              <div className="mt-1 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs text-white/60">
                <span>{item?.producto.nombre}</span>
                <span className="capitalize">{fechaCorta(r.fechaInicio)}</span>
              </div>
              <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-xs">
                <span className="text-white/70">{soles(Number(r.total))}</span>
                <span className={estado.urgente ? "text-amber-300" : "text-white/50"}>
                  {r.estado === "PENDIENTE" ? tiempoRestante(r.expiraEn) : unidades ? `Unidad: ${unidades}` : ""}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
