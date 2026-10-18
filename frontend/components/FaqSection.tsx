"use client";

import Reveal from "@/components/Reveal";
import { useState } from "react";

// 👇 Respuestas de ejemplo: actualízalas con la información real
const PREGUNTAS = [
  {
    pregunta: "¿Cuál es el precio del alquiler?",
    respuesta:
      "El precio depende de la fecha, la duración del servicio y la ubicación de tu evento. Escríbenos por WhatsApp y te enviaremos una cotización sin compromiso.",
  },
  {
    pregunta: "¿En qué lugares ofrecen el servicio?",
    respuesta:
      "Atendemos eventos en Lima Metropolitana y en los departamentos de todo el Perú, previa coordinación y evaluación de los costos de traslado y logística.",
  },
  {
    pregunta: "¿Para qué tipos de eventos puedo contratar el espejo?",
    respuesta:
      "Nuestro espejo fotográfico es ideal para bodas, quinceañeros, graduaciones, cumpleaños, bautizos y eventos corporativos.",
  },
  {
    pregunta: "¿Cómo puedo reservar una fecha?",
    respuesta:
      "Contáctanos por WhatsApp, indícanos la fecha, el horario y la dirección de tu evento. Verificamos la disponibilidad y te explicamos las condiciones de reserva.",
  },
  {
    pregunta: "¿Puedo solicitar una cotización personalizada?",
    respuesta:
      "Sí. Cuéntanos los detalles de tu celebración y prepararemos una propuesta a la medida de tu evento.",
  },
];

export default function FaqSection() {
  // Índice de la pregunta abierta (null = todas cerradas)
  const [abierta, setAbierta] = useState<number | null>(0);

  return (
    <section className="relative px-4 py-20 font-poppins text-[#3a4f66] sm:px-6 lg:px-8">
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="mb-4 font-krona text-3xl uppercase leading-tight tracking-wide text-[#0054ef] sm:text-4xl md:text-5xl">
              <span className="bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text text-transparent">
                preguntas frecuentes
              </span>
            </h2>

            <p className="text-base sm:text-lg">
              Resolvemos tus dudas, todo lo que necesitas saber antes de
              reservar{" "}
              <strong className="text-[#02152b]">MIRANDA MAGIC MIRROR</strong>{" "}
              para tu evento.
            </p>
          </div>
        </Reveal>

        {/* Preguntas */}
        <div className="space-y-4">
          {PREGUNTAS.map((item, i) => {
            const activa = abierta === i;

            return (
              // Cada pregunta entra una tras otra
              <Reveal key={item.pregunta} delay={i * 100}>
                <div
                  className={`
                    rounded-2xl border bg-white
                    transition-all duration-300
                    ${
                      activa
                        ? "border-[#f5c542] shadow-[0_20px_35px_-10px_rgba(245,197,66,0.25)]"
                        : "border-[#02152b]/[0.08] shadow-[0_10px_25px_-5px_rgba(2,21,43,0.05)] hover:border-[#f5c542]/60"
                    }
                  `}
                >
                  <button
                    type="button"
                    onClick={() => setAbierta(activa ? null : i)}
                    aria-expanded={activa}
                    className="flex w-full items-center gap-4 p-5 text-left sm:p-6"
                  >
                    {/* Número */}
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#f5c542]/40 bg-gradient-to-br from-[#02152b] to-[#09217d] text-sm font-bold text-[#ffe9a8] shadow-md">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Pregunta */}
                    <span
                      className={`flex-1 text-base font-semibold transition-colors duration-300 sm:text-lg ${
                        activa ? "text-[#09217d]" : "text-[#192a3d]"
                      }`}
                    >
                      {item.pregunta}
                    </span>

                    {/* Flecha */}
                    <span
                      className={`
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                        transition-all duration-300
                        ${
                          activa
                            ? "rotate-180 bg-[#f5c542] text-[#02152b]"
                            : "bg-[#02152b]/5 text-[#0054ef]"
                        }
                      `}
                    >
                      <i
                        className="fa-solid fa-chevron-down"
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  {/* Respuesta (se despliega suavemente) */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      activa ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-slate-200/80 px-5 pb-6 pt-4 text-[15px] leading-relaxed sm:px-6 sm:pl-[88px]">
                        {item.respuesta}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}