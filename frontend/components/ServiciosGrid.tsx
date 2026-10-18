"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import ServicioCard from "./ServicioCard";
import Reveal from "@/components/Reveal";

type Servicio = {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  whatsapp: string;
  imagen: string;
};

const SERVICIOS: Servicio[] = [
  {
    eyebrow: "CORP",
    titulo: "Eventos corporativos",
    descripcion:
      "Diseñamos y producimos eventos que fortalecen tu marca y generan experiencias memorables.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20quiero%20cotizar%20un%20evento%20corporativo%20con%20Nova%20BTL%20y%20Eventos",
    imagen: "/images/nova-btl/event.jpg",
  },
  {
    eyebrow: "SNACKS",
    titulo: "Estaciones de snacks premium",
    descripcion:
      "Carritos de snacks premium que complementan reuniones, celebraciones y experiencias memorables.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20estoy%20interesado%20en%20una%20Estacion%20de%20Snack%20Premium",
    imagen: "/images/nova-btl/estacion-snk.jpg",
  },
  {
    eyebrow: "TEAM",
    titulo: "Alquiler de espejo fotografico",
    descripcion:
      "Una experiencia interactiva de fotografía que combina tecnología, diversión y elegancia. Asistentencia, instalacion y desmontaje. ",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20quiero%20cotizar%20una%20actividad%20de%20team%20building",
    imagen: "/images/nova-btl/espejo-ft.jpg",
  },
  {
    eyebrow: "MERCH & BRAND",
    titulo: "Merchandising & Branding",
    descripcion:
      "Gestionamos productos y materiales que consolidan tu identidad de marca y potencian su reconocimiento.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20estoy%20interesado%20en%20merchandising%20y%20branding",
    imagen: "/images/nova-btl/mercha.jpg",
  },
  {
    eyebrow: "FOTO",
    titulo: "Espejo fotográfico",
    descripcion: "Recuerdos instantáneos y personalizados para tus invitados.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20quiero%20cotizar%20un%20espejo%20fotografico",
    imagen: "/images/nova-btl/serv3.png",
  },
];

const AUTOPLAY_MS = 3500;

