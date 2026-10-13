import Reveal from "@/components/Reveal";

const WHATSAPP = "51913956853";
const WHATSAPP_TEXTO = "+51 913 956 853";

const WA_LINK = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
  "Hola, deseo información sobre Miranda Magic Mirror para mi evento"
)}`;

// 👇 Accesos rápidos: ajusta los textos y rutas a los de tu menú
const ACCESOS = [
  { texto: "Inicio", href: "/" },
  { texto: "Complementa tu evento", href: "/complementa-tu-evento" },
  { texto: "Portafolio", href: "/portafolio" },
];

// 👇 Actualiza los enlaces con las cuentas de Miranda Magic Mirror
const REDES = [
  {
    nombre: "Instagram",
    href: "https://www.instagram.com/nova_btl_eventos",
    icon: "fa-brands fa-instagram",
  },
  {
    nombre: "TikTok",
    href: "https://www.tiktok.com/@nova.c35",
    icon: "fa-brands fa-tiktok",
  },
];

export default function Footer({ mostrarLlamado = true }: { mostrarLlamado?: boolean }) {
  return (
    <footer className="relative w-full overflow-hidden border-t border-[#f5c542]/30 bg-[#02152b] px-5 pt-[80px] pb-8 font-poppins text-white">
      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-[1400px]">

                {/* Llamado principal (se puede ocultar con mostrarLlamado={false}) */}
        {mostrarLlamado && (
          <>
            <Reveal>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="font-krona text-2xl uppercase leading-tight tracking-wide text-white! md:text-3xl">
                  ¡Haz que tus recuerdos sean{" "}
                  <span className="text-[#f5c542]">inolvidables</span>!
                </h2>

                <p className="mt-5 text-base leading-relaxed text-white/70 md:text-lg">
                  Sorprende a tus invitados con una experiencia fotográfica
                  diferente. Consulta nuestra disponibilidad y reserva tu fecha.
                </p>

                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-8 inline-flex items-center gap-3 rounded-full
                    bg-[#f5c542] px-8 py-4 font-semibold text-[#02152b]
                    shadow-lg shadow-[#f5c542]/20
                    transition-all duration-300
                    hover:scale-105 hover:bg-[#ffe9a8]
                  "
                >
                  <i
                    className="fa-brands fa-whatsapp text-2xl"
                    aria-hidden="true"
                  />
                  <span>Contáctanos por WhatsApp</span>
                </a>
              </div>
            </Reveal>

            {/* Separador */}
            <hr className="my-12 border-t border-white/15" />
          </>
        )}

        

        {/* Columnas (entran una tras otra) */}
        <div className="grid grid-cols-1 gap-10 text-left sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.3fr_1fr]">
          {/* Sobre la empresa */}
          <Reveal>
            <h3 className="mb-4 font-krona text-base uppercase tracking-wide text-[#f5c542]">
              Miranda Magic Mirror
            </h3>
            <p className="text-sm leading-relaxed text-white/70">
              En MIRANDA MAGIC MIRROR, hacemos que cada fotografía se convierta
              en una experiencia. Nuestro espejo fotográfico interactivo aporta
              entretenimiento, originalidad y un toque especial a bodas,
              quinceañeros, graduaciones, cumpleaños y eventos corporativos.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Nos encargamos de preparar cada detalle para que tus invitados
              disfruten, interactúen y se lleven un recuerdo único de ese día.
            </p>
          </Reveal>

          {/* Accesos rápidos */}
          <Reveal delay={100}>
            <h3 className="mb-4 font-krona text-base uppercase tracking-wide text-white">
              Accesos rápidos
            </h3>
            <ul className="flex list-none flex-col gap-3 p-0">
              {ACCESOS.map((acceso) => (
                <li key={acceso.texto}>
                  <a
                    href={acceso.href}
                    className="text-sm text-white/80 transition-colors duration-300 hover:text-[#f5c542]"
                  >
                    {acceso.texto}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Contacto */}
          <Reveal delay={200}>
            <h3 className="mb-4 font-krona text-base uppercase tracking-wide text-white">
              Contáctanos
            </h3>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-sm text-white/80 transition-colors duration-300 hover:text-[#f5c542]"
            >
              <i
                className="fa-brands fa-whatsapp text-lg text-[#f5c542]"
                aria-hidden="true"
              />
              {WHATSAPP_TEXTO}
            </a>

            <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-white">
              Miranda Import Store
            </p>
            <p className="mt-1 flex items-start gap-3 text-sm leading-relaxed text-white/70">
              <i
                className="fa-solid fa-location-dot mt-1 text-[#f5c542]"
                aria-hidden="true"
              />
              <span>
                Lima Metropolitana · Servicio a nivel nacional previa
                coordinación
              </span>
            </p>
          </Reveal>

          {/* Redes */}
          <Reveal delay={300}>
            <h3 className="mb-4 font-krona text-base uppercase tracking-wide text-white">
              Síguenos
            </h3>
            <ul className="flex list-none flex-col gap-3 p-0">
              {REDES.map((red) => (
                <li key={red.nombre}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm text-white/80 transition-colors duration-300 hover:text-[#f5c542]"
                  >
                    <i
                      className={`${red.icon} w-5 text-center text-lg`}
                      aria-hidden="true"
                    />
                    {red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Separador */}
        <hr className="mt-12 border-t border-white/15" />

        {/* Copyright */}
        <div className="text-center">
          <p className="mt-6 text-xs tracking-wide text-white/60 md:text-sm">
            © {new Date().getFullYear()} MIRANDA MAGIC MIRROR. Todos los
            derechos reservados.
          </p>

          <p className="mt-2 text-[11px] tracking-wide text-white/50">
            | Sitio web diseñado y desarrollado por:{" "}
            <a
              href="https://www.facebook.com/share/1AUShyLaTm/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 transition-colors hover:text-[#f5c542]"
            >
              Z-CORP
            </a>{" "}
            |{" "}
            <a
              href="https://wa.me/51999002030?text=Hola,%20vi%20la%20web%20de%20Miranda%20Magic%20Mirror%20y%20quiero%20informaci%C3%B3n%20sobre%20dise%C3%B1o%20web"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-white/80 transition-colors hover:text-[#f5c542]"
            >
              999002030
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}