import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imágenes de relleno: reemplázalas por fotos reales de eventos
const IMAGENES = [
  "/images/nova-btl/complementarios.jpg",
  "/images/nova-btl/complementarios-2.jpg",
  "/images/nova-btl/complementarios-3.jpg",
];

// destacado = palabra que va en dorado
const RAZONES = [
  {
    titulo: ["Acompañamiento", " cercano"],
    texto: "Te asesoramos desde la reserva hasta el día del evento para elegir el espejo, los diseños y el horario ideal.",
  },
  {
    titulo: ["Equipos", " de calidad"],
    texto: "Espejos y accesorios en óptimo estado, revisados antes de cada evento para garantizar un funcionamiento impecable.",
  },
  {
    titulo: ["Comunicación", " constante"],
    texto: "Te mantenemos informado por WhatsApp en cada etapa, con respuestas rápidas y claras.",
  },
  {
    titulo: ["Precios", " transparentes"],
    texto: "Tarifas claras desde el inicio, sin costos ocultos y con opciones que se adaptan a tu presupuesto.",
  },
  {
    titulo: ["Ejecución", " profesional"],
    texto: "Personal capacitado que llega a tiempo, monta el equipo y acompaña a tus invitados durante todo el servicio.",
  },
];

export default function NosotrosPorQue() {
  return (
    <section className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins text-white/70 md:py-28">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-[28rem] w-[28rem] rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Título */}
          <Reveal>
            <h2 className="font-krona text-2xl leading-tight text-white! md:text-4xl">
              ¿Por qué <span className="text-[#f5c542]">Miranda</span> es el aliado ideal para tu celebración?
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed">
              No solo alquilamos un espejo: creamos una experiencia que tus invitados recordarán, cuidando cada
              detalle técnico y creativo.
            </p>
          </Reveal>

          {/* Collage de 3 imágenes */}
          <Reveal delay={150}>
            <div className="relative mx-auto h-[300px] w-full max-w-md sm:h-[360px]">
              <div className="absolute right-0 top-0 h-[55%] w-[62%] overflow-hidden rounded-2xl border border-[#f5c542]/40 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]">
                <Image src={IMAGENES[0]} alt="Evento con espejo mágico" fill sizes="300px" className="object-cover" />
              </div>
              <div className="absolute left-0 top-[22%] z-10 h-[45%] w-[48%] overflow-hidden rounded-2xl border border-[#f5c542]/40 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]">
                <Image src={IMAGENES[1]} alt="Invitados usando el espejo" fill sizes="240px" className="object-cover" />
              </div>
              <div className="absolute bottom-0 right-[6%] z-20 h-[45%] w-[58%] overflow-hidden rounded-2xl border border-[#f5c542]/40 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]">
                <Image src={IMAGENES[2]} alt="Equipo Miranda en montaje" fill sizes="280px" className="object-cover" />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Tarjetas */}
        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
          {RAZONES.map((r, i) => (
            <Reveal key={r.titulo.join("")} delay={(i % 2) * 120} className={i === 0 ? "md:col-span-2 md:max-w-[calc(50%-0.5rem)]" : ""}>
              <article className="group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-[#f5c542]/50">
                <h3 className="flex items-center gap-3 text-base font-semibold text-white">
                  <i className="fa-regular fa-circle-check text-[#f5c542]" aria-hidden="true" />
                  <span>
                    <span className="text-[#f5c542]">{r.titulo[0]}</span>
                    {r.titulo[1]}
                  </span>
                </h3>
                <p className="mt-2 pl-7 text-sm leading-relaxed">{r.texto}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
