import Image from "next/image";
import Reveal from "@/components/Reveal";

const CARDS = [
  {
    img: "/images/nova-btl/celebra/bodas.jpg",
    alt: "Estación de snacks premium para eventos corporativos en Lima - Nova BTL y Eventos",
    titulo: "BODAS",
    items: [
      "El reflejo de su gran día, en una foto que sus invitados guardarán para siempre",
    ],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/celebra/quinceaños.jpg",
    alt: "Plataforma 360 para activaciones de marca y eventos corporativos - Nova BTL y Eventos",
    titulo: "QUINCE AÑOS",
    items: [
      "Quince años se cumplen una sola vez: que cada foto lo celebre a lo grande",
    ],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/celebra/graduacion.jpg",
    alt: "Servicio de fotografía instantánea con impresión para eventos corporativos - Nova BTL y Eventos",
    titulo: "GRADUACIONES",
    items: ["Tanto esfuerzo merece un recuerdo a la altura de este logro"],
    href: "/complementa-tu-evento",
  },

  // 👇 NUEVAS 3 CARDS
  {
    img: "/images/nova-btl/celebra/corp.jpg",
    alt: "Servicio de DJ y sonido profesional para eventos corporativos - Nova BTL y Eventos",
    titulo: "EVENTOS CORPORATIVOS",
    items: ["Tu equipo se divierte y tu marca queda presente en cada foto"],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/celebra/cumple.jpg",
    alt: "Cabina de fotos con accesorios para eventos corporativos - Nova BTL y Eventos",
    titulo: "CUMPLEAÑOS",
    items: ["Risas, poses y fotos al instante para celebrar un año más"],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/celebra/bautizos.jpg",
    alt: "Servicio de catering gourmet para eventos corporativos en Lima - Nova BTL y Eventos",
    titulo: "BAUTIZOS Y CELEBRACIONES",
    items: ["Momentos en familia que merecen quedar impresos para siempre"],
    href: "/complementa-tu-evento",
  },
];

export default function CelebraSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#02152b] py-[100px]">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1290px] px-5">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 text-center">
            <span className="font-poppins text-[15.5px] font-bold uppercase tracking-[0.25em] text-white/80">
              Momentos que dejan huella
            </span>

            {/* Título: responsive — en móvil puede romper, en desktop 1 línea */}
            <h2
              className="
              mt-3 font-krona text-3xl uppercase leading-tight tracking-wide text-white
              md:text-4xl lg:text-5xl lg:whitespace-nowrap
              [text-shadow:0.5px_0_currentColor,-0.5px_0_currentColor]
            "
            >
              CELEBRA CADA MOMENTO <br />
              <span className="text-[#f5c542]">CON NOSOTROS</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl font-poppins text-base leading-relaxed tracking-wide text-white/70 md:text-lg">
              Creamos experiencias únicas para hacer de tu evento un recuerdo
              inolvidable. Estamos presentes en diferentes tipos de eventos,
              aportando un toque especial a cada celebración.
            </p>
          </div>
        </Reveal>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {CARDS.map((card, i) => (
            // Cada card entra en cascada dentro de su fila
            <Reveal key={card.titulo} delay={(i % 3) * 150}>
              <article
                className="
                  group flex h-full flex-col overflow-hidden rounded-2xl
                  border border-white/[0.06] bg-[#0d1b2a]/80 backdrop-blur-sm
                  transition-all duration-500
                  hover:-translate-y-2 hover:border-[#f5c542]/60
                  hover:shadow-[0_24px_48px_-12px_rgba(245,197,66,0.35)]
                "
              >
                {/* Imagen */}
                <div className="relative h-[340px] w-full overflow-hidden">
                  <Image
                    src={card.img}
                    alt={card.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="
                      object-cover
                      transition-transform duration-700 ease-out
                      group-hover:scale-105
                    "
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d1b2a] via-[#0d1b2a]/60 to-transparent" />
                </div>

                {/* Título + frase + link */}
                <div className="flex flex-1 flex-col items-center p-6 text-center">
                  {/* Alto fijo de 2 líneas para que todos los títulos queden a la misma altura */}
                  <h3 className="mb-4 flex min-h-[70px] items-center justify-center text-[28px] uppercase leading-tight tracking-wide text-white">
                    {card.titulo}
                  </h3>

                  <div className="mb-6 flex-1">
                    {card.items.map((item) => (
                      <p
                        key={item}
                        className="font-poppins text-[17px] leading-relaxed tracking-wide text-white/85"
                      >
                        {item}
                      </p>
                    ))}
                  </div>

                  <a
                    href={card.href}
                    className="
                      inline-flex items-center gap-2
                      rounded-full border border-transparent px-6 py-2
                      font-poppins text-[15px] font-semibold tracking-wide
                      text-[#f5c542]
                      transition-all duration-300
                      hover:gap-3 hover:border-[#f5c542]
                    "
                  >
                    Conoce más
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Botón inferior */}
        <Reveal>
          <div className="mt-14 text-center">
            <a
              href="/complementa-tu-evento"
              className="
                group relative inline-block overflow-hidden rounded-full
                bg-[#f5c542] px-10 py-4
                font-poppins text-lg font-semibold text-[#02152b]
                shadow-lg shadow-[#f5c542]/20
                transition-all duration-500
                hover:scale-105 hover:text-white hover:shadow-xl
              "
            >
              <span
                className="
                  absolute inset-0 bg-gradient-to-r from-[#09217d] to-[#0054ef]
                  opacity-0 transition-opacity duration-500
                  group-hover:opacity-100
                "
              />
              <span className="relative z-10">Ver complementos</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}