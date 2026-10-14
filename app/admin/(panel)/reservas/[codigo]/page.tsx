import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import { fechaLarga, aTexto, soles } from "@/lib/fechas";
import { estadoVisible, tiempoRestante, METODOS_PAGO } from "@/lib/estado-reserva";
import { ampliarPlazo, cambiarEstado, confirmarReserva, registrarPago, revisarPago } from "../actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ ok?: string; error?: string }>;
};

const tarjeta = "rounded-2xl border border-white/10 bg-[#0d1b2a] p-5";
const titulo = "mb-3 text-xs font-semibold uppercase tracking-wider text-white/50";
const campo =
  "w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-base text-white outline-none placeholder:text-white/30 focus:border-[#f5c542] md:text-sm";
const botonDorado =
  "cursor-pointer rounded-xl bg-[#f5c542] px-4 py-2.5 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8]";
const botonBorde =
  "cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors hover:border-[#f5c542] hover:text-white";

export default async function ReservaDetallePage({ params, searchParams }: Props) {
  await exigirAdmin();
  const { codigo } = await params;
  const { ok, error } = await searchParams;

  const reserva = await prisma.reserva.findUnique({
    where: { codigo },
    include: {
      cliente: true,
      items: { include: { producto: true, asignaciones: { include: { unidad: true } } } },
      pagos: { orderBy: { creadoEn: "desc" } },
    },
  });
  if (!reserva) notFound();

  const item = reserva.items[0];
  const pagoInformado = reserva.pagos.some((p) => p.estado === "POR_VERIFICAR");
  const estado = estadoVisible(reserva, pagoInformado);
  const vigente = reserva.estado === "PENDIENTE" && !!reserva.expiraEn && reserva.expiraEn > new Date();

  const total = Number(reserva.total);
  const adelanto = Number(reserva.adelanto);
  const pagado = reserva.pagos.filter((p) => p.estado !== "RECHAZADO").reduce((s, p) => s + Number(p.monto), 0);
  const fecha = fechaLarga(aTexto(reserva.fechaInicio));

  // Unidades operativas del producto y si están libres en esa fecha
  const unidades = item
    ? await prisma.unidad.findMany({
        where: { productoId: item.productoId, estado: "OPERATIVA" },
        orderBy: { codigo: "asc" },
        include: {
          asignaciones: {
            where: {
              reservaItem: {
                reserva: {
                  id: { not: reserva.id },
                  estado: { in: ["CONFIRMADA", "EN_CURSO"] },
                  fechaInicio: { lte: reserva.fechaFin },
                  fechaFin: { gte: reserva.fechaInicio },
                },
              },
            },
          },
        },
      })
    : [];
  const unidadesLibres = unidades.filter((u) => u.asignaciones.length === 0);

  // Mensaje de WhatsApp según el estado
  const h = await headers();
  const base = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const linkPago = `${base}/reserva/${reserva.codigo}?t=${reserva.tokenAcceso}`;
  const mensaje =
    reserva.estado === "PENDIENTE"
      ? `Hola ${reserva.cliente.nombre}, te escribe Miranda Magic Mirror. Tu fecha del ${fecha} para ${item?.producto.nombre} está separada (código ${reserva.codigo}). Para confirmarla, el adelanto es ${soles(adelanto)}. Aquí ves los datos de pago: ${linkPago}`
      : reserva.estado === "CONFIRMADA"
        ? `Hola ${reserva.cliente.nombre}, tu reserva ${reserva.codigo} para el ${fecha} está confirmada. ¡Gracias por confiar en Miranda Magic Mirror!`
        : `Hola ${reserva.cliente.nombre}, te escribe Miranda Magic Mirror sobre tu reserva ${reserva.codigo}.`;
  const linkWhatsapp = `https://wa.me/51${reserva.cliente.celular}?text=${encodeURIComponent(mensaje)}`;

  const activa = reserva.estado !== "CANCELADA" && reserva.estado !== "FINALIZADA";

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <Link href="/admin/reservas" className="text-sm text-white/60 hover:text-white">
          ← Reservas
        </Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-mono text-xl font-bold text-white! md:text-2xl">{reserva.codigo}</h1>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.clase}`}>
            {estado.texto}
            {reserva.estado === "PENDIENTE" && vigente && ` · ${tiempoRestante(reserva.expiraEn)}`}
          </span>
        </div>
      </div>

      {/* Avisos */}
      {ok && <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{ok}</p>}
      {error && <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        {/* Cliente */}
        <section className={tarjeta}>
          <h2 className={titulo}>Cliente</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-white/60">Nombre</dt><dd className="text-right text-white">{reserva.cliente.nombre}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/60">Celular</dt><dd className="text-right font-mono text-white">{reserva.cliente.celular}</dd></div>
            {reserva.cliente.email && <div className="flex justify-between gap-3"><dt className="text-white/60">Correo</dt><dd className="truncate text-right text-white">{reserva.cliente.email}</dd></div>}
            {reserva.distrito && <div className="flex justify-between gap-3"><dt className="text-white/60">Distrito</dt><dd className="text-right text-white">{reserva.distrito}</dd></div>}
          </dl>
          <a
            href={linkWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#25d366] py-2.5 text-sm font-semibold text-[#05301a] hover:opacity-90"
          >
            <i className="fa-brands fa-whatsapp text-base" aria-hidden="true" />
            Escribir por WhatsApp
          </a>
        </section>

        {/* Evento */}
        <section className={tarjeta}>
          <h2 className={titulo}>Evento</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-white/60">Producto</dt><dd className="text-right text-white">{item?.producto.nombre}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-white/60">Fecha</dt><dd className="text-right capitalize text-white">{fecha}</dd></div>
            {reserva.horario && <div className="flex justify-between gap-3"><dt className="text-white/60">Horario</dt><dd className="text-right text-white">{reserva.horario}</dd></div>}
            <div className="flex justify-between gap-3">
              <dt className="text-white/60">Unidad</dt>
              <dd className="text-right font-mono text-[#ffe9a8]">{item?.asignaciones.map((a) => a.unidad.codigo).join(", ") || "Sin asignar"}</dd>
            </div>
          </dl>
          <div className="my-3 h-px bg-white/10" />
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-white/60">Total</dt><dd className="text-white">{soles(total)}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Adelanto</dt><dd className="text-[#f5c542]">{soles(adelanto)}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Pagado</dt><dd className="text-emerald-300">{soles(pagado)}</dd></div>
            <div className="flex justify-between font-semibold"><dt className="text-white/60">Saldo</dt><dd className="text-white">{soles(Math.max(0, total - pagado))}</dd></div>
          </dl>
        </section>
      </div>

      {/* Pagos */}
      <section className={tarjeta}>
        <h2 className={titulo}>Pagos</h2>
        {reserva.pagos.length === 0 && <p className="text-sm text-white/50">Aún no hay pagos registrados.</p>}
        <ul className="space-y-2">
          {reserva.pagos.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm">
              <span className="font-semibold text-white">{soles(Number(p.monto))}</span>
              <span className="text-white/60">
                {METODOS_PAGO[p.metodo]} · {p.origen === "WEB" ? "informado en la web" : "registrado por admin"}
                {p.numeroOperacion && ` · N.º ${p.numeroOperacion}`}
              </span>
              <span
                className={`ml-auto rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  p.estado === "VERIFICADO" ? "bg-emerald-400/15 text-emerald-300" : p.estado === "RECHAZADO" ? "bg-red-400/15 text-red-300" : "bg-sky-400/15 text-sky-300"
                }`}
              >
                {p.estado === "VERIFICADO" ? "Verificado" : p.estado === "RECHAZADO" ? "Rechazado" : "Por verificar"}
              </span>
              {p.estado === "POR_VERIFICAR" && (
                <form action={revisarPago} className="flex w-full gap-2 sm:w-auto">
                  <input type="hidden" name="codigo" value={reserva.codigo} />
                  <input type="hidden" name="pagoId" value={p.id} />
                  <button name="decision" value="VERIFICADO" className="cursor-pointer rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-200 hover:bg-emerald-500/30">
                    Verificar
                  </button>
                  <button name="decision" value="RECHAZADO" className="cursor-pointer rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/25">
                    Rechazar
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>

        {activa && (
          <form action={registrarPago} className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-[110px_150px_1fr_auto]">
            <input type="hidden" name="codigo" value={reserva.codigo} />
            <input name="monto" type="number" step="0.01" min="0" inputMode="decimal" defaultValue={pagado === 0 ? adelanto : Math.max(0, total - pagado)} aria-label="Monto" className={campo} />
            <select name="metodo" defaultValue="YAPE" aria-label="Método" className={`${campo} cursor-pointer`}>
              {Object.entries(METODOS_PAGO).map(([valor, texto]) => (
                <option key={valor} value={valor} className="bg-[#0d1b2a]">{texto}</option>
              ))}
            </select>
            <input name="numeroOperacion" placeholder="N.º de operación (opcional)" aria-label="Número de operación" className={campo} />
            <button className={botonBorde}>Registrar pago</button>
          </form>
        )}
      </section>

      {/* Acciones según el estado */}
      {reserva.estado === "PENDIENTE" && (
        <section className={tarjeta}>
          <h2 className={titulo}>Confirmar reserva</h2>
          {unidadesLibres.length === 0 ? (
            <p className="text-sm text-red-300">No hay unidades operativas libres para esa fecha.</p>
          ) : (
            <form action={confirmarReserva} className="flex flex-col gap-2 sm:flex-row">
              <input type="hidden" name="codigo" value={reserva.codigo} />
              <select name="unidadId" aria-label="Unidad que sale" className={`${campo} cursor-pointer sm:max-w-xs`}>
                {unidadesLibres.map((u) => (
                  <option key={u.id} value={u.id} className="bg-[#0d1b2a]">{u.codigo}</option>
                ))}
              </select>
              <button className={botonDorado}>Confirmar y asignar unidad</button>
            </form>
          )}

          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {[24, 48].map((horas) => (
              <form key={horas} action={ampliarPlazo}>
                <input type="hidden" name="codigo" value={reserva.codigo} />
                <input type="hidden" name="horas" value={horas} />
                <button className={botonBorde}>Ampliar plazo +{horas} h</button>
              </form>
            ))}
          </div>
        </section>
      )}

      {reserva.estado === "CONFIRMADA" && (
        <section className={tarjeta}>
          <h2 className={titulo}>Día del evento</h2>
          <form action={cambiarEstado}>
            <input type="hidden" name="codigo" value={reserva.codigo} />
            <input type="hidden" name="estado" value="EN_CURSO" />
            <button className={botonDorado}>Marcar en curso (salió el equipo)</button>
          </form>
        </section>
      )}

      {reserva.estado === "EN_CURSO" && (
        <section className={tarjeta}>
          <h2 className={titulo}>Recojo del equipo</h2>
          <form action={cambiarEstado} className="space-y-3">
            <input type="hidden" name="codigo" value={reserva.codigo} />
            <input type="hidden" name="estado" value="FINALIZADA" />
            {item?.asignaciones.map((a) => (
              <label key={a.id} className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
                <input type="checkbox" name="mantenimiento" value={a.unidad.id} className="h-5 w-5 accent-[#f5c542]" />
                <span><span className="font-mono text-[#ffe9a8]">{a.unidad.codigo}</span> volvió con daños → enviar a mantenimiento</span>
              </label>
            ))}
            <button className={botonDorado}>Finalizar reserva</button>
          </form>
        </section>
      )}

      {/* Cancelar (con casilla de confirmación para evitar errores) */}
      {(reserva.estado === "PENDIENTE" || reserva.estado === "CONFIRMADA") && (
        <form action={cambiarEstado} className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-400/20 p-4">
          <input type="hidden" name="codigo" value={reserva.codigo} />
          <input type="hidden" name="estado" value="CANCELADA" />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
            <input type="checkbox" required className="h-5 w-5 accent-red-400" />
            Sí, quiero cancelar esta reserva
          </label>
          <button className="ml-auto cursor-pointer rounded-xl border border-red-400/40 px-4 py-2.5 text-sm text-red-300 transition-colors hover:bg-red-400/10">
            Cancelar reserva
          </button>
        </form>
      )}
    </div>
  );
}
