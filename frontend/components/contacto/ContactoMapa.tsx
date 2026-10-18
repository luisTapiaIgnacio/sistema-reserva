import Reveal from "@/components/Reveal";
import { CONTACTO } from "./datos-contacto";

// 👇 Ventajas de la ubicación / cobertura (ajústalas a la realidad de Miranda)
const PUNTOS = ["Atendemos toda Lima Metropolitana", "Envíos a provincias previa coordinación", "Montaje en el lugar de tu evento"];

export default function ContactoMapa() {
  const busqueda = encodeURIComponent(CONTACTO.mapaBusqueda);

  return (
    <section className="relative bg-[#02152b] px-5 pb-20 font-poppins md:pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]">
          {/* Mapa (filtro para que combine con el fondo oscuro) */}
          <iframe
            title={`Mapa de ${CONTACTO.ubicacion}`}
            src={`https://www.google.com/maps?q=${busqueda}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-[320px] w-full border-0 [filter:invert(90%)_hue-rotate(180deg)_saturate(0.6)_brightness(0.9)] md:h-[480px]"
          />

          {/* Tarjeta: debajo del mapa en celular, encima a la derecha en monitor */}
          <div className="relative bg-[#0d1b2a] p-6 md:absolute md:bottom-6 md:right-6 md:top-6 md:flex md:w-[360px] md:flex-col md:justify-center md:rounded-2xl md:border md:border-white/10 md:bg-[#0d1b2a]/90 md:p-8 md:backdrop-blur">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c542]">¿Dónde nos encontramos?</span>
            <h3 className="mt-3 font-krona text-2xl leading-tight text-white!">{CONTACTO.ubicacion}</h3>
            <p className="mt-2 text-sm text-white/60">{CONTACTO.ubicacionNota}</p>
            <span className="mt-5 block h-1 w-16 rounded-full bg-gradient-to-r from-[#f5c542] to-[#c47f0a]" aria-hidden="true" />

            <ul className="mt-5 space-y-3">
              {PUNTOS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-white/80">
                  <i className="fa-solid fa-check mt-0.5 text-[#f5c542]" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${busqueda}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-[#f5c542] px-5 py-3 text-sm font-semibold text-[#02152b] transition-all duration-300 hover:bg-[#ffe9a8] hover:shadow-[0_0_24px_rgba(245,197,66,0.45)]"
            >
              <i className="fa-solid fa-location-arrow" aria-hidden="true" />
              Abrir en Google Maps
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
