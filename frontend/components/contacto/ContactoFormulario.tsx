"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { CONTACTO } from "./datos-contacto";

const TIPOS = ["Matrimonio", "Quinceañero", "Cumpleaños", "Evento corporativo", "Graduación", "Otro"];

const DATOS = [
  { icon: "fa-brands fa-whatsapp", titulo: "WhatsApp", lineas: [CONTACTO.whatsappVisible], href: `https://wa.me/${CONTACTO.whatsapp}` },
  { icon: "fa-regular fa-envelope", titulo: "Email", lineas: [CONTACTO.email], href: `mailto:${CONTACTO.email}` },
  { icon: "fa-solid fa-location-dot", titulo: "Ubicación", lineas: [CONTACTO.ubicacion, CONTACTO.ubicacionNota] },
  { icon: "fa-regular fa-clock", titulo: "Horario de atención", lineas: CONTACTO.horario },
];

const campo =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/35 focus:border-[#f5c542] md:text-sm";

type Errores = Partial<Record<"nombre" | "email" | "telefono" | "mensaje", string>>;

export default function ContactoFormulario() {
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);

  function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const d = {
      nombre: String(f.get("nombre") ?? "").trim(),
      empresa: String(f.get("empresa") ?? "").trim(),
      email: String(f.get("email") ?? "").trim(),
      telefono: String(f.get("telefono") ?? "").replace(/\D/g, ""),
      tipo: String(f.get("tipo") ?? ""),
      mensaje: String(f.get("mensaje") ?? "").trim(),
    };

    const nuevos: Errores = {};
    if (d.nombre.length < 3) nuevos.nombre = "Escribe tu nombre completo.";
    if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) nuevos.email = "Revisa tu correo.";
    if (!/^9\d{8}$/.test(d.telefono)) nuevos.telefono = "Celular de 9 dígitos que empiece con 9.";
    if (d.mensaje.length < 10) nuevos.mensaje = "Cuéntanos un poco más sobre tu evento.";
    setErrores(nuevos);
    if (Object.keys(nuevos).length) return;

    // Arma el mensaje y abre WhatsApp
    const texto = [
      "Hola Miranda Magic Mirror, quiero información:",
      `• Nombre: ${d.nombre}`,
      d.empresa && `• Empresa: ${d.empresa}`,
      d.email && `• Email: ${d.email}`,
      `• Celular: ${d.telefono}`,
      `• Tipo de evento: ${d.tipo}`,
      `• Mensaje: ${d.mensaje}`,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(`https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    setEnviado(true);
    e.currentTarget.reset();
  }

  return (
    <section className="relative overflow-hidden bg-[#02152b] px-5 py-20 font-poppins text-white/70 md:py-28">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ---------- Información ---------- */}
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f5c542]">Estamos para ayudarte</span>
          <h2 className="mt-3 font-krona text-3xl leading-tight text-white! md:text-4xl">
            Cuéntanos sobre <span className="block text-[#f5c542]">tu evento</span>
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed md:text-lg">
            Completa el formulario y te responderemos a la brevedad por WhatsApp con la información y la cotización
            que necesitas.
          </p>

          <ul className="mt-10 space-y-6">
            {DATOS.map((d) => {
              const contenido: ReactNode = (
                <>
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#f5c542]/40 bg-[#f5c542]/10 text-xl text-[#f5c542] transition-colors duration-300 group-hover:bg-[#f5c542] group-hover:text-[#02152b]">
                    <i className={d.icon} aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-semibold text-white">{d.titulo}</span>
                    {d.lineas.map((l) => (
                      <span key={l} className="mt-1 block text-sm">{l}</span>
                    ))}
                  </span>
                </>
              );
              return (
                <li key={d.titulo}>
                  {d.href ? (
                    <a href={d.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 hover:text-white">
                      {contenido}
                    </a>
                  ) : (
                    <div className="group flex items-start gap-4">{contenido}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>

        {/* ---------- Formulario ---------- */}
        <Reveal delay={150}>
          <form
            onSubmit={enviar}
            noValidate
            className="space-y-4 rounded-3xl border border-[#f5c542]/30 bg-[#0d1b2a]/80 p-6 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)] backdrop-blur md:p-8"
          >
            <h3 className="text-xl font-semibold text-white">Envíanos un mensaje</h3>

            <div>
              <input name="nombre" placeholder="Nombre completo *" autoComplete="name" aria-label="Nombre completo" className={campo} />
              {errores.nombre && <p className="mt-1 text-xs text-red-300">{errores.nombre}</p>}
            </div>
            <input name="empresa" placeholder="Empresa (opcional)" autoComplete="organization" aria-label="Empresa" className={campo} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <input name="email" type="email" placeholder="Email" autoComplete="email" aria-label="Email" className={campo} />
                {errores.email && <p className="mt-1 text-xs text-red-300">{errores.email}</p>}
              </div>
              <div>
                <input name="telefono" type="tel" inputMode="numeric" placeholder="Celular *" autoComplete="tel" aria-label="Celular" className={campo} />
                {errores.telefono && <p className="mt-1 text-xs text-red-300">{errores.telefono}</p>}
              </div>
            </div>
            <select name="tipo" defaultValue={TIPOS[0]} aria-label="Tipo de evento" className={`${campo} cursor-pointer`}>
              {TIPOS.map((t) => (
                <option key={t} value={t} className="bg-[#0d1b2a]">{t}</option>
              ))}
            </select>
            <div>
              <textarea name="mensaje" rows={5} placeholder="Cuéntanos sobre tu evento: fecha, lugar, número de invitados… *" aria-label="Mensaje" className={campo} />
              {errores.mensaje && <p className="mt-1 text-xs text-red-300">{errores.mensaje}</p>}
            </div>

            {enviado && (
              <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                ¡Listo! Se abrió WhatsApp con tu mensaje. Solo pulsa enviar y te responderemos pronto.
              </p>
            )}

            <button
              type="submit"
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#f5c542] py-3.5 text-sm font-semibold text-[#02152b] transition-all duration-300 hover:bg-[#ffe9a8] hover:shadow-[0_0_24px_rgba(245,197,66,0.45)]"
            >
              Enviar mensaje
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
