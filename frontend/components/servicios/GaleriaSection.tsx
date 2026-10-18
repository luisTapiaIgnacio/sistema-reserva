"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Reveal from "@/components/Reveal";

/*
 * ⚠️ NOTA INTERNA:
 * Estas imágenes son de referencia. Antes del lanzamiento deben
 * reemplazarse por fotografías reales de MIRANDA MAGIC MIRROR
 * (propias o con autorización de uso).
 */
const FOTOS = [
  {
    src: "/images/nova-btl/celebra/bodas.jpg",
    alt: "Novios posando frente al espejo mágico en su boda",
    titulo: "Bodas",
    texto: "Elegancia y emoción en cada toma.",
  },
  {
    src: "/images/nova-btl/celebra/quinceaños.jpg",
    alt: "Quinceañera con sus invitados en el espejo mágico",
    titulo: "Quinceañeros",
    texto: "Una noche única que merece recordarse.",
  },
  {
    src: "/images/nova-btl/celebra/corp.jpg",
    alt: "Equipo de trabajo en un evento corporativo",
    titulo: "Eventos corporativos",
    texto: "Tu marca presente en cada fotografía.",
  },
  {
    src: "/images/nova-btl/celebra/cumple.jpg",
    alt: "Grupo de amigos con accesorios divertidos",
    titulo: "Grupos de amigos",
    texto: "Risas, poses y diversión sin límites.",
  },
  {
    src: "/images/nova-btl/celebra/graduacion.jpg",
    alt: "Graduados celebrando frente al espejo mágico",
    titulo: "Graduaciones",
    texto: "El recuerdo de un gran logro.",
  },
  {
    src: "/images/nova-btl/celebra/bautizos.jpg",
    alt: "Familia reunida en una celebración",
    titulo: "Celebraciones familiares",
    texto: "Momentos en familia para siempre.",
  },
];

export default function GaleriaSection() {
  // Índice de la foto abierta (null = galería cerrada)
  const [abierta, setAbierta] = useState<number | null>(null);

  const cerrar = useCallback(() => setAbierta(null), []);

  const anterior = useCallback(() => {
    setAbierta((i) => (i === null ? i : (i - 1 + FOTOS.length) % FOTOS.length));
  }, []);

  const siguiente = useCallback(() => {
    setAbierta((i) => (i === null ? i : (i + 1) % FOTOS.length));
  }, []);

  // Teclado (Esc, ←, →) y bloqueo del scroll mientras está abierta
  useEffect(() => {
    if (abierta === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar();
      if (e.key === "ArrowLeft") anterior();
      if (e.key === "ArrowRight") siguiente();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [abierta, cerrar, anterior, siguiente]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#fafbfc] to-[#f2f5f7] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1290px]">
        {/* Encabezado */}
        <Reveal>
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#c47f0a]">
              <span className="h-px w-8 bg-[#c47f0a]" aria-hidden="true" />
              Galería
            </span>

            <h2 className="mt-4 font-krona text-3xl uppercase leading-tight tracking-wide text-[#192a3d]! md:text-4xl">
              Galería de{" "}
              <span className="bg-gradient-to-r from-[#09217d] via-[#0054ef] to-[#c47f0a] bg-clip-text text-transparent">
                experiencias
              </span>
            </h2>

            <p className="mt-5 text-base leading-relaxed md:text-lg">
              Elegancia, diversión y recuerdos reflejados en cada toma.
            </p>
          </div>
        </Reveal>

        {/* Grilla de 6 fotos: 1 col móvil, 2 tablet, 3 escritorio */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FOTOS.map((foto, i) => (
            <Reveal key={foto.src} delay={(i % 3) * 150}>
              <button
                type="button"
                onClick={() => setAbierta(i)}
                aria-label={`Ver foto ampliada: ${foto.alt}`}
                className="
                  group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl
                  border border-[#02152b]/[0.08]
                  shadow-[0_12px_30px_-10px_rgba(2,21,43,0.2)]
                  transition-all duration-500
                  hover:-translate-y-1 hover:border-[#f5c542]
                  hover:shadow-[0_24px_40px_-12px_rgba(245,197,66,0.35)]
                "
              >
                <Image
                  src={foto.src}
                  alt={foto.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Capa al pasar el mouse */}
                <span className="absolute inset-0 flex items-center justify-center bg-[#02152b]/0 transition-colors duration-300 group-hover:bg-[#02152b]/45">
                  <span className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-[#f5c542] text-xl text-[#02152b] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    <i className="fa-solid fa-magnifying-glass-plus" aria-hidden="true" />
                  </span>
                </span>

                {/* Título y texto de la foto */}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#02152b]/90 via-[#02152b]/50 to-transparent px-5 pb-4 pt-12 text-left">
                  <span className="block text-base font-bold uppercase tracking-wide text-white">
                    {foto.titulo}
                  </span>
                  <span className="mt-2 block h-0.5 w-10 bg-[#f5c542]" aria-hidden="true" />
                  <span className="mt-2 block text-sm text-white/80">
                    {foto.texto}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* =========================================
          VISOR (lightbox)
      ========================================= */}
      {abierta !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Galería ampliada"
          onClick={cerrar}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#02152b]/95 p-4 backdrop-blur-sm"
        >
          {/* Cerrar */}
          <button
            type="button"
            onClick={cerrar}
            aria-label="Cerrar galería"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-xl text-white transition-colors hover:border-[#f5c542] hover:text-[#f5c542]"
          >
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>

          {/* Anterior */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              anterior();
            }}
            aria-label="Foto anterior"
            className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-all hover:bg-[#f5c542] hover:text-[#02152b] md:left-6"
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          {/* Imagen grande (el clic aquí no cierra) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative h-[65vh] w-full max-w-5xl"
          >
            <Image
              key={FOTOS[abierta].src}
              src={FOTOS[abierta].src}
              alt={FOTOS[abierta].alt}
              fill
              sizes="100vw"
              className="animate-hero-reveal rounded-xl object-contain"
              priority
            />
          </div>

          {/* Siguiente */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              siguiente();
            }}
            aria-label="Foto siguiente"
            className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-xl text-white transition-all hover:bg-[#f5c542] hover:text-[#02152b] md:right-6"
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>

          {/* Título, texto y contador */}
          <div className="absolute bottom-5 left-1/2 w-[90%] max-w-xl -translate-x-1/2 text-center">
            <p className="text-lg font-bold uppercase tracking-wide text-white">
              {FOTOS[abierta].titulo}
            </p>
            <p className="mt-1 text-sm text-white/75">{FOTOS[abierta].texto}</p>
            <p className="mt-3 inline-block rounded-full bg-white/10 px-4 py-1 text-xs text-white">
              {abierta + 1} / {FOTOS.length}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

