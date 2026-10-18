import Image from "next/image";
import Reveal from "@/components/Reveal";

const CARDS = [
  {
    img: "/images/nova-btl/complementarios.jpg",
    alt: "Estación de snacks premium para eventos corporativos en Lima - Nova BTL y Eventos",
    titulo: "Estaciones snack premium",
    items: [
      "Charcutería gourmet",
      "Tablas personalizadas",
      "Productos premium",
      "Atención durante el evento",
    ],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/complementarios-3.jpg",
    alt: "Plataforma 360 para activaciones de marca y eventos corporativos - Nova BTL y Eventos",
    titulo: "Plataforma 360°",
    items: [
      "Videos 360 para redes",
      "Personalización con tu marca",
      "Entregas por enlace o inmediata",
      "Ideal para ferias y activaciones",
    ],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/complementarios-2.jpg",
    alt: "Servicio de fotografía instantánea con impresión para eventos corporativos - Nova BTL y Eventos",
    titulo: "Fotografía instantánea",
    items: [
      "Impresiones al instante",
      "Marcos y diseños personalizados",
      "Recuerdo para tus invitados",
      "Fotos ilimitadas",
    ],
    href: "/complementa-tu-evento",
  },

  // 👇 NUEVAS 3 CARDS
  {
    img: "/images/nova-btl/complementarios-4.jpg",
    alt: "Servicio de DJ y sonido profesional para eventos corporativos - Nova BTL y Eventos",
    titulo: "DJ y sonido profesional",
    items: [
      "Equipo de audio profesional",
      "Playlist personalizada",
      "Iluminación incluida",
      "Ambientación según tu marca",
    ],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/complementarios-5.jpg",
    alt: "Cabina de fotos con accesorios para eventos corporativos - Nova BTL y Eventos",
    titulo: "Cabina de fotos",
    items: [
      "Accesorios temáticos",
      "Impresión instantánea",
      "Fondo personalizado",
      "Comparte en redes al instante",
    ],
    href: "/complementa-tu-evento",
  },
  {
    img: "/images/nova-btl/complementarios-6.jpg",
    alt: "Servicio de catering gourmet para eventos corporativos en Lima - Nova BTL y Eventos",
    titulo: "Catering gourmet",
    items: [
      "Menú personalizado",
      "Presentación premium",
      "Servicio de mozos",
      "Opciones veganas y sin gluten",
    ],
    href: "/complementa-tu-evento",
  },
];

export default function ComplementaSection() {
  return (
    <section className="relative w-full overflow-hidden py-[100px]">
      {/* 🎨 Fondo oscuro */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/nova-btl/bg-black.jpg')" }}
      />
      <div className="absolute inset-0 -z-10 bg-black/60" />

      <div className="relative mx-auto max-w-[1290px] px-5">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="font-poppins text-[15.5px] font-bold uppercase tracking-[0.25em] text-white/80">
              Momentos que dejan huella
            </span>

            {/* Título: responsive — en móvil puede romper, en desktop 1 línea */}
            <h2
              className="
              mt-3 font-krona text-3xl uppercase leading-tight tracking-wide text-white
              md:text-5xl md:whitespace-nowrap
              [text-shadow:0.5px_0_currentColor,-0.5px_0_currentColor]
            "
            >
              CELEBRA CADA MOMENTO <br />
              <span className="text-pink">CON NOSOTROS</span>
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
                  hover:-translate-y-2 hover:border-pink/40
                  hover:shadow-[0_24px_48px_-12px_rgba(192,68,147,0.35)]
                "
              >
                {/* Imagen con título encima */}
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

                  <h3
                    className="
                    absolute bottom-4 left-6 right-6
                    text-[22px] uppercase leading-tight tracking-wide text-white
                    drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]
                  "
                  >
                    {card.titulo}
                  </h3>
                </div>

                {/* Lista + link */}
                <div className="flex flex-1 flex-col p-6">
                  <ul className="mb-6 flex-1 space-y-3">
                    {card.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className="
                            mt-1 flex h-4 w-4 shrink-0 items-center justify-center
                            rounded-full border border-pink
                          "
                          aria-hidden="true"
                        >
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 10 10"
                            fill="none"
                          >
                            <path
                              d="M1 5L4 8L9 2"
                              stroke="#c04493"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>

                        <span className="font-poppins text-[15px] leading-snug tracking-wide text-white/85">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={card.href}
                    className="
                      inline-flex items-center gap-2
                      font-poppins text-[15px] font-semibold tracking-wide
                      text-pink
                      transition-all duration-300
                      hover:gap-3 hover:text-pink/80
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
                bg-pink px-10 py-4
                font-poppins text-lg font-normal text-white
                shadow-lg
                transition-all duration-500
                hover:scale-105 hover:font-bold hover:shadow-xl
              "
            >
              <span
                className="
                  absolute inset-0 bg-gradient-to-r from-[#7fffd4] to-[#ff69ff]
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