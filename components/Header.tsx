"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


// 👇 Submenú de "Complementa tu Evento": actualiza los nombres y enlaces

const SUBMENU_COMPLEMENTA = [
  { label: "Carritos Snacks y Catering", href: "/complementa_evento/carritos-snacks-y-catering" },
  { label: "Ticket Ejecutivo Corporativo", href: "/complementa_evento/ticket-ejecutivo-corporativo" },
  { label: "Personalización de Merchandising", href: "/complementa_evento/personalizacion-de-merchandising" },
  { label: "Plataforma 360°", href: "/complementa_evento/plataforma-360" },
  { label: "Aro 360°", href: "/complementa_evento/aro-360" },
  { label: "Guía Pre-Evento", href: "/complementa_evento/guia-pre-evento" },
  { label: "Directivo", href: "/complementa_evento/directivo" },
  { label: "Robot LED", href: "/complementa_evento/robot-led" },
  { label: "Libro de Recuerdos", href: "/complementa_evento/libro-de-recuerdos" },
  { label: "Espejo Mágico", href: "/complementa_evento/espejo-magico" },
  { label: "Fotos Instantáneas", href: "/complementa_evento/fotos-instantaneas" },
  { label: "Fondos Personalizados", href: "/complementa_evento/fondos-personalizados" },
];

