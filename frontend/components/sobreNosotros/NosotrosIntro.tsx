import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imagen de relleno: reemplázala por una foto de evento o activación BTL
const IMAGEN = "/images/nova-btl/complementarios.jpg";

export default function NosotrosIntro() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbfc] to-[#f2f5f7] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1150px] grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Textos */}
        <Reveal>
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c47f0a]">
            <span className="h-px w-8 bg-[#c47f0a]" aria-hidden="true" />
            Quiénes somos
          </span>
          <h2 className="mt-4 font-krona text-3xl leading-tight text-[#192a3d]! md:text-4xl">
            EN MIRANDA MAGIC
            <span className="block text-[#c47f0a]">MIRROR</span>
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed md:text-lg">
            <p>
              creemos que los mejores eventos son aquellos que se viven, se comparten y permanecen en la memoria. Por eso, llevamos a cada celebración una experiencia interactiva que combina entretenimiento, tecnología, creatividad y diversión.Creamos experiencias fotográficas de cuerpo entero que invitan a tus invitados a interactuar con la
              pantalla, posar y capturar momentos únicos.
            </p>
            <p>
              Nuestro propósito es transformar momentos especiales en recuerdos únicos, ofreciendo a los anfitriones y sus invitados una forma diferente de disfrutar, sonreír y conectar.En activaciones de marca y eventos corporativos, llevamos la identidad de tu empresa a cada foto para
              que tu público se lleve un recuerdo y tu marca gane visibilidad.
            </p>
          </div>
        </Reveal>

        {/* Imagen */}
        <Reveal delay={150}>
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border border-[#f5c542]/50" />
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_24px_48px_-16px_rgba(2,21,43,0.35)]">
              <Image src={IMAGEN} alt="Evento y activación BTL de Miranda" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}