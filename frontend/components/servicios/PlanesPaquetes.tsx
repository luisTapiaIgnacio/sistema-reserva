import Image from "next/image";
import Reveal from "@/components/Reveal";

const WHATSAPP = "51913956853";

const wa = (plan: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola, deseo cotizar el paquete ${plan} de Miranda Magic Mirror para mi evento`
  )}`;

// 👇 Imágenes de relleno, precios y contenido: actualízalos con la información real
const PLANES = [
  {
    nombre: "Magic Experience 2H",
    etiqueta: "Paquete esencial",
    horas: "2 horas de servicio",
    precio: "S/ 1,000",
    ideal: "Ideal para cumpleaños, reuniones y celebraciones íntimas.",
    img: "/images/nova-btl/celebra/magicEx.jpg",
    destacado: false,
    incluye: [
      "Alquiler de espejo mágico interactivo.",
      "Fotografías durante las 2 horas contratadas.",
      "Marcos fotográficos personalizados.",
      "Accesorios, cotillón y props.",
      "Alfombra roja y balaustres.",
      "Iluminación LED.",
      "Personal de asistencia.",
      "Instalación y desmontaje.",
    ],
  },
  {
    nombre: "Magic Premium 3H",
    etiqueta: "Experiencia ampliada",
    horas: "3 horas de servicio",
    precio: "S/ 1,250",
    ideal: "Ideal para bodas, quinceañeros y graduaciones.",
    img: "/images/nova-btl/celebra/magicPremi.jpg",
    destacado: true,
    incluye: [
      "Todo lo incluido en Magic Experience 2H.",
      "Una hora adicional de fotografías.",
      "Diseño personalizado de marcos según la temática.",
      "Mayor tiempo para que todos los invitados participen.",
      "Coordinación previa de la ambientación.",
    ],
  },
  {
    nombre: "Magic Luxury 4H",
    etiqueta: "Experiencia completa",
    horas: "4 horas de servicio",
    precio: "S/ 1,500",
    ideal: "Para eventos grandes y celebraciones con una programación extensa.",
    img: "/images/nova-btl/celebra/magicLuxu.jpg",
    destacado: false,
    incluye: [
      "Todo lo incluido en Magic Experience 2H.",
      "Dos horas adicionales de fotografías.",
      "Marcos personalizados para el evento.",
      "Accesorios y cotillón para los invitados.",
      "Coordinación especial del espacio fotográfico.",
      "Asistencia durante todo el servicio contratado.",
    ],
  },
];

export default function PlanesPaquetes() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbfc] to-[#f2f5f7] px-5 py-20 font-poppins text-[#3a4f66] md:py-18">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1290px]">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c47f0a]">
              <span className="h-px w-8 bg-[#c47f0a]" aria-hidden="true" />
              Planes y paquetes
            </span>

            <h2 className="mt-4 font-krona text-3xl uppercase leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
              Elige tu{" "}
              <span className="bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text text-transparent">
                experiencia
              </span>
            </h2>

            <p className="mt-5 text-base leading-relaxed md:text-lg">
              Elige el paquete que mejor se adapte a tu evento. Todos los planes
              se coordinan previamente de acuerdo con la fecha, ubicación y
              necesidades de la celebración.
            </p>
          </div>
        </Reveal>

        {/* Planes */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3">
          {PLANES.map((plan, i) => (
            <Reveal key={plan.nombre} delay={i * 150} className="h-full">
              <article
                className={`
                  group relative flex h-full flex-col rounded-3xl bg-white
                  transition-all duration-500 hover:-translate-y-2
                  ${
                    plan.destacado
                      ? "border-2 border-[#f5c542] shadow-[0_24px_48px_-12px_rgba(245,197,66,0.35)] lg:-mt-4 lg:mb-4"
                      : "border border-[#02152b]/[0.08] shadow-[0_12px_30px_-10px_rgba(2,21,43,0.15)] hover:border-[#f5c542]/60 hover:shadow-[0_24px_40px_-12px_rgba(245,197,66,0.3)]"
                  }
                `}
              >
                {/* Etiqueta "Más solicitado" */}
                {plan.destacado && (
                  <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-[#02152b] to-[#09217d] px-5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#f5c542] shadow-lg">
                    <i className="fa-solid fa-crown mr-2" aria-hidden="true" />
                    Más solicitado
                  </span>
                )}

                {/* Imagen */}
                <div className="relative m-3 mb-0 h-[220px] overflow-hidden rounded-2xl">
                  <Image
                    src={plan.img}
                    alt={plan.nombre}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Contenido */}
                <div className="flex flex-1 flex-col p-6 pt-6 md:p-8 md:pt-6">
                  <h3 className="text-xl font-bold text-[#192a3d] md:text-2xl">
                    {plan.nombre}
                  </h3>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#e3ecff] px-3 py-1 text-xs font-semibold text-[#09217d]">
                      {plan.etiqueta}
                    </span>
                    <span className="rounded-full bg-[#fff3cf] px-3 py-1 text-xs font-semibold text-[#c47f0a]">
                      <i className="fa-regular fa-clock mr-1" aria-hidden="true" />
                      {plan.horas}
                    </span>
                  </div>

                  <p className="mt-5 font-krona text-3xl text-[#02152b]">
                    {plan.precio}
                  </p>

                  <p className="mt-2 text-[15px] leading-relaxed">{plan.ideal}</p>

                  <ul className="mt-6 flex-1 space-y-3 border-t border-slate-200/80 pt-6">
                    {plan.incluye.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm">
                        <i
                          className="fa-solid fa-circle-check mt-0.5 text-[#0054ef]"
                          aria-hidden="true"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={wa(plan.nombre)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      mt-8 inline-flex items-center justify-center gap-2 rounded-full
                      px-6 py-3.5 text-sm font-semibold
                      transition-all duration-300 hover:gap-3 hover:scale-[1.02]
                      ${
                        plan.destacado
                          ? "bg-[#f5c542] text-[#02152b] shadow-lg shadow-[#f5c542]/30 hover:bg-[#ffe9a8]"
                          : "bg-gradient-to-r from-[#02152b] via-[#09217d] to-[#0054ef] text-white shadow-lg shadow-[#02152b]/20"
                      }
                    `}
                  >
                    Cotizar paquete
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Nota importante */}
        <Reveal>
          <div className="mt-12 flex items-start gap-4 rounded-2xl border border-[#0054ef]/15 bg-[#e3ecff]/60 p-5 md:items-center md:p-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0054ef] text-white">
              <i className="fa-solid fa-info" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed">
              <strong className="text-[#02152b]">Importante:</strong> los
              precios pueden variar según la fecha, la ubicación y los
              requerimientos del evento. Los elementos incluidos están sujetos a
              disponibilidad y a las condiciones de la cotización.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}