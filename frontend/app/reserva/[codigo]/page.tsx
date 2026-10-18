import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CuentaRegresiva from "@/components/reservar/CuentaRegresiva";
import CopiarBoton from "@/components/reservar/CopiarBoton";
import { api, ApiError } from "@/lib/api";
import { rangoFechas, soles } from "@/lib/fechas";
import type { Configuracion, ReservaPublica } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Tu reserva | Miranda Magic Mirror",
  robots: { index: false, follow: false }, // página privada del cliente
};

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ t?: string }>;
};

async function cargarReserva(codigo: string, token: string | undefined) {
  // Sin token correcto la API responde 404: no se muestra nada (protege los datos del cliente)
  if (!token) notFound();
  try {
    return await api<ReservaPublica>(`/reservas/${encodeURIComponent(codigo)}`, { query: { t: token } });
  } catch (e) {
    if (e instanceof ApiError && (e.status === 404 || e.status === 422)) notFound();
    throw e;
  }
}

export default async function ReservaPage({ params, searchParams }: Props) {
  const { codigo } = await params;
  const { t } = await searchParams;
  const [reserva, pagos] = await Promise.all([cargarReserva(codigo, t), api<Configuracion>("/configuracion")]);

  const vencida = reserva.vencida;
  const separada = reserva.estado === "RESERVADA" && !vencida;
  const confirmada = ["CONFIRMADA", "EN_CURSO", "FINALIZADA"].includes(reserva.estado);
  const fecha = rangoFechas(reserva.fecha_inicio, reserva.fecha_fin);

  const insignia = confirmada
    ? { texto: "Confirmada", clase: "bg-emerald-400/15 text-emerald-300" }
    : vencida
      ? { texto: "Vencida", clase: "bg-red-400/15 text-red-300" }
      : reserva.estado === "CANCELADA"
        ? { texto: "Cancelada", clase: "bg-red-400/15 text-red-300" }
        : { texto: "Reservada · falta tu comprobante", clase: "bg-amber-400/15 text-amber-300" };

  return (
    <>
      <Header />
      <main className="relative overflow-clip bg-[#02152b] px-4 pb-20 pt-10 font-poppins text-white/70 md:pt-14">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-[#f5c542]/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-[#0054ef]/20 blur-3xl" />

        <div className="relative mx-auto max-w-2xl space-y-5">
          {/* Encabezado */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm">Tu reserva</p>
              <h1 className="font-mono text-2xl font-bold text-white!">{reserva.codigo}</h1>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${insignia.clase}`}>{insignia.texto}</span>
          </div>

          {/* ---------- Reservada: lo más importante es mandar el comprobante ---------- */}
          {separada && reserva.expira_en && (
            <div className="space-y-4 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5">
              <div className="flex items-center justify-between gap-3 text-sm text-amber-200">
                <span>¡Listo! Tu fecha está separada por</span>
                <CuentaRegresiva hasta={reserva.expira_en} />
              </div>
              <p className="text-sm text-amber-100">
                <strong>No olvides enviarnos tu comprobante de pago</strong> (mínimo{" "}
                <strong>{soles(reserva.adelanto)}</strong>) por WhatsApp antes de que venza el plazo. Al recibirlo
                confirmamos tu reserva.
              </p>
              <a
                href={reserva.enlace_whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3.5 text-sm font-semibold text-[#05301a] transition-opacity hover:opacity-90"
              >
                <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" />
                Enviar comprobante por WhatsApp
              </a>
            </div>
          )}

          {/* Resumen */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
            <ul className="space-y-2 text-sm">
              {reserva.items.map((item) => (
                <li key={item.producto_id} className="flex justify-between gap-3">
                  <span className="font-medium text-white">
                    {item.cantidad}× {item.nombre}
                  </span>
                  <span className="shrink-0 tabular-nums">{soles(item.subtotal)}</span>
                </li>
              ))}
            </ul>
            <div className="my-4 h-px bg-white/10" />
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3"><dt>Fecha</dt><dd className="text-right font-medium first-letter:uppercase text-white">{fecha}</dd></div>
              {reserva.horario && <div className="flex justify-between gap-3"><dt>Horario</dt><dd className="text-right font-medium text-white">{reserva.horario}</dd></div>}
              {reserva.distrito && <div className="flex justify-between gap-3"><dt>Distrito</dt><dd className="text-right font-medium text-white">{reserva.distrito}</dd></div>}
              <div className="flex justify-between gap-3"><dt>A nombre de</dt><dd className="text-right font-medium text-white">{reserva.cliente_nombre}</dd></div>
            </dl>
            <div className="my-4 h-px bg-white/10" />
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt>Total</dt><dd className="font-semibold text-white">{soles(reserva.total)}</dd></div>
              <div className="flex justify-between"><dt>Adelanto mínimo</dt><dd className="font-semibold text-[#f5c542]">{soles(reserva.adelanto)}</dd></div>
              {reserva.pagado > 0 && (
                <div className="flex justify-between"><dt>Pagado</dt><dd className="font-semibold text-emerald-300">{soles(reserva.pagado)}</dd></div>
              )}
              <div className="flex justify-between"><dt>Saldo</dt><dd className="font-semibold text-white">{soles(reserva.saldo)}</dd></div>
            </dl>
          </div>

          {/* ---------- Reservada: datos para pagar ---------- */}
          {separada && (
            <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
              <h2 className="text-lg font-semibold text-white!">
                Paga el adelanto: <span className="text-[#f5c542]">{soles(reserva.adelanto)}</span>
              </h2>

              {/* Yape / Plin */}
              <div className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
                {pagos.yape_plin_qr && (
                  <Image src={pagos.yape_plin_qr} alt="QR para pagar con Yape o Plin" width={96} height={96} unoptimized className="h-24 w-24 shrink-0 rounded-lg" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs">Yape / Plin</p>
                  <p className="text-lg font-semibold tabular-nums text-white">{pagos.yape_plin_numero}</p>
                  <p className="text-xs">{pagos.yape_plin_titular}</p>
                </div>
                <CopiarBoton texto={pagos.yape_plin_numero.replace(/\s/g, "")} />
              </div>

              {/* Bancos */}
              {pagos.bancos.length > 0 && (
                <div className="space-y-2">
                  {pagos.bancos.map((b) => (
                    <div key={b.numero} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs">{b.banco} · {b.tipo}</p>
                        <p className="truncate font-mono text-sm text-white">{b.numero}</p>
                      </div>
                      <CopiarBoton texto={b.numero} />
                    </div>
                  ))}
                  <p className="text-xs">Titular: {pagos.bancos_titular}</p>
                </div>
              )}

              <a
                href={reserva.enlace_whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#25d366]/50 py-3 text-sm font-semibold text-[#25d366] transition-colors hover:bg-[#25d366]/10"
              >
                <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" />
                Ya pagué: enviar comprobante
              </a>
            </div>
          )}

          {/* ---------- Confirmada ---------- */}
          {confirmada && (
            <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-200">
              <p className="font-semibold">¡Tu reserva está confirmada!</p>
              <p className="mt-1">Nos comunicaremos por WhatsApp para coordinar los detalles del evento.</p>
            </div>
          )}

          {/* ---------- Vencida o cancelada ---------- */}
          {(vencida || reserva.estado === "CANCELADA") && (
            <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-5 text-sm text-red-300">
              <p className="font-semibold">
                {vencida ? "El plazo para enviar el comprobante venció y la fecha se liberó." : "Esta reserva fue cancelada."}
              </p>
              <p className="mt-1">Si ya pagaste, escríbenos por WhatsApp con tu código {reserva.codigo}.</p>
              <Link href="/reservar" className="mt-3 inline-block rounded-xl bg-[#f5c542] px-5 py-3 font-semibold text-[#02152b] hover:bg-[#ffe9a8]">
                Reservar de nuevo
              </Link>
            </div>
          )}

          {/* Guardar el enlace */}
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 px-5 py-4 text-sm">
            <i className="fa-regular fa-bookmark text-[#f5c542]" aria-hidden="true" />
            <p className="flex-1">Guarda este enlace para volver a tu reserva.</p>
            <CopiarBoton texto={`/reserva/${reserva.codigo}?t=${t}`} etiqueta="Copiar enlace" />
          </div>
        </div>
      </main>
      <Footer mostrarLlamado={false} />
    </>
  );
}
