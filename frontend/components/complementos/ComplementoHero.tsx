import Image from "next/image";
import Link from "next/link";
import type { Complemento } from "@/lib/Complementos";

const WHATSAPP = "51913956853";

export default function ComplementoHero({ complemento }: { complemento: Complemento }) {
  const { titulo, descripcion, imagen } = complemento;

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola, deseo cotizar el servicio "${titulo}" para mi evento`
  )}`;

  return (
    <section className="relative overflow-hidden bg-[#02152b] font-poppins text-white">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#0054ef]/15 blur-3xl" />

      {/* Imagen a la derecha (en escritorio) con degradado hacia el texto */}
      <div className="relative h-[320px] w-full sm:h-[420px] lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:w-[55%]">
        <Image
          src={imagen}
          alt={titulo}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
        {/* Degradado: abajo en celular, a la izquierda en escritorio */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#02152b] via-[#02152b]/30 to-transparent lg:bg-gradient-to-r lg:from-[#02152b] lg:via-[#02152b]/40" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 mx-auto flex max-w-[1290px] px-5 pb-20 lg:min-h-[640px] lg:items-center lg:py-24">
        <div className="animate-hero-reveal -mt-16 max-w-xl lg:mt-0">
          {/* Ruta: Inicio » Complementos » Servicio */}
          <nav
            aria-label="Ruta de navegación"
            className="flex flex-wrap items-center gap-2 text-sm text-white/70"
          >
            <Link href="/" className="transition-colors hover:text-[#f5c542]">
              Inicio
            </Link>
            <span className="text-[#f5c542]" aria-hidden="true">»</span>
                        <Link
              href="/complementa_evento"
              className="transition-colors hover:text-[#f5c542]"
            >
              Complementos
            </Link>
            <span className="text-[#f5c542]" aria-hidden="true">»</span>
            <span className="font-semibold text-[#f5c542]">{titulo}</span>
          </nav>

          <h1 className="mt-6 font-krona text-4xl uppercase leading-tight tracking-wide text-white! md:text-5xl lg:text-6xl">
            {titulo}
          </h1>

          <p className="mt-6 text-base leading-relaxed text-white/80 md:text-lg">
            {descripcion}
          </p>

          {/* Línea dorada */}
          <span className="mt-8 block h-0.5 w-24 bg-[#f5c542]" aria-hidden="true" />

          {/* Botones */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex items-center gap-3 rounded-full
                bg-[#f5c542] px-7 py-3.5 font-semibold text-[#02152b]
                shadow-lg shadow-[#f5c542]/25
                transition-all duration-300
                hover:scale-105 hover:bg-[#ffe9a8]
              "
            >
              Solicitar cotización
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>

            <Link
              href="/portafolio"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#f5c542]"
            >
              <i className="fa-solid fa-camera" aria-hidden="true" />
              Ver fotos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}