const NAV_LINKS = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  {
    label: "Complementa tu Evento",
    href: "/complementa_evento",
    submenu: SUBMENU_COMPLEMENTA,
  },
  { label: "Portafolio", href: "/portafolio" },
  { label: "Sobre Nosotros", href: "/sobre-nosotros" },
  { label: "Contáctanos", href: "/contactanos" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // 👇 Submenú abierto en el menú móvil (acordeón)
  const [subAbierto, setSubAbierto] = useState<string | null>(null);
  const pathname = usePathname();

  // Detectar scroll para activar el fondo del header
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear scroll cuando el offcanvas está abierto
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Activo: en los ítems con submenú, también cuando estás en una de sus páginas
  const estaActivo = (link: (typeof NAV_LINKS)[number]) =>
    link.submenu ? pathname.startsWith(link.href) : pathname === link.href;

  return (
    <header
      className={`
       sticky top-0 z-50
    transition-all duration-300 ease-out
    ${
      scrolled
        ? "bg-primary/30 backdrop-blur-xl shadow-[0_8px_24px_-8px_rgba(0,0,0,0.8)] border-b border-white/10"
        : "bg-primary border-b border-transparent"
    }
      `}
    >
      {/* --- Desktop --- */}
      <div className="hidden min-h-[100px] items-center md:flex">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-6 px-5">
          {/* Logo */}
          <Link href="/" className="block shrink-0">
            <Image
              src="/images/nova-btl/logo-mirada.png"
              alt="Miranda Import"
              width={220}
              height={60}
              className="max-h-[90px] w-auto"
              priority
            />
          </Link>

          {/* Menú central con separadores */}
          <nav aria-label="Menú principal" className="flex-1">
            <ul className="flex list-none items-center justify-center gap-0 p-0">
              {NAV_LINKS.map((link, i) => {
                const isActive = estaActivo(link);

                const clases = `
                  group relative inline-flex items-center gap-1.5 px-4 py-2.5
                  rounded-full
                  font-poppins text-[15px] font-medium capitalize
                  transition-all duration-300
                  ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:bg-white/[0.08] hover:text-white"
                  }
                `;

                const contenido = (
                  <>
                    {link.label}

                    {/* Flecha del submenú (gira al pasar el mouse) */}
                    {link.submenu && (
                      <i
                        className="fa-solid fa-chevron-down text-[10px] transition-transform duration-300 group-hover/sub:rotate-180"
                        aria-hidden="true"
                      />
                    )}

                    {/* Línea inferior */}
                    <span
                      className={`
                        absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-pink
                        transition-all duration-300
                        ${
                          isActive
                            ? "w-6 opacity-100"
                            : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
                        }
                      `}
                    />
                  </>
                );

                return (
                  <li
                    key={link.href}
                    className={`flex items-center ${
                      link.submenu ? "group/sub relative" : ""
                    }`}
                  >
                    {/* Con submenú: botón (no navega, solo despliega) */}
                    {link.submenu ? (
                      <button
                        type="button"
                        aria-haspopup="true"
                        className={`${clases} cursor-pointer focus:outline-none`}
                      >
                        {contenido}
                      </button>
                    ) : (
                      <Link href={link.href} className={clases}>
                        {contenido}
                      </Link>
                    )}

                    {/* Submenú desplegable (se activa al pasar el mouse) */}
                    {link.submenu && (
                      <div
                        className="
                          invisible absolute left-1/2 top-full z-50 w-[680px] -translate-x-1/2 translate-y-2 pt-4
                          opacity-0 transition-all duration-300
                          group-hover/sub:visible group-hover/sub:translate-y-0 group-hover/sub:opacity-100
                          group-focus-within/sub:visible group-focus-within/sub:translate-y-0 group-focus-within/sub:opacity-100
                        "
                      >
                        <ul
                          className="
                            grid list-none grid-cols-3 overflow-hidden rounded-2xl
                            border border-white/10 bg-[#0d1b2a]/95 p-0 backdrop-blur-xl
                            shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)]
                          "
                        >
                          {link.submenu.map((item, idx) => (
                            <li
                              key={item.label}
                              className={`
                                border-dashed border-white/10
                                ${idx % 3 !== 2 ? "border-r" : ""}
                                ${idx < link.submenu.length - 3 ? "border-b" : ""}
                              `}
                            >
                              <Link
                                href={item.href}
                                className="
                                  group/item flex items-center gap-3 px-5 py-4
                                  font-poppins text-sm font-medium text-white/85
                                  transition-colors duration-200
                                  hover:bg-white/[0.06] hover:text-white
                                "
                              >
                                <i
                                  className="fa-solid fa-chevron-right text-[10px] text-pink transition-transform duration-200 group-hover/item:translate-x-1"
                                  aria-hidden="true"
                                />
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Separador vertical */}
                    {i < NAV_LINKS.length - 1 && (
                      <span
                        className="h-4 w-px bg-white/15"
                        aria-hidden="true"
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Botón Suscríbete */}
          <Link
            href="/suscribete"
            className="
              group shrink-0 inline-flex items-center gap-2
              rounded-full px-6 py-2.5
              bg-primary-light
              font-poppins text-sm font-bold text-white
              shadow-lg shadow-primary-glow/30
              transition-all duration-300
              hover:scale-105 hover:shadow-primary-glow/50
              focus:outline-none focus:ring-2 focus:ring-primary-glow/50 focus:ring-offset-2 focus:ring-offset-primary
            "
          >
            Suscríbete
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* --- Mobile --- */}
      <div className="flex min-h-[70px] items-center md:hidden">
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-5">
          <Link href="/">
            <Image
              src="/images/nova-btl/logo-mirada.png"
              alt="Nova BTL y eventos"
              width={160}
              height={44}
              className="w-auto max-h-20"
            />
          </Link>
          <button
            type="button"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-[1000] cursor-pointer border-none bg-transparent text-white"
          >
            {open ? (
              /* ❌ Ícono X */
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              /* ☰ Ícono hamburguesa */
              <svg
                width="18"
                height="14"
                viewBox="0 0 18 14"
                aria-hidden="true"
                className="transition-transform duration-300"
              >
                <rect
                  y="0"
                  width="18"
                  height="1.7"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  y="6.15"
                  width="18"
                  height="1.7"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  y="12.3"
                  width="18"
                  height="1.7"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* --- Offcanvas móvil ---
          El contenedor externo ocupa la pantalla y recorta (overflow-hidden),
          así el panel escondido a la derecha no genera scroll horizontal */}
      <div
        className={`fixed inset-0 z-[999] overflow-hidden md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Fondo oscuro al abrir el offcanvas */}
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={
            "absolute top-0 right-0 bottom-0 w-4/5 max-w-[360px] overflow-x-hidden overflow-y-auto rounded-l-3xl bg-[rgba(5,10,25,0.92)] backdrop-blur-xl transition-transform duration-300 ease-out " +
            (open ? "translate-x-0" : "translate-x-full")
          }
        >
          <div className="flex justify-end p-5">
            <button
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              className="cursor-pointer border-none bg-transparent text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <ul className="list-none px-5 pb-8">
            {NAV_LINKS.map((link) => {
              const isActive = estaActivo(link);
              const desplegado = subAbierto === link.href;

              const clases = `
                flex w-full items-center justify-between rounded-2xl border px-5 py-[18px]
                text-left text-xs font-bold transition-colors duration-300
                ${
                  isActive || desplegado
                    ? "border-pink/40 bg-gradient-to-r from-pink/20 to-pink/[0.08] text-white"
                    : "border-white/[0.06] bg-white/[0.03] text-white hover:border-pink/40 hover:bg-gradient-to-r hover:from-pink/20 hover:to-pink/[0.08]"
                }
              `;

              return (
                <li key={link.href} className="mb-3">
                  {link.submenu ? (
                    <>
                      {/* Botón que abre/cierra el submenú */}
                      <button
                        type="button"
                        aria-expanded={desplegado}
                        onClick={() =>
                          setSubAbierto(desplegado ? null : link.href)
                        }
                        className={`${clases} cursor-pointer`}
                      >
                        {link.label}
                        <i
                          className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-300 ${
                            desplegado ? "rotate-180" : ""
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {/* Submenú (acordeón) */}
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          desplegado ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <ul className="list-none overflow-hidden p-0">
                          {link.submenu.map((item) => {
                            const itemActivo = pathname === item.href;
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={() => setOpen(false)}
                                  className={`
                                    flex items-center gap-3 border-b border-dashed border-white/10
                                    px-5 py-3.5 text-xs font-medium transition-colors duration-200
                                    ${itemActivo ? "text-white" : "text-white/75 hover:text-white"}
                                  `}
                                >
                                  <i
                                    className="fa-solid fa-chevron-right text-[9px] text-pink"
                                    aria-hidden="true"
                                  />
                                  {item.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={clases}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              );
            })}

            <li className="mt-6">
              <Link
                href="/suscribete"
                onClick={() => setOpen(false)}
                className="
                  group flex items-center justify-center gap-2
                  rounded-2xl px-5 py-[18px]
                  bg-primary-light
                  font-poppins text-sm font-semibold text-white
                  shadow-lg shadow-primary-glow/30
                  transition-all duration-300
                  hover:scale-[1.02] hover:shadow-primary-glow/50
                "
              >
                Suscríbete
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}