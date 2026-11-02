import Image from "next/image";
import Reveal from "@/components/Reveal";

const WHATSAPP = "51913956853";

const wa = (plan: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
    `Hola, deseo cotizar el paquete ${plan} de Miranda Magic Mirror para mi evento`
  )}`;

// 👇 Las imágenes de Premium y VIP Diamond son de relleno: cámbialas por fotos reales
const PLANES = [
  {
    nombre: "Paquete Silver",
    icono: "fa-star",
    horas: "2 horas",
    precio: "S/ 1,000",
    img: "/images/nova-btl/celebra/magicEx.jpg",
    destacado: false,
    incluye: [
      "Espejo Mágico interactivo de 65 pulgadas.",
      "Fotografías impresas.",
      "Accesorios divertidos.",
      "Marcos fotográficos personalizados.",
      "Atención durante el servicio contratado.",
    ],
  },
  {
    nombre: "Paquete Gold",
    icono: "fa-gem",
    horas: "3 horas",
    precio: "S/ 1,350",
    img: "/images/nova-btl/celebra/magicPremi.jpg",
    destacado: true,
    incluye: [
      "Espejo Mágico interactivo de 65 pulgadas.",
      "Fotografías impresas.",
      "Accesorios para los invitados.",
      "Marcos personalizados.",
      "Experiencia fotográfica interactiva.",
    ],
  },
  {
    nombre: "Paquete Platinum",
    icono: "fa-crown",
    horas: "4 horas",
    precio: "S/ 1,700",
    img: "/images/nova-btl/celebra/magicLuxu.jpg",
    destacado: false,
    incluye: [
      "Espejo Mágico interactivo de 65 pulgadas.",
      "Fotografías impresas.",
      "Accesorios para fotografías.",
      "Diseños personalizados.",
      "Experiencia interactiva con GIF, según disponibilidad.",
    ],
  },
  {
    nombre: "Paquete Premium",
    icono: "fa-wand-magic-sparkles",
    horas: "5 horas",
    precio: "S/ 2,000",
    img: "/images/nova-btl/celebra/esp_magico.jpg",
    destacado: false,
    incluye: [
      "Espejo Mágico interactivo de 65 pulgadas.",
      "Fotografías impresas.",
      "Accesorios divertidos.",
      "Marcos personalizados con la temática del evento.",
      "Experiencia interactiva con GIF, según disponibilidad.",
      "Servicio durante cinco horas.",
    ],
  },
  {
    nombre: "Paquete VIP Diamond",
    icono: "fa-heart",
    horas: "6 horas",
    precio: "S/ 2,400",
    img: "/images/nova-btl/celebra/matrimo.jpg",
    destacado: false,
    incluye: [
      "Espejo Mágico interactivo de 65 pulgadas.",
      "Fotografías impresas.",
      "Accesorios para todos los invitados.",
      "Diseños personalizados exclusivos.",
      "Experiencia interactiva con GIF, según disponibilidad.",
      "Seis horas de entretenimiento fotográfico.",
      "Atención personalizada para tu evento.",
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
        {/* 5 tarjetas centradas: 1 por fila en móvil, 2 en tablet (2+2+1), 3 en escritorio (3+2) */}
        <div className="flex flex-wrap items-stretch justify-center gap-8">
          {PLANES.map((plan, i) => (
            <Reveal
              key={plan.nombre}
              delay={(i % 3) * 150}
              className="w-full max-w-md md:w-[calc((100%-2rem)/2)] md:max-w-none lg:w-[calc((100%-4rem)/3)]"
            >
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
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                      <i className={`fa-solid ${plan.icono} mr-1`} aria-hidden="true" />
                      Paquete {i + 1}
                    </span>
                    <span className="rounded-full bg-[#fff3cf] px-3 py-1 text-xs font-semibold text-[#c47f0a]">
                      <i className="fa-regular fa-clock mr-1" aria-hidden="true" />
                      {plan.horas}
                    </span>
                  </div>

                  <p className="mt-5 font-krona text-3xl text-[#02152b]">
                    {plan.precio}
                  </p>

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

        {/* Llamado a la acción (solo texto) */}
        <Reveal>
          <div className="mx-auto mt-16 max-w-3xl text-center">
            <h3 className="font-krona text-2xl uppercase leading-tight tracking-wide text-[#192a3d]! sm:text-3xl md:text-4xl">
              ¡Haz que tu evento sea{" "}
              <span className="bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text text-transparent">
                inolvidable
              </span>
              !
            </h3>

            <p className="mt-6 text-base leading-relaxed sm:text-lg">
              Servicio en Lima Metropolitana y otras ciudades del Perú, previa
              coordinación.
            </p>
            <p className="mt-2 text-base font-semibold text-[#02152b] sm:text-lg">
              Solicita tu cotización y reserva tu fecha.
            </p>

            <p className="mt-10 font-krona text-lg uppercase tracking-[0.2em] text-[#c47f0a] md:text-xl">
              Miranda Magic Mirror
            </p>
            <p className="mt-2 text-sm italic md:text-base">
              Momentos únicos, recuerdos para siempre.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}