export default function ServiciosGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Controla si el autoplay está pausado
  const pausedRef = useRef(false);

  const [current, setCurrent] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /*
   * Obtiene el espacio entre una card y la siguiente.
   *
   * Ejemplo:
   *
   * CARD 1 | gap | CARD 2
   *
   * offsetLeft CARD 2 - offsetLeft CARD 1
   */
  const getStep = useCallback(() => {
    const el = scrollRef.current;

    if (!el || el.children.length < 2) {
      return 0;
    }

    const first = el.children[0] as HTMLElement;
    const second = el.children[1] as HTMLElement;

    return second.offsetLeft - first.offsetLeft;
  }, []);

  /*
   * Mover una card
   */
  const scrollByStep = useCallback(
    (direction: 1 | -1) => {
      const el = scrollRef.current;

      if (!el) return;

      const step = getStep();

      if (!step) return;

      el.scrollBy({
        left: direction * step,
        behavior: "smooth",
      });
    },
    [getStep],
  );

  /*
   * Ir a una card específica
   */
  const scrollToIndex = useCallback(
    (index: number) => {
      const el = scrollRef.current;

      if (!el) return;

      const step = getStep();

      if (!step) return;

      el.scrollTo({
        left: index * step,
        behavior: "smooth",
      });
    },
    [getStep],
  );

  /*
   * Detectar posición actual
   */
  useEffect(() => {
    const el = scrollRef.current;

    if (!el) return;

    const onScroll = () => {
      const step = getStep();

      if (!step) return;

      const maxScroll = el.scrollWidth - el.clientWidth;

      /*
       * ¿Estamos al inicio?
       */
      setAtStart(el.scrollLeft <= 2);

      /*
       * ¿Estamos al final?
       */
      setAtEnd(el.scrollLeft >= maxScroll - 2);

      /*
       * Determinar card actual
       */
      const index = Math.round(el.scrollLeft / step);

      setCurrent(Math.min(Math.max(index, 0), SERVICIOS.length - 1));
    };

    el.addEventListener("scroll", onScroll, {
      passive: true,
    });

    window.addEventListener("resize", onScroll);

    onScroll();

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [getStep]);

  /*
   * AUTOPLAY
   *
   * 1 → 2 → 3 → 4 → 5 → 1
   */
  useEffect(() => {
    const interval = setInterval(() => {
      const el = scrollRef.current;

      if (!el) return;

      /*
       * Si el usuario está interactuando,
       * no mover.
       */
      if (pausedRef.current) return;

      const step = getStep();

      if (!step) return;

      const maxScroll = el.scrollWidth - el.clientWidth;

      /*
       * Si ya estamos prácticamente al final,
       * volvemos al inicio.
       */
      if (el.scrollLeft >= maxScroll - 5) {
        el.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        return;
      }

      /*
       * Avanzar una card
       */
      el.scrollBy({
        left: step,
        behavior: "smooth",
      });
    }, AUTOPLAY_MS);

    return () => {
      clearInterval(interval);
    };
  }, [getStep]);

  /*
   * Pausar cuando el usuario entra
   */
  const handleMouseEnter = () => {
    pausedRef.current = true;
  };

  /*
   * Continuar cuando sale
   */
  const handleMouseLeave = () => {
    pausedRef.current = false;
  };

  return (
    <section className="relative w-full overflow-hidden bg-white py-[70px]">
      {/* =========================================
          FONDO
      ========================================= */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(8,16,71,0.10) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(8,16,71,0.10) 1px,
              transparent 1px
            ),
            linear-gradient(
              to right,
              rgba(8,16,71,0.25) 2px,
              transparent 2px
            ),
            linear-gradient(
              to bottom,
              rgba(8,16,71,0.25) 2px,
              transparent 2px
            )
          `,
          backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
        }}
      />

      {/* =========================================
          CONTENEDOR
      ========================================= */}

      <div className="relative mx-auto max-w-[1290px] px-5">
        {/* TITULO */}

        <Reveal>
          <p className="mb-1 py-3 text-left font-krona text-sm font-bold uppercase text-[#3a3a3a]">
            Soluciones diseñadas para tu negocio
          </p>

          <h2 className="font-krona text-4xl uppercase text-[#180d0d] md:text-5xl">
            ¿Cómo te ayudamos?
          </h2>
        </Reveal>

        {/* =========================================
            CARRUSEL
        ========================================= */}

        <Reveal delay={150}>
          <div
            className="relative mt-10"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* =====================================
                FLECHA IZQUIERDA
            ===================================== */}

            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              aria-label="Anterior"
              disabled={atStart}
              className="
                absolute
                left-0
                top-1/2
                z-10
                hidden
                -translate-y-1/2
                rounded-full
                bg-white
                p-3
                shadow-lg
                transition
                hover:scale-110
                hover:bg-primary
                hover:text-white
                disabled:opacity-30
                md:block
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* =====================================
                TRACK
            ===================================== */}

            <div
              ref={scrollRef}
              className="
                flex
                gap-8
                overflow-x-auto
                py-4
                pb-14

                snap-x
                snap-mandatory

                scroll-smooth

                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {SERVICIOS.map((servicio, index) => (
                <div
                  key={`${servicio.titulo}-${index}`}
                  className="
                    w-[85%]
                    shrink-0
                    snap-start

                    sm:w-[45%]

                    lg:w-[calc(25%-1.5rem)]
                  "
                >
                  <ServicioCard {...servicio} />
                </div>
              ))}
            </div>

            {/* =====================================
                FLECHA DERECHA
            ===================================== */}

            <button
              type="button"
              onClick={() => scrollByStep(1)}
              aria-label="Siguiente"
              disabled={atEnd}
              className="
                absolute
                right-0
                top-1/2
                z-10
                hidden
                -translate-y-1/2
                rounded-full
                bg-white
                p-3
                shadow-lg
                transition
                hover:scale-110
                hover:bg-primary
                hover:text-white
                disabled:opacity-30
                md:block
              "
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </Reveal>

        {/* =========================================
            DOTS
        ========================================= */}

        <div className="mt-6 flex justify-center gap-2">
          {SERVICIOS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`Ir al servicio ${index + 1}`}
              className={`
                h-2.5
                rounded-full
                transition-all
                duration-300

                ${
                  current === index
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-primary/30 hover:bg-primary/60"
                }
              `}
            />
          ))}
        </div>

        {/* =========================================
            BOTON
        ========================================= */}

        <Reveal>
          <div className="mt-20 text-center">
            <a
              href="/servicios"
              className="
                inline-block
                rounded-full
                bg-gradient-to-r
                from-primary
                to-primary-dark
                px-10
                py-4
                text-[20px]
                font-bold
                text-white
                shadow-lg
                transition-all
                duration-500
                hover:scale-105
                hover:shadow-xl
                hover:brightness-110
              "
            >
              Ver servicios
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}