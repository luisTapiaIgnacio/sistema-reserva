import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imagen de relleno
const IMAGEN = "/images/nova-btl/complementarios-2.jpg";

// 👇 Los 4 servicios (cambia íconos, títulos y textos)
const SERVICIOS = [
  { icon: "fa-solid fa-screwdriver-wrench", titulo: "Celebraciones especiales", texto: "Experiencias que acompañan los momentos más importantes." },
  { icon: "fa-solid fa-palette", titulo: "Eventos corporativos", texto: "Una propuesta interactiva para compartir, conectar y disfrutar." },
  { icon: "fa-solid fa-bullhorn", titulo: "Diversión para todos", texto: "Una experiencia para que amigos, familiares e invitados participen" },
  { icon: "fa-solid fa-truck-fast", titulo: "Recuerdos para conservar", texto: "Detalles que permiten llevar un recuerdo de una fecha especial." },
];

export default function NosotrosServiciosBTL() {
  return (
    <section className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins text-white/70 md:py-28">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        {/* Encabezado centrado */}
        <Reveal>
          <h2 className="text-center font-krona text-2xl leading-tight text-white! md:text-4xl">
            Cada celebración tiene<span className="text-[#f5c542]"> su propia historia</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed">
            Una boda, un cumpleaños, una graduación o un evento corporativo tienen algo en común: están llenos de momentos que vale la pena conservar. <br/>
            En MIRANDA MAGIC MIRROR hacemos que esos momentos formen parte de una experiencia participativa, donde los invitados no solo asisten al evento, sino que también se convierten en protagonistas de sus propios recuerdos.
          
            
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          {/* Imagen */}
          <Reveal>
            <div className="relative">
              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-3xl border border-[#f5c542]/40" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]">
                <Image src={IMAGEN} alt="Servicios de eventos y BTL" fill sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
              </div>
            </div>
          </Reveal>

          {/* Texto + 4 servicios */}
          <div>
            <Reveal>
              <p className="text-center text-base leading-relaxed lg:text-left">
                Sugerencia visual: presentar cuatro bloques con fotografías y textos breves:
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2">
              {SERVICIOS.map((s, i) => (
                <Reveal key={s.titulo} delay={i * 100}>
                  <div className="group flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#f5c542]/40 bg-[#f5c542]/10 text-[#f5c542] transition-all duration-300 group-hover:bg-[#f5c542] group-hover:text-[#02152b]">
                      <i className={s.icon} aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="border-b border-white/15 pb-2 text-lg font-semibold text-white transition-colors duration-300 group-hover:border-[#f5c542]/60">
                        {s.titulo}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed">{s.texto}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}