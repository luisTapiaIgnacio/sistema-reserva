"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number; // retraso en milisegundos
  className?: string;
};

export default function Reveal({ children, delay = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // "inicial" = visible sin animar (por si el JavaScript tarda o falla)
  const [estado, setEstado] = useState<"inicial" | "oculto" | "visible">(
    "inicial",
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Si ya está en pantalla al cargar, se deja visible tal cual
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    // Si está más abajo, se oculta y se anima cuando entra en pantalla
    setEstado("oculto");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEstado("visible");
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${
        estado === "oculto"
          ? "translate-y-8 opacity-0 transition-none"
          : "translate-y-0 opacity-100 transition-all duration-700 ease-out"
      } ${className}`}
      style={{ transitionDelay: estado === "visible" ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}