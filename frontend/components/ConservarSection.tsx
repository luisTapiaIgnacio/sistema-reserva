import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

// 👇 Cambia este número por el WhatsApp real (código de país + número, sin + ni espacios)
const WHATSAPP = "51999999999";

const wa = (mensaje: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

type Paso = {
  num: string;
  icon: string;
  titulo: string;
  desc: ReactNode;
  pieIcon: string;
  pie: string;
  mensaje: string;
};

const PASOS: Paso[] = [
  {
    num: "01",
    icon: "fa-brands fa-whatsapp",
    titulo: "Contáctanos",
    desc: "Escríbenos por WhatsApp y cuéntanos qué tipo de evento estás organizando.",
    pieIcon: "fa-brands fa-whatsapp",
    pie: "Chatear ahora",
    mensaje: "Hola, deseo reservar Miranda Magic Mirror para mi evento",
  },
  {
    num: "02",
    icon: "fa-regular fa-calendar-days",
    titulo: "Consulta la disponibilidad",
    desc: "Indícanos la fecha, el horario y la dirección de tu celebración.",
    pieIcon: "fa-solid fa-clock",
    pie: "Verificar fecha",
    mensaje: "Hola, deseo consultar disponibilidad para mi evento",
  },
  {
    num: "03",
    icon: "fa-solid fa-file-invoice-dollar",
    titulo: "Recibe tu cotización",
    desc: "Te brindaremos información sobre el servicio, el precio y las condiciones de reserva.",
    pieIcon: "fa-solid fa-tag",
    pie: "Ver tarifas",
    mensaje: "Hola, deseo recibir mi cotización para Miranda Magic Mirror",
  },
  {
    num: "04",
    icon: "fa-solid fa-champagne-glasses",
    titulo: "¡Disfruta de la experiencia!",
    desc: (
      <>
        Coordinaremos los detalles para que{" "}
        <strong className="text-[#02152b]">MIRANDA MAGIC MIRROR</strong> forme
        parte de tu evento.
      </>
    ),
    pieIcon: "fa-solid fa-star",
    pie: "Reservar fecha",
    mensaje:
      "Hola, estoy listo para disfrutar de la experiencia Miranda Magic Mirror",
  },
];

export default function ComoReservarSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-4 py-20 font-poppins text-[#3a4f66] sm:px-6 lg:px-8">
      {/* Fondos decorativos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#f5c542]/40 bg-[#ffe9a8] px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#c47f0a] shadow-sm">
              <i
                className="fa-solid fa-crown text-[#c47f0a]"
                aria-hidden="true"
              />
              Proceso Exclusivo
            </span>

            <h2 className="mb-4 text-3xl font-bold uppercase tracking-tight text-[#192a3d] sm:text-4xl md:text-5xl">
              CÓMO{" "}
              <span className="bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text text-transparent [text-shadow:0_0_20px_rgba(245,197,66,0.3)]">
                RESERVAR
              </span>
            </h2>

            <p className="text-base text-[#3a4f66] sm:text-lg">
              Sigue estos sencillos pasos para asegurar que{" "}
              <strong className="text-[#02152b]">MIRANDA MAGIC MIRROR</strong>{" "}
              forme parte inolvidable de tu evento.
            </p>
          </div>
        </Reveal>

        {/* Pasos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {PASOS.map((paso, i) => (
            // Cada paso entra uno tras otro
            <Reveal key={paso.num} delay={i * 150}>
              <a
                href={wa(paso.mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group relative flex h-full cursor-pointer flex-col justify-between
                  rounded-2xl border border-[#02152b]/[0.08] bg-white p-6 sm:p-8
                  shadow-[0_10px_25px_-5px_rgba(2,21,43,0.05)]
                  transition-all duration-[350ms] ease-in-out
                  hover:-translate-y-2 hover:scale-[1.02] hover:border-[#f5c542]
                  hover:bg-gradient-to-br hover:from-white hover:to-[#fffdf5]
                  hover:shadow-[0_20px_35px_-10px_rgba(245,197,66,0.25)]
                "
              >
                {/* Número del paso */}
                <div className="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#f5c542]/40 bg-gradient-to-br from-[#02152b] to-[#09217d] text-sm font-bold text-[#ffe9a8] shadow-md">
                  {paso.num}
                </div>

                <div>
                  <div
                    className="
                      mb-6 flex h-14 w-14 items-center justify-center rounded-2xl
                      bg-[#02152b]/5 text-2xl text-[#0054ef] shadow-sm
                      transition-all duration-[350ms] ease-in-out
                      group-hover:rotate-[5deg] group-hover:scale-110
                      group-hover:bg-[#f5c542] group-hover:text-[#02152b]
                    "
                  >
                    <i className={paso.icon} aria-hidden="true" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-[#192a3d] transition-colors group-hover:text-[#09217d]">
                    {paso.titulo}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#3a4f66]">
                    {paso.desc}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs font-semibold text-[#c47f0a]">
                  <span className="flex items-center gap-1.5">
                    <i className={paso.pieIcon} aria-hidden="true" />
                    {paso.pie}
                  </span>
                  <i
                    className="fa-solid fa-arrow-right -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Botón */}
        <Reveal>
          <div className="mt-14 text-center">
            <a
              href={wa(
                "Hola, deseo más información sobre Miranda Magic Mirror",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-3 rounded-full
                border border-[#f5c542]/40
                bg-gradient-to-r from-[#02152b] via-[#09217d] to-[#0054ef]
                px-8 py-4 font-semibold text-white
                shadow-xl shadow-[#02152b]/20
                transition-all duration-300
                hover:scale-105 hover:from-[#09217d] hover:to-[#0054ef]
              "
            >
              <i
                className="fa-brands fa-whatsapp text-2xl text-[#f5c542]"
                aria-hidden="true"
              />
              <span>Iniciar Conversación por WhatsApp</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}