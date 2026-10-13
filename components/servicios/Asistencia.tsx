import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

// 👇 Imagen de relleno: cámbiala por una foto de invitados con el espejo
const IMAGEN_GALERIA = "/images/nova-btl/celebra/cumple.jpg";

const BENEFICIOS = [
  {
    icon: "fa-solid fa-screwdriver-wrench",
    titulo: "Instalación profesional",
    desc: "Antes del inicio del evento.",
  },
  {
    icon: "fa-solid fa-shield-halved",
    titulo: "Soporte técnico",
    desc: "Durante todo el evento.",
  },
  {
    icon: "fa-solid fa-user-check",
    titulo: "Personal capacitado",
    desc: "Para guiar a tus invitados.",
  },
  {
    icon: "fa-regular fa-clock",
    titulo: "Puntualidad y compromiso",
    desc: "En cada detalle.",
  },
];

export default function Asistencia() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1290px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Columna izquierda: compromiso */}
        <div>
          <Reveal>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#02152b] to-[#09217d] text-2xl text-[#f5c542] shadow-lg">
              <i className="fa-solid fa-gear" aria-hidden="true" />
            </div>

            <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-[#c47f0a]">
              Nuestro compromiso
            </span>

            <h2 className="mt-3 font-krona text-3xl uppercase leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
              Instalación y asistencia
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed md:text-lg">
              Nos encargamos de coordinar la instalación, prueba de equipos y la
              asistencia durante todo el evento, para que tú solo te preocupes
              de disfrutar.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {BENEFICIOS.map((b, i) => (
              <Reveal key={b.titulo} delay={150 + i * 100} className="h-full">
                <div
                  className="
                    group flex h-full items-start gap-4 rounded-2xl
                    border border-[#02152b]/[0.08] bg-white p-5
                    shadow-[0_10px_25px_-5px_rgba(2,21,43,0.05)]
                    transition-all duration-300
                    hover:-translate-y-1 hover:border-[#f5c542]
                    hover:shadow-[0_20px_35px_-10px_rgba(245,197,66,0.25)]
                  "
                >
                  <span
                    className="
                      flex h-11 w-11 shrink-0 items-center justify-center rounded-xl
                      bg-[#02152b]/5 text-lg text-[#0054ef]
                      transition-all duration-300
                      group-hover:bg-[#f5c542] group-hover:text-[#02152b]
                    "
                  >
                    <i className={b.icon} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-[#192a3d]">
                      {b.titulo}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Columna derecha: tarjeta de galería */}
        <Reveal delay={200}>
          <div className="group relative min-h-[460px] overflow-hidden rounded-3xl border border-[#f5c542]/30 bg-[#02152b] shadow-[0_24px_48px_-16px_rgba(2,21,43,0.45)]">
            <Image
              src={IMAGEN_GALERIA}
              alt="Invitados disfrutando del espejo mágico en un evento"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Degradado para que el texto se lea */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#02152b] via-[#02152b]/80 to-transparent" />

            <div className="relative z-10 flex h-full min-h-[460px] max-w-sm flex-col justify-center p-8 text-white md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f5c542]/40 bg-white/10 text-2xl text-[#f5c542] backdrop-blur-sm">
                <i className="fa-regular fa-image" aria-hidden="true" />
              </div>

              <span className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c542]">
                Galería
              </span>

              <h3 className="mt-2 font-krona text-2xl uppercase leading-tight text-white md:text-3xl">
                Momentos reales
              </h3>

              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Mira algunos de los momentos que hemos creado en diferentes
                eventos.
              </p>

              <Link
                href="/portafolio"
                className="
                  mt-8 inline-flex w-fit items-center gap-2 rounded-full
                  border border-[#f5c542] px-6 py-3
                  text-sm font-semibold text-[#f5c542]
                  transition-all duration-300
                  hover:gap-3 hover:bg-[#f5c542] hover:text-[#02152b]
                "
              >
                Ver galería
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}