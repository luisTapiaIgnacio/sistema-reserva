
import Image from "next/image";
import Reveal from "@/components/Reveal";

const WHATSAPP = "51913956853";

const wa = (servicio: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola, deseo cotizar el servicio adicional "${servicio}" de Miranda Magic Mirror`
  )}`;

// 👇 Imágenes de relleno: cámbialas por las tuyas
const ADICIONALES = [
  {
    img: "/images/nova-btl/celebra/bautizos.jpg",
    icon: "fa-solid fa-panorama",
    titulo: "Backing personalizado",
    desc: "Fondo decorativo adaptado a la temática del evento.",
  },
  {
    img: "/images/nova-btl/celebra/bodas.jpg",
    icon: "fa-solid fa-book-open",
    titulo: "Álbum físico de firmas",
    desc: "Un álbum para conservar fotografías y mensajes de los invitados.",
  },
  {
    img: "/images/nova-btl/celebra/cumple.jpg",
    icon: "fa-solid fa-hat-wizard",
    titulo: "Cotillón temático premium",
    desc: "Accesorios seleccionados según el estilo de tu celebración.",
  },
  {
    img: "/images/nova-btl/celebra/graduacion.jpg",
    icon: "fa-solid fa-pen-ruler",
    titulo: "Diseño gráfico especial",
    desc: "Marcos fotográficos con nombres, fecha o identidad visual.",
  },
];

export default function ServiciosAdicionales() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c47f0a]">
              <span className="h-px w-8 bg-[#c47f0a]" aria-hidden="true" />
              Personaliza tu evento
            </span>

            <h2 className="mt-4 font-krona text-3xl uppercase leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
              Servicios{" "}
              <span className="bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text text-transparent">
                adicionales
              </span>
            </h2>

            <p className="mt-5 text-base leading-relaxed md:text-lg">
              Complementa tu experiencia con opciones personalizadas para que
              cada detalle vaya de acuerdo con tu celebración.
            </p>
          </div>
        </Reveal>

        {/* Tarjetas en 2 columnas */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {ADICIONALES.map((item, i) => (
            <Reveal key={item.titulo} delay={(i % 2) * 150} className="h-full">
              <article
                className="
                  group flex h-full flex-col overflow-hidden rounded-3xl
                  border border-[#02152b]/[0.08] bg-white
                  shadow-[0_12px_30px_-10px_rgba(2,21,43,0.15)]
                  transition-all duration-500
                  hover:-translate-y-2 hover:border-[#f5c542]
                  hover:shadow-[0_24px_40px_-12px_rgba(245,197,66,0.3)]
                  sm:flex-row
                "
              >
                {/* Foto */}
                <div className="relative h-[200px] w-full shrink-0 overflow-hidden sm:h-auto sm:w-[42%]">
                  <Image
                    src={item.img}
                    alt={item.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Texto */}
                <div className="flex flex-1 flex-col p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#02152b]/5 text-lg text-[#0054ef] transition-all duration-300 group-hover:bg-[#f5c542] group-hover:text-[#02152b]">
                    <i className={item.icon} aria-hidden="true" />
                  </span>

                  <h3 className="mt-4 text-lg font-bold leading-snug text-[#192a3d]">
                    {item.titulo}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="rounded-full border border-[#f5c542]/50 bg-[#fff3cf] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#c47f0a]">
                      A cotizar
                    </span>
                    <a
                      href={wa(item.titulo)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#0054ef] transition-all duration-300 hover:gap-3 hover:text-[#09217d]"
                    >
                      Consultar
                      <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Banda: hora adicional + movilidad */}
        <Reveal>
          <div className="relative mt-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#02152b] via-[#09217d] to-[#0054ef] p-8 text-white shadow-[0_24px_48px_-16px_rgba(2,21,43,0.45)] md:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#f5c542]/20 blur-3xl" />

            <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1fr_auto]">
              {/* Hora adicional */}
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5c542] text-xl text-[#02152b]">
                  <i className="fa-regular fa-clock" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-white/70">Hora adicional</p>
                  <p className="font-krona text-2xl text-[#f5c542]">S/ 250</p>
                  <p className="text-xs text-white/60">Tarifa propuesta por hora extra.</p>
                </div>
              </div>

              {/* Movilidad */}
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-[#f5c542]">
                  <i className="fa-solid fa-truck-fast" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm text-white/70">Movilidad</p>
                  <p className="text-lg font-bold">Según distrito o ciudad</p>
                  <p className="text-xs text-white/60">Se cotiza de acuerdo con la ubicación.</p>
                </div>
              </div>

              {/* Botón */}
              <a
                href={wa("Hora adicional / movilidad")}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f5c542] px-6 py-3.5 text-sm font-semibold text-[#02152b] shadow-lg shadow-[#f5c542]/30 transition-all duration-300 hover:scale-105 hover:bg-[#ffe9a8]"
              >
                <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" />
                Consultar
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}