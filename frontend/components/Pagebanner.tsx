import Link from "next/link";

type PageBannerProps = {
  titulo: string;
  destacado?: string; // parte del título en dorado (opcional)
  ruta: string; // texto de la página actual en la ruta (ej. "Servicios")
};

export default function PageBanner({ titulo, destacado, ruta }: PageBannerProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#02152b] px-5 py-20 md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      {/* Línea dorada inferior */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#f5c542]/50 to-transparent" />

      <div className="animate-hero-reveal relative z-10 mx-auto max-w-[1290px] text-center">
        {/* Ruta: Inicio / Servicios */}
        <nav
          aria-label="Ruta de navegación"
          className="mb-5 flex items-center justify-center gap-2 font-poppins text-sm tracking-wide text-white/60"
        >
          <Link href="/" className="transition-colors hover:text-[#f5c542]">
            Inicio
          </Link>
          <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
          <span className="font-semibold text-[#f5c542]">{ruta}</span>
        </nav>

        <h1 className="mx-auto max-w-4xl font-krona text-3xl uppercase leading-tight tracking-wide text-white! md:text-5xl">
          {titulo}
          {destacado && (
            <>
              {" "}
              <span className="text-[#f5c542]">{destacado}</span>
            </>
          )}
        </h1>
      </div>
    </section>
  );
}