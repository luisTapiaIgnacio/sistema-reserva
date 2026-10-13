import Image from "next/image";
import Reveal from "@/components/Reveal";

const WHATSAPP = "51913956853";
const WA_LINK = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hola, deseo cotizar Miranda Magic Mirror para mi celebración"
)}`;

// 👇 Imágenes de relleno: cámbialas por fotos de cada tipo de evento
const CELEBRACIONES = [
  { img: "/images/nova-btl/celebra/bodas.jpg", titulo: "Matrimonios", icon: "fa-solid fa-ring" },
  { img: "/images/nova-btl/celebra/quinceaños.jpg", titulo: "Quinceañeros", icon: "fa-solid fa-crown" },
  { img: "/images/nova-btl/celebra/graduacion.jpg", titulo: "Graduaciones", icon: "fa-solid fa-graduation-cap" },
  { img: "/images/nova-btl/celebra/cumple.jpg", titulo: "Cumpleaños", icon: "fa-solid fa-cake-candles" },
  { img: "/images/nova-btl/celebra/corp.jpg", titulo: "Eventos corporativos", icon: "fa-solid fa-briefcase" },
  { img: "/images/nova-btl/celebra/bautizos.jpg", titulo: "Bautizos y celebraciones familiares", icon: "fa-solid fa-people-roof" },
];

export default function ExperienciaCelebracion() {
  return (
    <section className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins text-white md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1290px]">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c542]">
              <span className="h-px w-8 bg-[#f5c542]" aria-hidden="true" />
              Para cada ocasión
            </span>

            <h2 className="mt-4 font-krona text-3xl uppercase leading-tight tracking-wide text-white! md:text-4xl">
              Una experiencia para{" "}
              <span className="text-[#f5c542]">cada celebración</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
              Creamos experiencias fotográficas para diferentes ocasiones,
              adaptando la presentación del espejo mágico al estilo de cada
              evento.
            </p>
          </div>
        </Reveal>

        {/* 6 tarjetas: 1 columna en móvil, 2 en tablet, 3 en escritorio */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CELEBRACIONES.map((item, i) => (
            <Reveal key={item.titulo} delay={(i % 3) * 150}>
              <article
                className="
                  group relative h-[280px] overflow-hidden rounded-3xl
                  border border-white/[0.08]
                  transition-all duration-500
                  hover:-translate-y-2 hover:border-[#f5c542]/60
                  hover:shadow-[0_24px_48px_-12px_rgba(245,197,66,0.35)]
                  md:h-[320px]
                "
              >
                <Image
                  src={item.img}
                  alt={item.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Degradado para leer el título */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#02152b] via-[#02152b]/40 to-transparent" />

                {/* Título abajo */}
                <div className="absolute inset-x-0 bottom-0 flex items-center gap-4 p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#f5c542]/40 bg-[#02152b]/70 text-lg text-[#f5c542] backdrop-blur-sm transition-all duration-300 group-hover:bg-[#f5c542] group-hover:text-[#02152b]">
                    <i className={item.icon} aria-hidden="true" />
                  </span>
                  <h3 className="text-lg font-bold uppercase leading-tight tracking-wide text-white">
                    {item.titulo}
                  </h3>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Llamado final */}
        <Reveal>
          <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-3xl border border-[#f5c542]/30 bg-white/[0.04] p-6 text-center backdrop-blur-sm md:flex-row md:p-8 md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f5c542] text-xl text-[#02152b]">
                <i className="fa-solid fa-champagne-glasses" aria-hidden="true" />
              </span>
              <div>
                <p className="text-lg font-bold">¿Tienes una celebración en mente?</p>
                <p className="text-sm text-white/70">
                  Cuéntanos tu idea y adaptamos el espejo mágico a tu evento.
                </p>
              </div>
            </div>

            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f5c542] px-7 py-3.5 text-sm font-semibold text-[#02152b] shadow-lg shadow-[#f5c542]/30 transition-all duration-300 hover:scale-105 hover:bg-[#ffe9a8]"
            >
              <i className="fa-brands fa-whatsapp text-lg" aria-hidden="true" />
              Cotizar mi evento
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}