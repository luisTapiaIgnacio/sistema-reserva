"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import ServicioCard from "./TestCard";

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
    imagen: "/images/nova-btl/serv1.png",
  },
  {
    eyebrow: "SNACKS",
    titulo: "Estaciones de snacks premium",
    descripcion:
      "Carritos de snacks premium que complementan reuniones, celebraciones y experiencias memorables.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20estoy%20interesado%20en%20una%20Estacion%20de%20Snack%20Premium",
    imagen: "/images/nova-btl/serv4.png",
  },
  {
    eyebrow: "TEAM",
    titulo: "Team Building",
    descripcion:
      "Desarrollamos experiencias que fortalecen equipos y cultura organizacional.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20quiero%20cotizar%20una%20actividad%20de%20team%20building",
    imagen: "/images/nova-btl/serv3.png",
  },
  {
    eyebrow: "MERCH & BRAND",
    titulo: "Merchandising & Branding",
    descripcion:
      "Gestionamos productos y materiales que refuerzan tu identidad de marca.",
    whatsapp:
      "https://wa.me/51989661090?text=Hola,%20estoy%20interesado%20en%20merchandising%20y%20branding",
    imagen: "/images/nova-btl/serv4.png",
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

// Duplicado para que el loop funcione con 4 cards visibles
const SLIDES = [...SERVICIOS, ...SERVICIOS];

export default function ServiciosGrid() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [current, setCurrent] = useState(0);

  return (
    <section className="relative w-full overflow-hidden bg-white py-[70px]">
      {/* FONDO */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(8,16,71,0.10) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(8,16,71,0.10) 1px, transparent 1px),
            linear-gradient(to right, rgba(8,16,71,0.25) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(8,16,71,0.25) 2px, transparent 2px)
          `,
          backgroundSize: "40px 40px, 40px 40px, 200px 200px, 200px 200px",
        }}
      />

      <div className="relative mx-auto max-w-[1290px] px-5">
        {/* TITULO */}
        <p className="mb-1 py-3 text-left font-krona text-sm font-bold uppercase text-[#3a3a3a]">
          Soluciones diseñadas para tu negocio
        </p>

        <h2 className="font-krona text-4xl uppercase text-[#180d0d] md:text-5xl">
          ¿Cómo te ayudamos?
        </h2>

        {/* CARRUSEL */}
        <div className="relative mt-10">
          {/* FLECHA IZQUIERDA */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:scale-110 hover:bg-primary hover:text-white md:block"
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

          <Swiper
            modules={[Autoplay]}
            onSwiper={(s) => (swiperRef.current = s)}
            onSlideChange={(s) => setCurrent(s.realIndex % SERVICIOS.length)}
            loop
            loopAdditionalSlides={2}
            slidesPerView="auto"
            spaceBetween={32}
            speed={700}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            className="!py-4 !pb-14"
          >
            {SLIDES.map((servicio, i) => (
              <SwiperSlide
                key={`${servicio.titulo}-${i}`}
                className="!h-auto !w-[85%] sm:!w-[45%] lg:!w-[calc(25%-1.5rem)]"
              >
                <ServicioCard {...servicio} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* FLECHA DERECHA */}
          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition hover:scale-110 hover:bg-primary hover:text-white md:block"
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

        {/* DOTS */}
        <div className="mt-6 flex justify-center gap-2">
          {SERVICIOS.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => swiperRef.current?.slideToLoop(index)}
              aria-label={`Ir al servicio ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-primary/30 hover:bg-primary/60"
              }`}
            />
          ))}
        </div>

        {/* BOTON */}
        <div className="mt-20 text-center">
          <a
            href="/servicios"
            className="inline-block rounded-full bg-gradient-to-r from-primary to-primary-dark px-10 py-4 text-[20px] font-bold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl hover:brightness-110"
          >
            Ver servicios
          </a>
        </div>
      </div>
    </section>
  );
}