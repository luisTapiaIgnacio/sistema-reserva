"use client";

import Reveal from "@/components/Reveal";
import { useState } from "react";

const PREGUNTAS = [
  {
    pregunta: "¿Qué es el Espejo Mágico?",
    respuesta:
      "Es un espejo interactivo que permite a tus invitados tomarse fotografías divertidas e imprimir sus recuerdos durante el evento.",
  },
  {
    pregunta: "¿Para qué eventos puedo contratarlo?",
    respuesta:
      "Para bodas, cumpleaños, quinceañeros, graduaciones, eventos corporativos y fiestas privadas.",
  },
  {
    pregunta: "¿Cuál es el precio del alquiler?",
    respuesta:
      "Contamos con paquetes desde S/ 1,000 por 2 horas de servicio. Consulta nuestras opciones disponibles.",
  },
  {
    pregunta: "¿Las fotografías se imprimen al instante?",
    respuesta:
      "¡Sí! Tus invitados pueden llevarse fotografías impresas como recuerdo del evento, según el paquete contratado.",
  },
  {
    pregunta: "¿Puedo personalizar las fotografías?",
    respuesta:
      "Sí, puedes solicitar diseños personalizados con nombres, fechas, frases o logotipos.",
  },
  {
    pregunta: "¿El servicio incluye accesorios?",
    respuesta:
      "Sí, contamos con accesorios divertidos como sombreros, lentes y otros complementos para las fotografías.",
  },
  {
    pregunta: "¿Con cuánta anticipación debo reservar?",
    respuesta:
      "Te recomendamos reservar con anticipación para asegurar la disponibilidad de tu fecha.",
  },
  {
    pregunta: "¿Cómo puedo realizar una reserva?",
    respuesta:
      "Contáctanos por WhatsApp e indícanos la fecha, el lugar y el tipo de evento.",
  },
  {
    pregunta: "¿Realizan servicios fuera de Lima?",
    respuesta:
      "Podemos evaluar solicitudes en otras ciudades del Perú, según disponibilidad y costos de traslado.",
  },
  {
    pregunta: "¿Puedo contratar horas adicionales?",
    respuesta:
      "Sí, puedes consultar por horas adicionales al momento de solicitar tu cotización.",
  },
  {
    pregunta: "¿El Espejo Mágico necesita electricidad?",
    respuesta:
      "Sí, necesita una conexión eléctrica para funcionar correctamente.",
  },
  {
    pregunta: "¿Cómo puedo solicitar una cotización?",
    respuesta:
      "Escríbenos por WhatsApp con los datos de tu evento y te ayudaremos a elegir el paquete ideal.",
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
              <Reveal key={item.pregunta} delay={Math.min(i, 5) * 100}>
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