import Image from "next/image";
import Reveal from "@/components/Reveal";

const PASOS = [
  { icon: "/images/nova-btl/logo_01.png", texto: "Entendemos tu objetivo" },
  { icon: "/images/nova-btl/logo_02.png", texto: "Diseñamos la experiencia" },
  { icon: "/images/nova-btl/logo_03.png", texto: "Ejecutamos con precisión" },
  { icon: "/images/nova-btl/logo_04.png", texto: "Medimos impacto" },
];
// Colores alternados: par = azul claro, impar = dorado claro
const BG_COLORS = [
  "bg-[#e3ecff] border border-[#0054ef]/15",
  "bg-[#fff3cf] border border-[#f5c542]/40",
  "bg-[#e3ecff] border border-[#0054ef]/15",
  "bg-[#fff3cf] border border-[#f5c542]/40",
];

export default function ProcesoSection() {
  return (
    <section className="relative w-full py-[80px]">
      <div className="relative z-10 mx-auto max-w-[1400px] px-5">
        {/* Título */}
        <Reveal>
          <h2 className="text-center font-krona text-3xl uppercase leading-tight tracking-wide text-[#192a3d] md:text-4xl">
            ¿Cómo damos vida a tus ideas?
          </h2>
        </Reveal>

        {/* Grid de pasos */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {PASOS.map((paso, i) => (
            // Cada paso entra uno tras otro
            <Reveal key={paso.texto} delay={i * 150}>
              <div
                className={`
                  flex h-full flex-col items-center rounded-3xl px-6 py-10 text-center
                  ${BG_COLORS[i]}
                  shadow-[0_10px_30px_-12px_rgba(25,42,61,0.15)]
                  transition-all duration-300
                  hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-12px_rgba(25,42,61,0.25)]
                `}
              >
                {/* Ícono */}
                <div className="flex h-[80px] w-[80px] items-center justify-center">
                  <Image
                    src={paso.icon}
                    alt=""
                    width={70}
                    height={70}
                    className="h-auto w-full object-contain"
                  />
                </div>

                {/* Número */}
                <p className="mt-5 font-krona text-3xl text-[#0054ef]">
                  {String(i + 1).padStart(2, "0")}
                </p>

                {/* Texto */}
                <p className="mt-3 font-poppins text-base font-bold leading-snug text-[#192a3d]">
                  {paso.texto}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}