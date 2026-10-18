import Image from "next/image";
import Reveal from "@/components/Reveal";

const PORTAFOLIO = [
  { img: "/images/nova-btl/celebra/port-1.jpg", titulo: "Fiesta fin de año Ferrenergy", desc: "Un cierre de año para conectar y celebrar.", href: "/portafolio/fiesta-fin-de-ano-ferrenergy" },
  { img: "/images/nova-btl/celebra/port-2.jpg", titulo: "Woman Tech Yape", desc: "Un espacio para visibilizar y potenciar mujeres en tech.", href: "/portafolio/celebra/port-3.jpg" },
  { img: "/images/nova-btl/celebra/port-5.jpg", titulo: "Navidad Ferrenergy", desc: "Celebramos juntos el espíritu de la Navidad.", href: "/portafolio/navidad-ferrenergy" },
  { img: "/images/nova-btl/celebra/port-4.jpg", titulo: "Ferias Yape", desc: "Activaciones que impulsan visibilidad y engagement.", href: "/portafolio/ferias-yape" },
];

export default function ExperienciaSection() {
  return (
    <section className="relative overflow-hidden bg-[#160a22] py-[100px] text-white">
      {/* Imagen de fondo (bokeh morado). Se ajusta al ancho de la sección en vez de recortarse (bg-cover la hacía verse muy "zoom"). */}
      <div className="absolute inset-0 bg-top bg-no-repeat bg-[length:100%_auto] bg-[url('/images/nova-btl/bg-experiencia.png')]" />

      {/* Oscurece un poco la imagen para que el texto blanco siempre se lea bien */}
      <div className="absolute inset-0 bg-[#160a22]/60" />

      <div className="relative mx-auto max-w-[1290px] px-5">
        {/* Header en dos columnas: título a la izquierda, descripción a la derecha */}
        <Reveal>
          <div className="flex flex-col gap-8 text-left md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-3xl leading-tight font-bold tracking-wide text-white uppercase md:text-5xl">
                Nuestra experiencia
              </h2>
              <p className="mt-2 text-sm font-semibold tracking-wide text-white/80 uppercase md:text-base">
                Momentos que merecen ser recordados
              </p>
            </div>
            <p className="text-base leading-relaxed text-white/70 md:max-w-[560px] md:text-right md:text-lg">
              Cada evento es diferente y cada fotografía cuenta una historia. En nuestra
              galería podrás descubrir cómo MIRANDA MAGIC MIRROR forma parte de
              celebraciones especiales, creando espacios de entretenimiento y recuerdos
              para compartir.
            </p>
          </div>
        </Reveal>

        {/* Grilla de 2 columnas con tarjetas grandes */}
        <div className="mt-10 grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-y-[89px] sm:gap-x-[111px]">
          {PORTAFOLIO.map((item, i) => (
            // Cada tarjeta entra en cascada dentro de su fila
            <Reveal key={item.titulo} delay={(i % 2) * 150}>
              <a
                href={item.href}
                className="group relative block aspect-[3/4] cursor-pointer overflow-hidden rounded-xl border border-white/10"
              >
                <Image
                  src={item.img}
                  alt={item.titulo}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                {/* Capa negra de transparencia + texto, pegada abajo */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-5 pt-10 pb-4">
                  <h3 className="text-sm font-bold text-white uppercase">{item.titulo}</h3>
                  <hr className="my-2 w-10 border-t-2 border-pink" />
                  <p className="text-xs text-white/80">{item.desc}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center">
            <a
              href="/portafolio"
              className="inline-block rounded-full bg-pink px-7 py-2.5 text-[15px] font-semibold text-white transition-all hover:scale-105 hover:bg-pink/85"
            >
              Ver portafolio
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}