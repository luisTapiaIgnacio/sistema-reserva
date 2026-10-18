import Reveal from "@/components/Reveal";

const RAZONES = [
  "Acompañamiento cercano",
  "Proveedores confiables",
  "Optimización del presupuesto",
  "Comunicación constante",
  "Ejecución personal",
];

export default function PorQueSection() {
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

      <div className="relative z-10 mx-auto max-w-[1290px]">
        {/* Encabezado: título a la izquierda, texto a la derecha */}
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-12">
            <h2 className="font-krona text-3xl uppercase leading-tight tracking-wide text-[#f5c542] md:max-w-[560px] md:text-4xl">
              ¿Por qué contratar a Miranda Mirror?
            </h2>

            <p className="text-base leading-relaxed tracking-wide text-white/70 md:max-w-[440px] md:text-right">
              <strong className="font-semibold text-white">
                Más que proveedores
              </strong>
              , somos un aliado estratégico que se involucra en cada detalle
              para asegurar resultados alineados a tu negocio, evento o plan.
            </p>
          </div>
        </Reveal>

        {/* Razones en zigzag (en desktop), unidas por líneas */}
        <div className="mt-16 grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:pb-4">
          {RAZONES.map((razon, i) => {
            const abajo = i % 2 === 0; // posiciones 1, 3 y 5 van abajo
            const ultimo = i === RAZONES.length - 1;

            return (
              // Cada razón entra una tras otra (el margen del zigzag va en el envoltorio)
              <Reveal
                key={razon}
                delay={i * 150}
                className={abajo ? "lg:mt-28" : ""}
              >
                <div className="group relative flex items-start gap-3">
                  {/* Línea que conecta con la siguiente razón (solo desktop) */}
                  {!ultimo && (
                    <span
                      aria-hidden="true"
                      className={`
                        pointer-events-none absolute left-[22px] hidden h-[90px]
                        w-[calc(100%+2px)] border-l border-white/30 lg:block
                        ${
                          abajo
                            ? "bottom-full rounded-tl-xl border-t"
                            : "top-11 rounded-bl-xl border-b"
                        }
                      `}
                    />
                  )}

                  {/* Ícono flotante */}
                  <div
                    className="
                      relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full
                      bg-gradient-to-br from-[#0054ef] to-[#09217d] text-base text-white
                      shadow-lg shadow-[#0054ef]/30
                      animate-[flotar_3s_ease-in-out_infinite]
                    "
                    style={{ animationDelay: `${i * 0.4}s` }}
                  >
                    <i className="fa-solid fa-thumbs-up" aria-hidden="true" />
                  </div>

                  {/* Rectángulo transparente con hover */}
                  <h3
                    className="
                      relative flex-1 rounded-[28px] border border-white/25 bg-transparent
                      px-4 py-3 text-sm font-bold uppercase leading-snug tracking-wide
                      text-[#5b9bff]
                      transition-all duration-300
                      group-hover:border-[#f5c542] group-hover:bg-[#f5c542]/10
                      group-hover:text-[#f5c542]
                      group-hover:shadow-[0_0_24px_-6px_rgba(245,197,66,0.6)]
                      lg:text-xs
                    "
                  >
                    {razon}
                  </h3>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}