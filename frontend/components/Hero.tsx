import Marquee from "./Marquee";

const MARQUEE_ITEMS = [
  "Diseño de Eventos",
  "Estrategia BTL",
  "Team Building",
  "Merchandising & Branding",
];

export default function Hero() {
  return (
    <section className="relative flex h-screen min-h-[600px] flex-col overflow-hidden bg-[#0e1420] text-center text-white">
      {/* Imagen de fondo con zoom lento */}
      <div
        className="animate-hero-zoom absolute inset-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage:
            "url('/images/nova-btl/imgi_46_Banner-principal-Nova-BTL.jpg')",
        }}
      />
      {/* Oscurecedor */}
      <div className="absolute inset-0 bg-[#0e1420]/55" />

      {/* Contenido */}
      <div className="animate-hero-reveal relative z-10 flex flex-1 flex-col items-center justify-center px-5 pt-24 pb-10">
        {/* 👇 Envuelvo TODO el contenido con la misma animación del fondo */}
        <div className="animate-hero-zoom flex flex-col items-center will-change-transform">
          {/* H1 con sombra */}
          <h1
            className="
            mb-4 text-[clamp(28px,4vw,40px)] leading-[1.4] font-bold uppercase
            text-light
            [text-shadow:0_2px_12px_rgba(0,0,0,0.65)]
          "
          >
            &ldquo;TU EVENTO, TU ESTILO, <br />{" "}
            <span className="text-white">TUS RECUERDOS INOLVIDABLES</span>
          </h1>

          {/* Párrafo con sombra sutil */}
          <p
            className="
  mx-auto mb-7 max-w-[620px] text-base text-white/80 md:text-lg
  [text-shadow:0_1px_6px_rgba(0,0,0,0.6)]
"
          >
            Transformamos cada celebración en una experiencia interactiva,
            divertida y llena de momentos especiales. Con nuestro{" "}
            <span
              className="text-white font-black uppercase
    [text-shadow:0_1px_8px_rgba(0,0,0,0.85)]"
            >
              espejo fotográfico
            </span>
            , tus invitados serán protagonistas de recuerdos que podrán
            conservar para siempre
          </p>

          {/* Botón */}
          <a
            href="https://wa.me/51989661090?text=Hola,%20quiero%20cotizar%20un%20evento%20con%20Nova%20BTL%20y%20Eventos"
            target="_blank"
            rel="noopener noreferrer"
            className="
              group inline-flex items-center gap-3
              rounded-full bg-gradient-gold px-6 py-3
              font-poppins text-base font-bold text-primary
              shadow-lg
              transition-all duration-300
              hover:scale-105 hover:bg-pink/90 hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-pink/50 focus:ring-offset-2 focus:ring-offset-[#0e1420]
            "
          >
            <span>Contáctanos</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] transition-transform group-hover:scale-110">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  fill="#fff"
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10">
        <Marquee items={MARQUEE_ITEMS} variant="dark" />
      </div>
    </section>
  );
}
