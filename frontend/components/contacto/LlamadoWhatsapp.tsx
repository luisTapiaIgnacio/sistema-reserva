import Reveal from "@/components/Reveal";
import { CONTACTO } from "./datos-contacto";

// Banner "¿Listo para crear una experiencia inolvidable?" (reutilizable en cualquier página)
export default function LlamadoWhatsapp() {
  const link = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(
    "Hola Miranda Magic Mirror, quiero información para mi evento."
  )}`;

  return (
    <section className="relative bg-[#02152b] px-5 pb-20 font-poppins md:pb-28">
      <Reveal>
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-6 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-[#0054ef] via-[#09217d] to-[#02152b] px-6 py-10 text-center shadow-[0_24px_48px_-16px_rgba(0,84,239,0.45)] md:flex-row md:justify-between md:px-12 md:text-left">
          {/* Destello dorado de fondo */}
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#f5c542]/20 blur-3xl" />

          <div className="relative flex flex-col items-center gap-5 md:flex-row">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-2xl text-[#f5c542]">
              <i className="fa-regular fa-calendar" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-krona text-2xl leading-snug text-white! md:text-3xl">
                ¿Listo para crear una experiencia <span className="text-[#f5c542]">inolvidable</span>?
              </h2>
              <p className="mt-2 text-sm text-white/75 md:text-base">Conversemos y hagamos realidad tu próximo evento.</p>
            </div>
          </div>

          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#f5c542] px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#02152b] transition-all duration-300 hover:scale-105 hover:bg-[#ffe9a8]"
          >
            Escríbenos por WhatsApp
            <i className="fa-brands fa-whatsapp text-base" aria-hidden="true" />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
