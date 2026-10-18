import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Imagen de relleno: reemplázala por una foto del equipo de Miranda
const IMAGEN = "/images/nova-btl/espejo-ft.jpg";

const VALORES = [
  { icon: "fa-solid fa-award", texto: "Experiencia" },
  { icon: "fa-regular fa-square-check", texto: "Profesionalismo" },
  { icon: "fa-regular fa-lightbulb", texto: "Creatividad" },
  { icon: "fa-solid fa-user-group", texto: "Cercanía con el cliente" },
];

export default function NosotrosExperiencia() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbfc] to-[#f2f5f7] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <Reveal>
          <h2 className="text-center font-krona text-2xl uppercase leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
            Experiencia que respalda <span className="text-[#c47f0a]">cada evento</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Textos */}
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed md:text-lg">
              <p>
                <strong className="text-[#192a3d]">Miranda Magic Mirror</strong> nace con la idea de convertir cada
                celebración en un recuerdo inolvidable. Desde Lima llevamos espejos mágicos y experiencias
                fotográficas a matrimonios, quinceañeros, cumpleaños y eventos corporativos.
              </p>
              <p>
                Nuestro equipo cuida cada detalle, desde el montaje hasta la entrega de las fotos, para que tú solo
                te preocupes por disfrutar y tus invitados se lleven un recuerdo único.
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {VALORES.map((v) => (
                <li key={v.texto} className="group flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff3cf] text-[#c47f0a] transition-colors duration-300 group-hover:bg-[#f5c542] group-hover:text-[#02152b]">
                    <i className={v.icon} aria-hidden="true" />
                  </span>
                  <span className="font-medium text-[#192a3d]">{v.texto}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Imagen */}
          <Reveal delay={150}>
            <div className="relative mx-auto max-w-md">
              <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border border-[#f5c542]/50" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_24px_48px_-16px_rgba(2,21,43,0.35)]">
                <Image
                  src={IMAGEN}
                  alt="Equipo de Miranda Magic Mirror"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
