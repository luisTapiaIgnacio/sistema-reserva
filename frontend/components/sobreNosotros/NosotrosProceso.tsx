import { Fragment } from "react";
import Reveal from "@/components/Reveal";

const PASOS = [
  {
    titulo: "Conocemos tu evento",
    texto: "Nos cuentas el tipo de celebración, la fecha y el estilo que buscas para recomendarte el espejo ideal.",
  },
  {
    titulo: "Diseñamos la experiencia",
    texto: "Personalizamos marcos, animaciones y mensajes con la temática de tu evento o la identidad de tu marca.",
  },
  {
    titulo: "Montamos y acompañamos",
    texto: "Llegamos a tiempo, instalamos el equipo y te acompañamos durante todo el servicio contratado.",
  },
  {
    titulo: "Entregamos los recuerdos",
    texto: "Tus invitados se llevan sus fotos y tú recibes el material del evento para revivirlo cuando quieras.",
  },
];

export default function NosotrosProceso() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <Reveal>
          <h2 className="text-center font-krona text-2xl leading-tight text-[#192a3d]! md:text-4xl">
            Así llevamos tu evento de la idea a la <span className="text-[#c47f0a]">celebración</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed">
            Un proceso claro y cuidado en cada etapa para que tu experiencia salga tal como la imaginaste.
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col items-stretch gap-4 lg:flex-row lg:items-stretch lg:gap-3">
          {PASOS.map((p, i) => (
            <Fragment key={p.titulo}>
              <Reveal delay={i * 120} className="flex-1">
                <article
                  className={`group h-full rounded-2xl border border-[#02152b]/[0.08] p-6 text-center shadow-[0_12px_30px_-10px_rgba(2,21,43,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#f5c542] ${
                    i % 2 === 0 ? "bg-gradient-to-b from-[#e8f0ff] to-white" : "bg-gradient-to-b from-[#fff3cf] to-white"
                  }`}
                >
                  <span className="font-krona text-3xl text-[#c47f0a]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-3 text-lg font-bold leading-snug text-[#192a3d]">{p.titulo}</h3>
                  <p className="mt-3 text-sm leading-relaxed">{p.texto}</p>
                </article>
              </Reveal>

              {/* Flecha entre pasos */}
              {i < PASOS.length - 1 && (
                <span className="flex items-center justify-center text-[#c47f0a]" aria-hidden="true">
                  <i className="fa-solid fa-chevron-down lg:hidden" />
                  <i className="fa-solid fa-chevron-right hidden lg:block" />
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
