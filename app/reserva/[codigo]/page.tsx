import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CuentaRegresiva from "@/components/reservar/CuentaRegresiva";
import CopiarBoton from "@/components/reservar/CopiarBoton";
import InformarPagoForm from "@/components/reservar/InformarPagoForm";
import { prisma } from "@/lib/prisma";
import { aTexto, fechaLarga, soles } from "@/lib/fechas";
import { PAGOS } from "@/lib/config-pagos";

export const metadata: Metadata = {
  title: "Tu reserva | Miranda Magic Mirror",
  robots: { index: false, follow: false }, // página privada del cliente
};

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ codigo: string }>;
  searchParams: Promise<{ t?: string }>;
};

export default async function ReservaPage({ params, searchParams }: Props) {
  const { codigo } = await params;
  const { t } = await searchParams;

  const reserva = await prisma.reserva.findUnique({
    where: { codigo },
    include: {
      cliente: true,
      items: { include: { producto: true } },
      pagos: { orderBy: { creadoEn: "desc" } },
    },
  });

  // Sin token correcto no se muestra nada (protege los datos del cliente)
  if (!reserva || !t || reserva.tokenAcceso !== t) notFound();

  const vencida = reserva.estado === "PENDIENTE" && (!reserva.expiraEn || reserva.expiraEn < new Date());
  const pendiente = reserva.estado === "PENDIENTE" && !vencida;
  const confirmada = reserva.estado === "CONFIRMADA" || reserva.estado === "EN_CURSO" || reserva.estado === "FINALIZADA";
   const pagoEnRevision = reserva.pagos.some((p: { estado: string }) => p.estado === "POR_VERIFICAR");

  const producto = reserva.items[0]?.producto;
  const fecha = aTexto(reserva.fechaInicio);
  const total = Number(reserva.total);
  const adelanto = Number(reserva.adelanto);

  const mensajeWhatsapp = `Hola Miranda, separé ${producto?.nombre ?? "un espejo"} para el ${fechaLarga(fecha)}. Mi código es ${reserva.codigo}. Te envío la captura del adelanto de ${soles(adelanto)}.`;
  const linkWhatsapp = `https://wa.me/${PAGOS.whatsapp}?text=${encodeURIComponent(mensajeWhatsapp)}`;

  const insignia = confirmada
    ? { texto: "Confirmada", clase: "bg-emerald-400/15 text-emerald-300" }
    : vencida
      ? { texto: "Vencida", clase: "bg-red-400/15 text-red-300" }
      : reserva.estado === "CANCELADA"
        ? { texto: "Cancelada", clase: "bg-red-400/15 text-red-300" }
        : { texto: pagoEnRevision ? "Pago en revisión" : "Pendiente de pago", clase: "bg-amber-400/15 text-amber-300" };

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

          {/* Resumen */}
          <div className="rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-3"><dt>Producto</dt><dd className="text-right font-medium text-white">{producto?.nombre}</dd></div>
              <div className="flex justify-between gap-3"><dt>Fecha</dt><dd className="text-right font-medium capitalize text-white">{fechaLarga(fecha)}</dd></div>
              {reserva.horario && <div className="flex justify-between gap-3"><dt>Horario</dt><dd className="text-right font-medium text-white">{reserva.horario}</dd></div>}
              <div className="flex justify-between gap-3"><dt>A nombre de</dt><dd className="text-right font-medium text-white">{reserva.cliente.nombre}</dd></div>
            </dl>
            <div className="my-4 h-px bg-white/10" />
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between"><dt>Total</dt><dd className="font-semibold text-white">{soles(total)}</dd></div>
              <div className="flex justify-between"><dt>Adelanto ({PAGOS.porcentajeAdelanto} %)</dt><dd className="font-semibold text-[#f5c542]">{soles(adelanto)}</dd></div>
              <div className="flex justify-between"><dt>Saldo el día del evento</dt><dd className="font-semibold text-white">{soles(total - adelanto)}</dd></div>
            </dl>
          </div>

          {/* ---------- Pendiente: datos para pagar ---------- */}
          {pendiente && reserva.expiraEn && (
            <>
              <div className="flex items-center justify-between rounded-2xl border border-amber-400/40 bg-amber-400/10 px-5 py-4 text-sm text-amber-200">
                <span>Tu fecha está separada por</span>
                <CuentaRegresiva hasta={reserva.expiraEn.toISOString()} />
              </div>

              {pagoEnRevision ? (
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm text-emerald-200">
                  <p className="font-semibold">Recibimos tu número de operación.</p>
                  <p className="mt-1">Estamos verificando tu pago. Te confirmaremos por WhatsApp.</p>
                </div>
              ) : (
                <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)]">
                  <h2 className="text-lg font-semibold text-white!">
                    Paga el adelanto: <span className="text-[#f5c542]">{soles(adelanto)}</span>
                  </h2>

                  {/* Yape / Plin */}
                  <div className="flex items-center gap-4 rounded-xl border border-white/10 p-3">
                    <Image src={PAGOS.yapePlin.qr} alt="QR para pagar con Yape o Plin" width={96} height={96} unoptimized className="h-24 w-24 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs">Yape / Plin</p>
                      <p className="text-lg font-semibold tabular-nums text-white">{PAGOS.yapePlin.numero}</p>
                      <p className="text-xs">{PAGOS.yapePlin.titular}</p>
                    </div>
                    <CopiarBoton texto={PAGOS.yapePlin.numero.replace(/\s/g, "")} />
                  </div>

                  {/* Bancos */}
                  <div className="space-y-2">
                    {PAGOS.bancos.map((b) => (
                      <div key={b.numero} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs">{b.banco} · {b.tipo}</p>
                          <p className="truncate font-mono text-sm text-white">{b.numero}</p>
                        </div>
                        <CopiarBoton texto={b.numero} />
                      </div>
                    ))}
                    <p className="text-xs">Titular: {PAGOS.titularBancos}</p>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Enviar comprobante */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-white">¿Ya pagaste? Envíanos el comprobante</h3>
                    <a
                      href={linkWhatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25d366] py-3.5 text-sm font-semibold text-[#05301a] transition-opacity hover:opacity-90"
                    >
                      <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" />
                      Enviar captura por WhatsApp
                    </a>
                    <p className="text-center text-xs">o, si prefieres, escribe aquí el número de operación:</p>
                    <InformarPagoForm codigo={reserva.codigo} token={reserva.tokenAcceso} />
                  </div>
                </div>
              )}
            </>
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
              <p className="font-semibold">{vencida ? "El plazo para pagar venció y la fecha se liberó." : "Esta reserva fue cancelada."}</p>
              <Link href="/reservar" className="mt-3 inline-block rounded-xl bg-[#f5c542] px-5 py-3 font-semibold text-[#02152b] hover:bg-[#ffe9a8]">
                Reservar de nuevo
              </Link>
            </div>
          )}

          {/* Guardar el enlace */}
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-white/15 px-5 py-4 text-sm">
            <i className="fa-regular fa-bookmark text-[#f5c542]" aria-hidden="true" />
            <p className="flex-1">Guarda este enlace para volver a tu reserva.</p>
            <CopiarBoton texto={`/reserva/${reserva.codigo}?t=${reserva.tokenAcceso}`} etiqueta="Copiar enlace" />
          </div>
        </div>
      </main>
      <Footer mostrarLlamado={false} />
    </>
  );
}