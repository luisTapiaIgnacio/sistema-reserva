import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Complemento } from "@/lib/Complementos";

export default function ComplementoDescripcion({ complemento }: { complemento: Complemento }) {
  const { titulo, imagen, imagenDetalle, detalle, incluye } = complemento;

  // Si el servicio todavía no tiene textos, la sección no se muestra
  if (!detalle?.length && !incluye?.length) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbfc] to-[#f2f5f7] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Imagen + descripción */}
        {detalle?.length ? (
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[2fr_3fr] md:gap-14">
            <Reveal>
              <div className="relative">
                <div className="absolute -bottom-3 -left-3 h-full w-full rounded-3xl border border-[#f5c542]/50" />
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-[0_24px_48px_-16px_rgba(2,21,43,0.35)]">
                  <Image
                    src={imagenDetalle ?? imagen}
                    alt={titulo}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="space-y-5 text-base leading-relaxed md:text-[17px]">
                {detalle.map((parrafo) => (
                  <p key={parrafo.slice(0, 30)}>{parrafo}</p>
                ))}
              </div>
            </Reveal>
          </div>
        ) : null}

        {/* ¿Qué incluye? */}
        {incluye?.length ? (
          <div className={detalle?.length ? "mt-20" : ""}>
            <Reveal>
              <div className="text-center">
                <h2 className="font-krona text-3xl leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
                  ¿Qué incluye?
                </h2>
                <span className="mx-auto mt-4 block h-1 w-24 rounded-full bg-gradient-to-r from-[#f5c542] to-[#c47f0a]" aria-hidden="true" />
              </div>
            </Reveal>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {incluye.map((item, i) => (
                <Reveal key={item} delay={i * 100} className="h-full">
                  <div
                    className="
                      group flex h-full flex-col items-center rounded-2xl
                      border border-[#02152b]/[0.08] bg-white px-4 py-7 text-center
                      shadow-[0_12px_30px_-10px_rgba(2,21,43,0.15)]
                      transition-all duration-300
                      hover:-translate-y-1.5 hover:border-[#f5c542]
                      hover:shadow-[0_20px_35px_-10px_rgba(245,197,66,0.3)]
                    "
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fff3cf] text-xl text-[#c47f0a] transition-all duration-300 group-hover:bg-[#f5c542] group-hover:text-[#02152b]">
                      <i className="fa-solid fa-check" aria-hidden="true" />
                    </span>
                    <p className="mt-4 text-sm font-medium leading-snug text-[#192a3d]">
                      {item}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}