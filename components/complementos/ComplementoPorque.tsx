
import Image from "next/image";
import Reveal from "@/components/Reveal";
import type { Complemento } from "@/lib/Complementos";

// Razones iguales para todos los servicios
const RAZONES = [
  {
    icon: "fa-regular fa-gem",
    titulo: "Calidad garantizada",
    texto: "Trabajamos con equipos profesionales para ofrecer experiencias de alto nivel.",
  },
  {
    icon: "fa-solid fa-user-group",
    titulo: "Personal capacitado",
    texto: "Nuestro equipo acompaña la operación de principio a fin.",
  },
  {
    icon: "fa-regular fa-star",
    titulo: "Personalización",
    texto: "Adaptamos el servicio a la identidad de tu evento, marca u objetivo.",
  },
  {
    icon: "fa-solid fa-location-dot",
    titulo: "Cobertura nacional",
    texto: "Atendemos eventos en Lima Metropolitana y en todo el Perú, previa coordinación.",
  },
];

export default function ComplementoPorQue({ complemento }: { complemento: Complemento }) {
  const { titulo, galeria } = complemento;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-[1200px]">
        {/* Título */}
        <Reveal>
          <h2 className="text-center font-krona text-3xl leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
            ¿Por qué elegir <span className="text-[#c47f0a]">Miranda</span>?
          </h2>
        </Reveal>

        {/* 4 razones con línea dorada a la izquierda */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {RAZONES.map((r, i) => (
            <Reveal key={r.titulo} delay={i * 120}>
              <div className="group flex gap-4 border-l-2 border-[#f5c542] pl-5 transition-colors duration-300 hover:border-[#0054ef]">
                <i
                  className={`${r.icon} mt-1 text-xl text-[#c47f0a] transition-colors duration-300 group-hover:text-[#0054ef]`}
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-base font-bold text-[#192a3d]">{r.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed">{r.texto}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Fotos del servicio (solo si tiene) */}
        {galeria?.length ? (
          <div className="mx-auto mt-16 grid max-w-[900px] grid-cols-1 gap-6 sm:grid-cols-2">
            {galeria.slice(0, 2).map((src, i) => (
              <Reveal key={src} delay={i * 150}>
                <div className="group relative aspect-square overflow-hidden rounded-3xl shadow-[0_24px_48px_-16px_rgba(2,21,43,0.35)]">
                  <Image
                    src={src}
                    alt={`${titulo} - foto ${i + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 450px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}