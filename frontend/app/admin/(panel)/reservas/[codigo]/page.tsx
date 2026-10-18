import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { apiAdmin, exigirAdmin } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import { rangoFechas, soles } from "@/lib/fechas";
import { estadoVisible, fechaHora, METODOS_PAGO, tiempoRestante } from "@/lib/estado-reserva";
import type { ReservaDetalle, UnidadesItem } from "@/lib/tipos";
import { ampliarPlazo, anularPago, cambiarEstado, confirmarReserva, guardarNotas, registrarPago } from "../actions";

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
  "cursor-pointer rounded-xl bg-[#f5c542] px-4 py-2.5 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8] disabled:cursor-not-allowed disabled:opacity-40";
const botonBorde =
  "cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors hover:border-[#f5c542] hover:text-white";

const PLAZOS = [1, 2, 4, 24];

async function cargar(codigo: string) {
  try {
    const reserva = await apiAdmin<ReservaDetalle>(`/admin/reservas/${encodeURIComponent(codigo)}`);
    // Unidades libres solo hacen falta para confirmar
    const unidades =
      reserva.estado === "RESERVADA"
        ? await apiAdmin<UnidadesItem[]>(`/admin/reservas/${encodeURIComponent(codigo)}/unidades`)
        : [];
    return { reserva, unidades };
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}

export default async function ReservaDetallePage({ params, searchParams }: Props) {
  await exigirAdmin();
  const { codigo } = await params;
  const { ok, error } = await searchParams;
  const { reserva, unidades } = await cargar(codigo);

  const estado = estadoVisible(reserva);
  const fecha = rangoFechas(reserva.fecha_inicio, reserva.fecha_fin);
  const productos = reserva.items.map((i) => `${i.cantidad}× ${i.nombre}`).join(", ");
  const verificados = reserva.pagos.filter((p) => p.estado === "VERIFICADO");
  const faltaParaAdelanto = Math.max(0, reserva.adelanto - reserva.pagado);
  const faltanUnidades = unidades.some((u) => u.libres.length < u.cantidad);

  // Mensaje de WhatsApp para el cliente según el estado
  const h = await headers();
  const base = `${h.get("x-forwarded-proto") ?? "http"}://${h.get("host")}`;
  const linkCliente = `${base}/reserva/${reserva.codigo}?t=${reserva.token_acceso}`;
  const nombre = reserva.cliente.nombre.split(" ")[0];
  const mensaje =
    reserva.estado === "RESERVADA"
      ? `Hola ${nombre}, te escribe Miranda Magic Mirror. Tu reserva ${reserva.codigo} (${productos}, ${fecha}) está separada. Para confirmarla envíanos el comprobante del adelanto de ${soles(reserva.adelanto)}. Aquí ves los datos de pago: ${linkCliente}`
      : reserva.estado === "CONFIRMADA"
        ? `Hola ${nombre}, tu reserva ${reserva.codigo} para el ${fecha} está confirmada. ¡Gracias por confiar en Miranda Magic Mirror!`
        : `Hola ${nombre}, te escribe Miranda Magic Mirror sobre tu reserva ${reserva.codigo}.`;
  const linkWhatsapp = `${reserva.enlace_whatsapp_cliente}?text=${encodeURIComponent(mensaje)}`;

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
            {reserva.estado === "RESERVADA" && !reserva.vencida && ` · ${tiempoRestante(reserva.expira_en)}`}
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
            {reserva.direccion && <div className="flex justify-between gap-3"><dt className="text-white/60">Dirección</dt><dd className="text-right text-white">{reserva.direccion}</dd></div>}
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
          <p className="mt-2 text-center text-[11px] text-white/40">Reservada el {fechaHora(reserva.creado_en)}</p>
        </section>

        {/* Evento */}
        <section className={tarjeta}>
          <h2 className={titulo}>Evento</h2>
          <ul className="space-y-2 text-sm">
            {reserva.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span className="text-white">
                  {item.cantidad}× {item.nombre}
                  {item.unidades.length > 0 && (
                    <span className="block font-mono text-xs text-[#ffe9a8]">{item.unidades.map((u) => u.codigo).join(", ")}</span>
                  )}
                </span>
                <span className="shrink-0 tabular-nums text-white/70">{soles(item.subtotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-white/60">Fecha</dt><dd className="text-right first-letter:uppercase text-white">{fecha}</dd></div>
            {reserva.horario && <div className="flex justify-between gap-3"><dt className="text-white/60">Horario</dt><dd className="text-right text-white">{reserva.horario}</dd></div>}
          </dl>
          <dl className="mt-3 space-y-2 border-t border-white/10 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-white/60">Total</dt><dd className="text-white">{soles(reserva.total)}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Adelanto mínimo</dt><dd className="text-[#f5c542]">{soles(reserva.adelanto)}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Pagado</dt><dd className="text-emerald-300">{soles(reserva.pagado)}</dd></div>
            <div className="flex justify-between font-semibold"><dt className="text-white/60">Saldo</dt><dd className="text-white">{soles(reserva.saldo)}</dd></div>
          </dl>
        </section>
      </div>

      {/* ---------- CONFIRMAR: comprobante + unidades ---------- */}
      {reserva.estado === "RESERVADA" && (
        <section className={`${tarjeta} border-[#f5c542]/40`}>
          <h2 className={titulo}>Confirmar reserva</h2>
          {reserva.vencida && (
            <p className="mb-4 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              El plazo venció. Puedes confirmarla igual si las unidades siguen libres.
            </p>
          )}
          <form action={confirmarReserva} className="space-y-4">
            <input type="hidden" name="codigo" value={reserva.codigo} />

            <div>
              <p className="mb-2 text-sm text-white/80">
                Comprobante recibido
                {faltaParaAdelanto === 0 && <span className="text-emerald-300"> · los pagos registrados ya cubren el adelanto</span>}
              </p>
              <div className="grid gap-2 sm:grid-cols-[120px_150px_1fr]">
                <input name="monto" type="number" step="0.01" min="0" inputMode="decimal" defaultValue={faltaParaAdelanto || ""} aria-label="Monto" placeholder="Monto" className={campo} />
                <select name="metodo" defaultValue="YAPE" aria-label="Método de pago" className={`${campo} cursor-pointer`}>
                  {Object.entries(METODOS_PAGO).map(([valor, texto]) => (
                    <option key={valor} value={valor} className="bg-[#0d1b2a]">{texto}</option>
                  ))}
                </select>
                <input name="numeroOperacion" placeholder="N.º de operación (opcional)" aria-label="Número de operación" className={campo} />
              </div>
              <p className="mt-1.5 text-xs text-white/50">Mínimo {soles(reserva.adelanto)}. Si pagó más, escribe el monto real.</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-white/80">Unidades que salen (elegidas automáticamente, puedes cambiarlas)</p>
              <div className="space-y-2">
                {unidades.map((item) => (
                  <div key={item.reserva_item_id} className="flex flex-wrap items-center gap-2">
                    <span className="min-w-36 text-sm text-white">{item.nombre}</span>
                    {item.libres.length < item.cantidad ? (
                      <span className="text-sm text-red-300">
                        Solo {item.libres.length} de {item.cantidad} libres para esas fechas
                      </span>
                    ) : (
                      Array.from({ length: item.cantidad }, (_, n) => (
                        <select
                          key={n}
                          name={`unidad-${item.reserva_item_id}`}
                          defaultValue={item.libres[n].id}
                          aria-label={`Unidad ${n + 1} de ${item.nombre}`}
                          className={`${campo} w-auto cursor-pointer font-mono`}
                        >
                          {item.libres.map((u) => (
                            <option key={u.id} value={u.id} className="bg-[#0d1b2a]">{u.codigo}</option>
                          ))}
                        </select>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button disabled={faltanUnidades} className={`${botonDorado} w-full sm:w-auto`}>
              <i className="fa-solid fa-check mr-2" aria-hidden="true" />
              CONFIRMAR
            </button>
          </form>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
            <span className="text-sm text-white/60">Ampliar plazo:</span>
            {PLAZOS.map((horas) => (
              <form key={horas} action={ampliarPlazo}>
                <input type="hidden" name="codigo" value={reserva.codigo} />
                <input type="hidden" name="horas" value={horas} />
                <button className={botonBorde}>+{horas} h</button>
              </form>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Pagos ---------- */}
      <section className={tarjeta}>
        <h2 className={titulo}>Pagos</h2>
        {reserva.pagos.length === 0 && <p className="text-sm text-white/50">Aún no hay pagos registrados.</p>}
        <ul className="space-y-2">
          {reserva.pagos.map((p) => (
            <li
              key={p.id}
              className={`flex flex-wrap items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm ${p.estado === "ANULADO" ? "opacity-50" : ""}`}
            >
              <span className={`font-semibold text-white ${p.estado === "ANULADO" ? "line-through" : ""}`}>{soles(p.monto)}</span>
              <span className="text-white/60">
                {METODOS_PAGO[p.metodo]}
                {p.numero_operacion && ` · N.º ${p.numero_operacion}`} · {fechaHora(p.creado_en)}
              </span>
              {p.estado === "ANULADO" ? (
                <span className="ml-auto rounded-full bg-red-400/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-300">Anulado</span>
              ) : (
                <form action={anularPago} className="ml-auto">
                  <input type="hidden" name="codigo" value={reserva.codigo} />
                  <input type="hidden" name="pagoId" value={p.id} />
                  <button className="cursor-pointer rounded-lg px-3 py-1.5 text-xs text-white/50 hover:bg-red-500/15 hover:text-red-300">
                    Anular
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>

        {reserva.estado !== "RESERVADA" && reserva.estado !== "CANCELADA" && reserva.saldo > 0 && (
          <form action={registrarPago} className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-[110px_150px_1fr_auto]">
            <input type="hidden" name="codigo" value={reserva.codigo} />
            <input name="monto" type="number" step="0.01" min="0" inputMode="decimal" defaultValue={reserva.saldo} aria-label="Monto" className={campo} />
            <select name="metodo" defaultValue="EFECTIVO" aria-label="Método" className={`${campo} cursor-pointer`}>
              {Object.entries(METODOS_PAGO).map(([valor, texto]) => (
                <option key={valor} value={valor} className="bg-[#0d1b2a]">{texto}</option>
              ))}
            </select>
            <input name="numeroOperacion" placeholder="N.º de operación (opcional)" aria-label="Número de operación" className={campo} />
            <button className={botonBorde}>Registrar pago</button>
          </form>
        )}
        {verificados.length > 0 && reserva.saldo === 0 && (
          <p className="mt-3 text-sm text-emerald-300">Pagado completo.</p>
        )}
      </section>

      {/* ---------- Día del evento ---------- */}
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
            {reserva.items.flatMap((item) =>
              item.unidades.map((u) => (
                <label key={u.id} className="flex cursor-pointer items-center gap-3 text-sm text-white/80">
                  <input type="checkbox" name="mantenimiento" value={u.id} className="h-5 w-5 accent-[#f5c542]" />
                  <span><span className="font-mono text-[#ffe9a8]">{u.codigo}</span> volvió con daños → enviar a mantenimiento</span>
                </label>
              ))
            )}
            <input name="nota" placeholder="Nota (opcional): ej. pantalla rayada" className={campo} />
            <button className={botonDorado}>Finalizar reserva</button>
          </form>
        </section>
      )}

      {/* ---------- Notas internas ---------- */}
      <section className={tarjeta}>
        <h2 className={titulo}>Notas internas</h2>
        <form action={guardarNotas} className="space-y-2">
          <input type="hidden" name="codigo" value={reserva.codigo} />
          <textarea name="notas" rows={3} defaultValue={reserva.notas ?? ""} placeholder="Solo las ve el equipo" className={campo} />
          <button className={botonBorde}>Guardar notas</button>
        </form>
      </section>

      {/* Cancelar (con casilla de confirmación para evitar errores) */}
      {(reserva.estado === "RESERVADA" || reserva.estado === "CONFIRMADA") && (
        <form action={cambiarEstado} className="flex flex-wrap items-center gap-3 rounded-2xl border border-red-400/20 p-4">
          <input type="hidden" name="codigo" value={reserva.codigo} />
          <input type="hidden" name="estado" value="CANCELADA" />
          <input name="nota" placeholder="Motivo (opcional)" className={`${campo} sm:max-w-xs`} />
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
