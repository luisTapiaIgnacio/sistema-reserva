"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";

// 👇 Categorías (pestañas). "Todos" se agrega solo.
const CATEGORIAS = ["Matrimonios", "Quinceañeros", "Corporativos", "Cumpleaños", "Graduaciones"];

// 👇 Fotos de RELLENO: reemplaza src, alt y categoria por las reales
const IMGS = [
  "/images/nova-btl/complementarios.jpg",
  "/images/nova-btl/complementarios-2.jpg",
  "/images/nova-btl/complementarios-3.jpg",
  "/images/nova-btl/complementarios-4.jpg",
  "/images/nova-btl/complementarios-5.jpg",
  "/images/nova-btl/complementarios-6.jpg",
];
const FOTOS = Array.from({ length: 30 }, (_, i) => ({
  src: IMGS[i % IMGS.length],
  alt: `Evento Miranda Magic Mirror ${i + 1}`,
  categoria: CATEGORIAS[i % CATEGORIAS.length],
}));

const POR_PAGINA = 9;

export default function PortafolioGaleria() {
  const [filtro, setFiltro] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [abierta, setAbierta] = useState<number | null>(null); // índice dentro de "filtradas"

  const filtradas = filtro === "Todos" ? FOTOS : FOTOS.filter((f) => f.categoria === filtro);
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA));
  const inicio = (pagina - 1) * POR_PAGINA;
  const visibles = filtradas.slice(inicio, inicio + POR_PAGINA);

  function cambiarFiltro(c: string) {
    setFiltro(c);
    setPagina(1);
  }

  function irAPagina(n: number) {
    setPagina(n);
    document.getElementById("portafolio")?.scrollIntoView({ behavior: "smooth" });
  }

  // Teclado en el visor: ← → para navegar, Esc para cerrar
  useEffect(() => {
    if (abierta === null) return;
    const total = filtradas.length;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(null);
      if (e.key === "ArrowRight") setAbierta((i) => (i === null ? i : (i + 1) % total));
      if (e.key === "ArrowLeft") setAbierta((i) => (i === null ? i : (i - 1 + total) % total));
    };
    window.addEventListener("keydown", tecla);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tecla);
      document.body.style.overflow = "";
    };
  }, [abierta, filtradas.length]);

  const foto = abierta !== null ? filtradas[abierta] : null;

  return (
    <section id="portafolio" className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins md:py-28">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-96 w-96 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1100px]">
        {/* Pestañas */}
        <Reveal>
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:px-0">
            {["Todos", ...CATEGORIAS].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => cambiarFiltro(c)}
                className={`shrink-0 cursor-pointer rounded-full border px-5 py-2 text-sm transition-all duration-300 ${
                  filtro === c
                    ? "border-[#f5c542] bg-[#f5c542] font-semibold text-[#02152b]"
                    : "border-white/15 text-white/70 hover:border-[#f5c542]/60 hover:text-white"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cuadrícula */}
        <div key={`${filtro}-${pagina}`} className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {visibles.map((f, i) => (
            <Reveal key={`${f.src}-${inicio + i}`} delay={(i % 3) * 100}>
              <button
                type="button"
                onClick={() => setAbierta(inicio + i)}
                aria-label={`Ver foto: ${f.alt}`}
                className="group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10"
              >
                <Image
                  src={f.src}
                  alt={f.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                {/* Capa al pasar el mouse */}
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#02152b]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <i className="fa-solid fa-magnifying-glass-plus text-2xl text-[#f5c542]" aria-hidden="true" />
                  <span className="text-xs font-medium uppercase tracking-wider text-white">{f.categoria}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <nav aria-label="Páginas del portafolio" className="mt-12 flex justify-center">
            <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1">
              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => irAPagina(n)}
                  aria-current={n === pagina ? "page" : undefined}
                  className={`h-9 w-9 cursor-pointer rounded-full text-sm transition-colors ${
                    n === pagina ? "bg-[#f5c542] font-semibold text-[#02152b]" : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>

      {/* Visor (lightbox) */}
      {foto && abierta !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={foto.alt}
          onClick={() => setAbierta(null)}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#02152b]/95 p-4 backdrop-blur"
        >
          <button
            type="button"
            aria-label="Cerrar"
            onClick={() => setAbierta(null)}
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <i className="fa-solid fa-xmark text-lg" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Anterior"
            onClick={(e) => {
              e.stopPropagation();
              setAbierta((abierta - 1 + filtradas.length) % filtradas.length);
            }}
            className="absolute left-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#f5c542] hover:text-[#02152b] md:left-6"
          >
            <i className="fa-solid fa-chevron-left" aria-hidden="true" />
          </button>

          <figure onClick={(e) => e.stopPropagation()} className="relative h-[75vh] w-full max-w-4xl">
            <Image src={foto.src} alt={foto.alt} fill sizes="90vw" className="rounded-2xl object-contain" />
            <figcaption className="absolute -bottom-10 left-0 right-0 text-center text-sm text-white/70">
              {foto.categoria} · {abierta + 1} / {filtradas.length}
            </figcaption>
          </figure>

          <button
            type="button"
            aria-label="Siguiente"
            onClick={(e) => {
              e.stopPropagation();
              setAbierta((abierta + 1) % filtradas.length);
            }}
            className="absolute right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#f5c542] hover:text-[#02152b] md:right-6"
          >
            <i className="fa-solid fa-chevron-right" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}