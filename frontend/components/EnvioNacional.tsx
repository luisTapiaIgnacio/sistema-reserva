import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imagen de relleno: cámbiala por la ruta de tu mapa del Perú
const MAPA = "/images/nova-btl/peruMapa.png";
// Posición de cada pin sobre el mapa (en % del ancho y alto de la imagen)
const PINES = [
  { left: "34%", top: "23%" },
  { left: "54%", top: "22%" },
  { left: "19%", top: "33%" },
  { left: "45%", top: "33%" },
  { left: "29%", top: "42%" },
  { left: "42%", top: "48%" },
  { left: "26%", top: "52%" },
  { left: "60%", top: "53%" },
  { left: "58%", top: "66%" },
  { left: "82%", top: "65%" },
  { left: "70%", top: "76%" },
  { left: "53%", top: "81%" },
  { left: "70%", top: "87%" },
];

const ZONAS = [
  {
    icon: "fa-solid fa-location-dot",
    titulo: "Lima Metropolitana",
    desc: "Atención para eventos dentro de Lima Metropolitana, previa coordinación de fecha y ubicación.",
    delay: "0s",
  },
  {
    icon: "fa-solid fa-truck-fast",
    titulo: "Departamentos del Perú",
    desc: "Servicio a nivel nacional previa coordinación y evaluación de los costos de traslado y logística.",
    delay: "1.2s",
  },
];

export default function EnvioNacional() {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-[100px] font-poppins text-white sm:px-6 lg:px-8">
      {/* Animación flotante de los íconos */}
      <style>{`
        @keyframes flotar {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>

      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/15 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1290px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Columna izquierda: textos */}
        <div>
          <Reveal>
            <h2 className="font-krona text-3xl uppercase leading-tight tracking-wide text-[#f5c542] md:text-4xl">
              Cobertura a nivel nacional
            </h2>

            <p className="mt-4 max-w-xl text-2xl font-bold leading-snug tracking-wide text-white md:text-3xl">
              Llegamos donde tus momentos especiales nos necesiten
            </p>

            <p className="mt-8 max-w-xl text-base leading-relaxed tracking-wide text-white/60 md:text-lg">
              Brindamos nuestro servicio de alquiler de espejos fotográficos en
              Lima Metropolitana y en los departamentos de todo el Perú, previa
              coordinación.
            </p>
          </Reveal>

          <div className="mt-10 space-y-8">
            {ZONAS.map((zona, i) => (
              // Cada zona entra una tras otra
              <Reveal key={zona.titulo} delay={150 + i * 150}>
                <div className="group flex items-start gap-4">
                  {/* Ícono flotante */}
                  <div
                    className="
                      flex h-12 w-12 shrink-0 items-center justify-center rounded-full
                      bg-gradient-to-br from-[#0054ef] to-[#09217d] text-lg text-white
                      shadow-lg shadow-[#0054ef]/30
                      animate-[flotar_3s_ease-in-out_infinite]
                    "
                    style={{ animationDelay: zona.delay }}
                  >
                    <i className={zona.icon} aria-hidden="true" />
                  </div>

                  <div>
                    {/* Rectángulo transparente con hover */}
                    <h3
                      className="
                        inline-block rounded-full border border-white/25 bg-transparent
                        px-6 py-2 text-sm font-bold uppercase tracking-wider text-[#5b9bff]
                        transition-all duration-300
                        group-hover:border-[#f5c542] group-hover:bg-[#f5c542]/10
                        group-hover:text-[#f5c542]
                        group-hover:shadow-[0_0_24px_-6px_rgba(245,197,66,0.6)]
                      "
                    >
                      {zona.titulo}
                    </h3>

                    <p className="mt-3 max-w-md text-[15px] leading-relaxed tracking-wide text-white/85">
                      {zona.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Columna derecha: mapa */}
        <Reveal delay={200}>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[560px]">
            <Image
              src={MAPA}
              alt="Mapa del Perú con la cobertura de Miranda Magic Mirror"
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-contain"
            />

            {/* Pines blancos flotando */}
            {PINES.map((pin, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pin.left, top: pin.top }}
              >
                <i
                  className="fa-solid fa-location-dot block text-2xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] animate-[flotar_3s_ease-in-out_infinite]"
                  style={{ animationDelay: `${(i % 5) * 0.4}s` }}
                  aria-hidden="true"
                />
              </span>
            ))}

            {/* Pin grande de Lima */}
            <span
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: "37%", top: "61%" }}
            >
              <i
                className="fa-solid fa-location-dot block text-6xl text-[#3b4bff] drop-shadow-[0_0_14px_rgba(59,75,255,0.7)] [-webkit-text-stroke:3px_white] animate-[flotar_3s_ease-in-out_infinite]"
                aria-hidden="true"
              />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}