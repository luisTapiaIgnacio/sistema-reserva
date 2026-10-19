import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imagen de relleno: cámbiala por la foto de tu espejo
const IMAGEN = "/images/nova-btl/celebra/bodas.jpg";

const CARACTERISTICAS = [
  "Fotografías de cuerpo entero.",
  "Interacción táctil y animaciones en pantalla.",
  "Marcos y diseños fotográficos personalizados.",
  "Fotografías digitales, según las características del equipo.",
  "Opciones para compartir fotografías mediante los medios disponibles.",
  "Recuerdos fotográficos durante el tiempo contratado.",
];

export default function ServicioPremium() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbfc] to-[#f2f5f7] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1290px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Columna izquierda: textos */}
        <Reveal>
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c47f0a]">
            <span className="h-px w-8 bg-[#c47f0a]" aria-hidden="true" />
            Nuestro equipo
          </span>

          <h2 className="mt-4 font-krona text-3xl uppercase leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
            El equipo y nuestro servicio premium
          </h2>

          <h3 className="mt-6 bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text font-poppins text-xl font-bold text-transparent md:text-2xl">
            Espejo mágico interactivo
          </h3>

          <p className="mt-3 max-w-xl text-base leading-relaxed md:text-lg">
            Una experiencia fotográfica de cuerpo entero que invita a tus
            invitados a interactuar con la pantalla, posar y capturar momentos
            únicos. Su presentación elegante complementa la decoración de
            cualquier celebración.
          </p>

          <ul className="mt-8 space-y-3">
            {CARACTERISTICAS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px]">
                <i
                  className="fa-solid fa-circle-check mt-1 text-[#0054ef]"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Columna derecha: imagen */}
        <Reveal delay={150}>
          <div className="relative">
            {/* Marco dorado decorativo detrás */}
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border border-[#f5c542]/50" />

            <div className="relative aspect-[4/4] overflow-hidden rounded-3xl border border-[#02152b]/10 shadow-[0_24px_48px_-16px_rgba(2,21,43,0.35)] md:aspect-[5/5]">
              <Image
                src={IMAGEN}
                alt="Espejo mágico interactivo de Miranda Magic Mirror"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}