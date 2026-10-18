"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { COMPLEMENTOS } from "@/lib/Complementos";

// 👇 Ruta base de las páginas de complementos (igual al nombre de tu carpeta)
const BASE = "/complementa_evento";
const POR_PAGINA = 8; // 2 filas de 4 en escritorio

export default function OtrosComplementos({ slugActual }: { slugActual: string }) {
  // Todos los complementos menos el que se está viendo
  const otros = COMPLEMENTOS.filter((c) => c.slug !== slugActual);

  const totalPaginas = Math.ceil(otros.length / POR_PAGINA);
  const [pagina, setPagina] = useState(0);

  const visibles = otros.slice(pagina * POR_PAGINA, pagina * POR_PAGINA + POR_PAGINA);

  return (
    <section className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins text-white md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1290px]">
        {/* Título + flechas */}
        <Reveal>
          <div className="flex items-end justify-between gap-6">
            <h2 className="max-w-xl font-krona text-2xl leading-tight tracking-wide text-white! md:text-4xl">
              Otros <span className="text-[#f5c542]">complementos</span> que pueden
              interesarte
            </h2>

            {totalPaginas > 1 && (
              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 0}
                  aria-label="Anteriores"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#f5c542] hover:bg-[#f5c542] hover:text-[#02152b] disabled:pointer-events-none disabled:opacity-30"
                >
                  <i className="fa-solid fa-chevron-left" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas - 1}
                  aria-label="Siguientes"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-all hover:border-[#f5c542] hover:bg-[#f5c542] hover:text-[#02152b] disabled:pointer-events-none disabled:opacity-30"
                >
                  <i className="fa-solid fa-chevron-right" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </Reveal>

        {/* Tarjetas */}
        <div
          key={pagina}
          className="animate-hero-reveal mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {visibles.map((c) => (
            <Link
              key={c.slug}
              href={`${BASE}/${c.slug}`}
              className="
                group flex flex-col overflow-hidden rounded-2xl bg-white text-[#3a4f66]
                shadow-[0_16px_32px_-12px_rgba(0,0,0,0.5)]
                transition-all duration-300
                hover:-translate-y-1.5 hover:shadow-[0_24px_40px_-12px_rgba(245,197,66,0.35)]
              "
            >
              <div className="relative h-[180px] w-full overflow-hidden">
                <Image
                  src={c.imagen}
                  alt={c.titulo}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-bold leading-snug text-[#192a3d]">
                  {c.titulo}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed">
                  {c.descripcion}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c47f0a] transition-all duration-300 group-hover:gap-3">
                  Ver más
                  <i className="fa-solid fa-arrow-right text-xs" aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Botón */}
        <div className="mt-12 text-center">
          <Link
            href="/servicios"
            className="
              inline-flex items-center gap-2 rounded-full
              bg-[#f5c542] px-8 py-3.5 text-sm font-semibold text-[#02152b]
              shadow-lg shadow-[#f5c542]/25
              transition-all duration-300
              hover:scale-105 hover:bg-[#ffe9a8]
            "
          >
            Todos nuestros servicios
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>


                {/* Llamado a la acción */}
        <Reveal>
          <div
            className="
              mt-16 flex flex-col items-center gap-6 rounded-3xl
              border border-white/15
              bg-gradient-to-r from-[#0054ef] via-[#09217d] to-[#02152b]
              px-6 py-8 text-center
              shadow-[0_24px_48px_-16px_rgba(0,84,239,0.45)]
              md:flex-row md:justify-between md:px-10 md:text-left
            "
          >
            <div className="flex flex-col items-center gap-5 md:flex-row">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-xl text-[#f5c542]">
                <i className="fa-regular fa-calendar" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-krona text-xl leading-snug text-white! md:text-2xl">
                  ¿Listo para crear una experiencia{" "}
                  <span className="text-[#f5c542]">inolvidable</span>?
                </h3>
                <p className="mt-2 text-sm text-white/75">
                  Conversemos y hagamos realidad tu próximo evento.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/51913956853?text=${encodeURIComponent(
                "Hola Miranda Magic Mirror, quiero información para mi evento."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex shrink-0 items-center gap-2 rounded-xl
                bg-[#f5c542] px-6 py-3.5
                text-xs font-bold uppercase tracking-wider text-[#02152b]
                transition-all duration-300
                hover:scale-105 hover:bg-[#ffe9a8]
              "
            >
              Escríbenos por WhatsApp
              <i className="fa-brands fa-whatsapp text-base" aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>


      
    </section>
  );
}