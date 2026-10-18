"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ALIADOS = [
  { src: "/images/nova-btl/yape-logo.png", alt: "Yape", w: 534, h: 555 },
  { src: "/images/nova-btl/logo-nuevo-ferrenergy-1.png", alt: "Ferrenergy", w: 936, h: 252 },
  { src: "/images/nova-btl/Logo_PUCP.png", alt: "PUCP", w: 768, h: 370 },
  { src: "/images/nova-btl/Backus_logo.png", alt: "Backus", w: 765, h: 207 },
];

export default function AliadosCarousel() {
  return (
    <section className="mx-auto max-w-[1290px] px-5 py-[60px] text-center">
      <h2 className="text-2xl font-bold uppercase">Nuestros aliados</h2>

      <div className="mt-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={2}
          loop
          autoplay={{ delay: 1000, disableOnInteraction: false }}
          breakpoints={{ 640: { slidesPerView: 3 }, 1000: { slidesPerView: 4 } }}
        >
          {ALIADOS.map((logo) => (
            <SwiperSlide key={logo.alt} className="flex items-center justify-center">
              <Image
                src={logo.src}
                alt={logo.alt}
                width={logo.w}
                height={logo.h}
                className="mx-auto max-h-[70px] w-auto object-contain"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
