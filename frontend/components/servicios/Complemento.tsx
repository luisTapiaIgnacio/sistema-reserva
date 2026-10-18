import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imágenes de relleno: cámbialas por las tuyas
const ACCESORIOS = [
  {
    img: "/images/nova-btl/celebra/bodas.jpg",
    titulo: "Alfombra roja y balaustres",
    desc: "Un espacio elegante para recibir a los invitados y dar protagonismo a las fotografías.",
  },
  {
    img: "/images/nova-btl/celebra/cumple.jpg",
    titulo: "Cotillón y accesorios",
    desc: "Lentes, sombreros, pelucas, letreros y props para fotografías llenas de diversión.",
  },
  {
    img: "/images/nova-btl/espejo-ft.jpg",
    titulo: "Iluminación LED",
    desc: "Iluminación complementaria para crear un ambiente fotográfico atractivo.",
  },
  {
    img: "/images/nova-btl/celebra/bautizos.jpg",
    titulo: "Ambientación personalizada",
    desc: "Opciones para fondos y detalles decorativos de acuerdo con la temática del evento.",
  },
];

export default function ComplementoEvento() {
  return (
    <section className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins text-white md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1290px]">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c542]">
              <span className="h-px w-8 bg-[#f5c542]" aria-hidden="true" />
              Complementa tu evento
            </span>

            <h2 className="mt-4 font-krona text-3xl uppercase leading-tight tracking-wide text-white! md:text-4xl">
              Accesorios y <span className="text-[#f5c542]">ambientación</span>
            </h2>

            <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
              Detalles que marcan la diferencia y hacen que cada fotografía sea
              aún más especial.
            </p>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACCESORIOS.map((item, i) => (
            <Reveal key={item.titulo} delay={i * 150} className="h-full">
              <article
                className="
                  group flex h-full flex-col overflow-hidden rounded-2xl
                  border border-white/[0.08] bg-[#0d1b2a]/80 backdrop-blur-sm
                  transition-all duration-500
                  hover:-translate-y-2 hover:border-[#f5c542]/60
                  hover:shadow-[0_24px_48px_-12px_rgba(245,197,66,0.35)]
                "
              >
                <div className="relative h-[220px] w-full overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.titulo}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d1b2a] to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold leading-snug text-white transition-colors group-hover:text-[#f5c542]">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {item.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}