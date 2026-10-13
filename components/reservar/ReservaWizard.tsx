"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { crearReserva, type EstadoReservaForm } from "@/app/reservar/actions";
import { fechaLarga, hoyLima, moverMes, soles, sumarDias } from "@/lib/fechas";
import { PAGOS } from "@/lib/config-pagos";

export type ProductoReserva = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  categoriaId: number;
  operativas: number;
};

type Props = {
  categorias: { id: number; nombre: string }[];
  productos: ProductoReserva[];
};

type Disponibilidad = { clave: string; total: number; libres: Record<string, number>; error?: boolean };

const PASOS = ["Producto", "Fecha", "Tus datos", "Adelanto"];
const DIAS = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];
const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const HORARIOS = ["Por coordinar", "Mañana · 9 a. m. – 1 p. m.", "Tarde · 3 – 7 p. m.", "Noche · 8 p. m. – 12 a. m."];

const campo =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5c542]";

export default function ReservaWizard({ categorias, productos }: Props) {
  const [paso, setPaso] = useState(1);
  const [filtro, setFiltro] = useState<number | "todas">("todas");
  const [productoId, setProductoId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string | null>(null);
  const [horario, setHorario] = useState(HORARIOS[0]);
  const [mes, setMes] = useState(() => hoyLima().slice(0, 7));
  const [recarga, setRecarga] = useState(0);
  const [disp, setDisp] = useState<Disponibilidad | null>(null);
  const [estado, accion, enviando] = useActionState(crearReserva, {} as EstadoReservaForm);

  const producto = productos.find((p) => p.id === productoId) ?? null;
  const visibles = filtro === "todas" ? productos : productos.filter((p) => p.categoriaId === filtro);
  const manana = sumarDias(hoyLima(), 1);
  const mesMinimo = manana.slice(0, 7);
  const adelanto = producto ? Math.ceil((producto.precio * PAGOS.porcentajeAdelanto) / 100) : 0;

  // ---------- Disponibilidad del mes (se pide al servidor) ----------
  const clave = productoId ? `${productoId}|${mes}|${recarga}` : null;
  const dispActual = disp && disp.clave === clave ? disp : null;
  const cargando = clave !== null && dispActual === null;

  useEffect(() => {
    if (!clave) return;
    const [pid, m] = clave.split("|");
    let cancelado = false;
    fetch(`/api/disponibilidad?productoId=${pid}&mes=${m}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => !cancelado && setDisp({ clave, total: d.total, libres: d.libres }))
      .catch(() => !cancelado && setDisp({ clave, total: 0, libres: {}, error: true }));
    return () => {
      cancelado = true;
    };
  }, [clave]);

  // ---------- Calendario ----------
  const [anio, numMes] = mes.split("-").map(Number);
  const blancos = (new Date(Date.UTC(anio, numMes - 1, 1)).getUTCDay() + 6) % 7; // semana empieza lunes
  const diasDelMes = new Date(Date.UTC(anio, numMes, 0)).getUTCDate();

  function elegirProducto(id: number) {
    setProductoId(id);
    setFecha(null);
  }

  function volverAFechas() {
    setFecha(null);
    setRecarga((n) => n + 1); // vuelve a consultar la disponibilidad
    setPaso(2);
  }

  const puedeSeguir = (paso === 1 && !!producto) || (paso === 2 && !!fecha) || paso === 3;

  // ---------- Botón principal (abajo en celular, en el resumen en monitor) ----------
  const botonPrincipal = (clases: string) =>
    paso < 3 ? (
      <button
        type="button"
        disabled={!puedeSeguir}
        onClick={() => setPaso(paso + 1)}
        className={`cursor-pointer rounded-xl bg-[#f5c542] px-6 py-3.5 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8] disabled:cursor-not-allowed disabled:opacity-40 ${clases}`}
      >
        Continuar
      </button>
    ) : (
      <button
        type="submit"
        form="form-reserva"
        disabled={enviando}
        className={`cursor-pointer rounded-xl bg-[#f5c542] px-6 py-3.5 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8] disabled:cursor-wait disabled:opacity-60 ${clases}`}
      >
        {enviando ? "Separando…" : "Separar fecha"}
      </button>
    );

  return (
    <section className="relative overflow-clip bg-[#02152b] px-4 pb-32 pt-10 font-poppins text-white/70 md:px-5 md:pb-20 md:pt-14">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative mx-auto max-w-[1150px]">
        {/* Título */}
        <h1 className="text-center font-krona text-2xl leading-tight text-white! md:text-4xl">
          Reserva tu <span className="text-[#f5c542]">fecha</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm md:text-base">
          Elige tu espejo, revisa la disponibilidad y separa tu fecha en minutos.
        </p>

        {/* Pasos */}
        <ol className="mx-auto mt-8 flex max-w-2xl items-center justify-between gap-2">
          {PASOS.map((nombre, i) => {
            const n = i + 1;
            const hecho = n < paso;
            const actual = n === paso;
            return (
              <li key={nombre} className="flex flex-1 flex-col items-center gap-1.5 text-center">
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    hecho ? "bg-emerald-500 text-white" : actual ? "bg-[#f5c542] text-[#02152b]" : "bg-white/10 text-white/60"
                  }`}
                >
                  {hecho ? <i className="fa-solid fa-check" aria-hidden="true" /> : n}
                </span>
                <span className={`text-[11px] md:text-xs ${actual ? "font-semibold text-white" : ""}`}>{nombre}</span>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_330px]">
          {/* ================= CONTENIDO DEL PASO ================= */}
          <div className="min-w-0">
            {paso > 1 && (
              <button
                type="button"
                onClick={() => setPaso(paso - 1)}
                className="mb-4 cursor-pointer text-sm font-medium text-white/60 hover:text-white"
              >
                ‹ Atrás
              </button>
            )}

            {/* ---------- Paso 1: Producto ---------- */}
            {paso === 1 && (
              <div>
                <h2 className="text-lg font-semibold text-white!">¿Qué quieres alquilar?</h2>

                <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
                  {[{ id: "todas" as const, nombre: "Todos" }, ...categorias].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setFiltro(c.id)}
                      className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors ${
                        filtro === c.id
                          ? "border-[#f5c542] bg-[#f5c542] font-semibold text-[#02152b]"
                          : "border-white/15 bg-white/5 text-white/70 hover:border-[#f5c542]"
                      }`}
                    >
                      {c.nombre}
                    </button>
                  ))}
                </div>

                {visibles.length === 0 && (
                  <p className="mt-6 rounded-2xl border border-dashed border-white/15 p-6 text-center">
                    Por ahora no hay productos en esta categoría.
                  </p>
                )}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {visibles.map((p) => {
                    const elegido = p.id === productoId;
                    const sinUnidades = p.operativas === 0;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        disabled={sinUnidades}
                        onClick={() => elegirProducto(p.id)}
                        className={`flex cursor-pointer gap-4 rounded-2xl border bg-[#0d1b2a] p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                          elegido
                            ? "border-[#f5c542] shadow-[0_0_0_2px_#f5c542]"
                            : "border-white/10 hover:border-[#f5c542]/60"
                        }`}
                      >
                        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#09217d] to-[#02152b]">
                          {p.imagen ? (
                            <Image src={p.imagen} alt={p.nombre} fill sizes="80px" className="object-cover" />
                          ) : (
                            <i className="fa-regular fa-image absolute inset-0 m-auto h-fit w-fit text-xl text-white/40" aria-hidden="true" />
                          )}
                        </span>
                        <span className="flex min-w-0 flex-col justify-center gap-1">
                          <strong className="text-[15px] text-white">{p.nombre}</strong>
                          <span className="text-sm font-semibold text-[#f5c542]">{soles(p.precio)}</span>
                          <span className="text-xs">{sinUnidades ? "No disponible por ahora" : "Elige la fecha en el siguiente paso"}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------- Paso 2: Fecha ---------- */}
            {paso === 2 && producto && (
              <div>
                <h2 className="text-lg font-semibold text-white!">Elige la fecha de tu evento</h2>
                <p className="mt-1 text-sm">{producto.nombre}</p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0d1b2a] p-4 md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <button
                      type="button"
                      aria-label="Mes anterior"
                      disabled={mes <= mesMinimo}
                      onClick={() => setMes(moverMes(mes, -1))}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                    </button>
                    <strong className="text-white">
                      {MESES[numMes - 1]} {anio}
                    </strong>
                    <button
                      type="button"
                      aria-label="Mes siguiente"
                      onClick={() => setMes(moverMes(mes, 1))}
                      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
                    >
                      <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                    </button>
                  </div>

                  <div className={`grid grid-cols-7 gap-1.5 text-center transition-opacity ${cargando ? "opacity-40" : ""}`}>
                    {DIAS.map((d) => (
                      <span key={d} className="pb-1 text-[11px] font-semibold uppercase tracking-wide text-white/40">
                        {d}
                      </span>
                    ))}
                    {Array.from({ length: blancos }, (_, i) => (
                      <span key={`b${i}`} />
                    ))}
                    {Array.from({ length: diasDelMes }, (_, i) => {
                      const dia = `${mes}-${String(i + 1).padStart(2, "0")}`;
                      const libres = dispActual?.libres[dia];
                      const pasado = dia < manana;
                      const agotado = libres === 0;
                      const pocas = libres === 1;
                      const elegido = dia === fecha;
                      const bloqueado = pasado || agotado || cargando;

                      const color = elegido
                        ? "bg-[#f5c542] font-bold text-[#02152b]"
                        : pasado
                          ? "text-white/20"
                          : agotado
                            ? "bg-red-400/10 text-red-300/60 line-through"
                            : pocas
                              ? "bg-amber-400/15 text-amber-200 hover:bg-amber-400/25"
                              : "bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20";

                      return (
                        <button
                          key={dia}
                          type="button"
                          disabled={bloqueado}
                          onClick={() => setFecha(dia)}
                          aria-label={`${fechaLarga(dia)}${agotado ? ", agotado" : ""}`}
                          className={`h-11 cursor-pointer rounded-xl text-sm tabular-nums transition-colors disabled:cursor-not-allowed ${color}`}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-4 text-xs">
                    <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />Disponible</span>
                    <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-amber-400" />Última unidad</span>
                    <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-red-300" />Agotado</span>
                  </div>
                  {dispActual?.error && (
                    <p className="mt-3 text-sm text-red-300">No pudimos cargar la disponibilidad. Revisa tu conexión e intenta de nuevo.</p>
                  )}
                </div>

                <h3 className="mt-6 text-sm font-semibold text-white">Horario aproximado</h3>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {HORARIOS.map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHorario(h)}
                      className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        horario === h ? "border-[#f5c542] bg-[#f5c542]/10 text-[#f5c542]" : "border-white/15 bg-white/5 text-white/70 hover:border-[#f5c542]/60"
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ---------- Paso 3: Datos ---------- */}
            {paso === 3 && producto && fecha && (
              <form id="form-reserva" action={accion} className="space-y-4">
                <h2 className="text-lg font-semibold text-white!">Tus datos</h2>
                <p className="text-sm">Sin crear cuenta. Te contactaremos por WhatsApp para coordinar.</p>

                <input type="hidden" name="productoId" value={producto.id} />
                <input type="hidden" name="fecha" value={fecha} />
                <input type="hidden" name="horario" value={horario} />

                <div className="space-y-1.5">
                  <label htmlFor="nombre" className="text-sm font-medium text-white">Nombre completo *</label>
                  <input id="nombre" name="nombre" autoComplete="name" required className={campo} placeholder="Camila Ríos" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="celular" className="text-sm font-medium text-white">Celular (WhatsApp) *</label>
                  <input id="celular" name="celular" type="tel" inputMode="numeric" autoComplete="tel" required className={campo} placeholder="987 654 321" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="distrito" className="text-sm font-medium text-white">Distrito (opcional)</label>
                    <input id="distrito" name="distrito" className={campo} placeholder="Miraflores" />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-white">Correo (opcional)</label>
                    <input id="email" name="email" type="email" autoComplete="email" className={campo} placeholder="tucorreo@gmail.com" />
                  </div>
                </div>

                {estado.error && (
                  <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {estado.error}
                    {estado.sinStock && (
                      <button type="button" onClick={volverAFechas} className="ml-2 cursor-pointer font-semibold underline">
                        Elegir otra fecha
                      </button>
                    )}
                  </div>
                )}

                <p className="text-xs">
                  Al separar la fecha la guardamos por {PAGOS.horasParaPagar} horas. Se confirma al recibir el adelanto.
                </p>
              </form>
            )}
          </div>

          {/* ================= RESUMEN (monitor) ================= */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-4 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
              <h3 className="text-sm font-semibold text-white">Resumen de tu reserva</h3>
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between gap-3"><dt>Producto</dt><dd className="text-right font-medium text-white">{producto?.nombre ?? "—"}</dd></div>
                <div className="flex justify-between gap-3"><dt>Fecha</dt><dd className="text-right font-medium capitalize text-white">{fecha ? fechaLarga(fecha) : "—"}</dd></div>
                <div className="flex justify-between gap-3"><dt>Horario</dt><dd className="text-right font-medium text-white">{fecha ? horario : "—"}</dd></div>
              </dl>
              <div className="h-px bg-white/10" />
              <dl className="space-y-2.5 text-sm">
                <div className="flex justify-between"><dt>Total</dt><dd className="font-semibold text-white">{producto ? soles(producto.precio) : "—"}</dd></div>
                <div className="flex justify-between"><dt>Adelanto ({PAGOS.porcentajeAdelanto} %)</dt><dd className="font-semibold text-[#f5c542]">{producto ? soles(adelanto) : "—"}</dd></div>
              </dl>
              {botonPrincipal("w-full")}
            </div>
          </aside>
        </div>
      </div>

      {/* ================= BARRA FIJA (celular) ================= */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-white/10 bg-[#02152b]/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.5)] backdrop-blur lg:hidden">
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[11px]">{fecha ? fechaLarga(fecha) : producto ? producto.nombre : "Elige un producto"}</p>
          <p className="text-base font-semibold text-white">
            {producto ? (paso === 3 ? `Adelanto ${soles(adelanto)}` : soles(producto.precio)) : "—"}
          </p>
        </div>
        {botonPrincipal("ml-auto shrink-0")}
      </div>
    </section>
  );
}