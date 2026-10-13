"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Reveal from "@/components/Reveal";

const WHATSAPP = "51913956853";

const TIPOS_EVENTO = [
  "Matrimonio",
  "Quinceañero",
  "Cumpleaños",
  "Graduación",
  "Evento corporativo",
  "Bautizo",
  "Reunión familiar",
  "Otro",
];

const INVITADOS = [
  "Hasta 50 personas",
  "51 a 100 personas",
  "101 a 150 personas",
  "151 a 200 personas",
  "201 a 300 personas",
  "301 a 500 personas",
  "Más de 500 personas",
];

const PAQUETES = [
  "Magic Experience 2H — S/ 1,000",
  "Magic Premium 3H — S/ 1,250",
  "Magic Luxury 4H — S/ 1,500",
  "Deseo una propuesta personalizada",
];

type Datos = {
  nombre: string;
  celular: string;
  tipo: string;
  fecha: string;
  lugar: string;
  invitados: string;
  paquete: string;
  detalles: string;
};

type Errores = Partial<Record<keyof Datos, string>>;

const VACIO: Datos = {
  nombre: "",
  celular: "",
  tipo: "",
  fecha: "",
  lugar: "",
  invitados: "",
  paquete: "",
  detalles: "",
};

// Fecha de hoy en formato AAAA-MM-DD (para no permitir fechas pasadas)
const hoy = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

// Muestra la fecha como DD/MM/AAAA en el mensaje
const formatearFecha = (iso: string) => {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};

function validar(datos: Datos): Errores {
  const e: Errores = {};
  const digitos = datos.celular.replace(/\D/g, "");

  if (datos.nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo.";
  if (digitos.length < 9 || digitos.length > 12)
    e.celular = "Ingresa un número de celular válido.";
  if (!datos.tipo) e.tipo = "Selecciona el tipo de evento.";
  if (!datos.fecha) e.fecha = "Selecciona la fecha del evento.";
  else if (datos.fecha < hoy()) e.fecha = "La fecha no puede ser pasada.";
  if (datos.lugar.trim().length < 2) e.lugar = "Indica el distrito o ciudad.";
  if (!datos.invitados) e.invitados = "Selecciona la cantidad de invitados.";
  if (!datos.paquete) e.paquete = "Selecciona un paquete.";

  return e;
}

function armarMensaje(d: Datos) {
  const lineas = [
    "Hola, deseo solicitar una cotización para *Miranda Magic Mirror* ✨",
    "",
    `*Nombre:* ${d.nombre.trim()}`,
    `*Celular:* ${d.celular.trim()}`,
    `*Tipo de evento:* ${d.tipo}`,
    `*Fecha del evento:* ${formatearFecha(d.fecha)}`,
    `*Distrito o ciudad:* ${d.lugar.trim()}`,
    `*Cantidad de invitados:* ${d.invitados}`,
    `*Paquete de interés:* ${d.paquete}`,
  ];

  if (d.detalles.trim()) {
    lineas.push(`*Detalles adicionales:* ${d.detalles.trim()}`);
  }

  return lineas.join("\n");
}

// Estilos compartidos de los campos
const campoBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#192a3d] outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-[#0054ef] focus:ring-4 focus:ring-[#0054ef]/10";

// Mensaje de error debajo de un campo
function MensajeError({ texto }: { texto?: string }) {
  if (!texto) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-500">
      <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
      {texto}
    </p>
  );
}

// Etiqueta de un campo (con * si es obligatorio)
function Etiqueta({
  campo,
  texto,
  opcional = false,
}: {
  campo: keyof Datos;
  texto: string;
  opcional?: boolean;
}) {
  return (
    <label
      htmlFor={`cot-${campo}`}
      className="mb-1.5 block text-sm font-semibold text-[#192a3d]"
    >
      {texto}{" "}
      {opcional ? (
        <span className="font-normal text-slate-400">(opcional)</span>
      ) : (
        <span className="text-[#c47f0a]">*</span>
      )}
    </label>
  );
}

export default function CotizacionForm() {
  const [datos, setDatos] = useState<Datos>(VACIO);
  const [errores, setErrores] = useState<Errores>({});

  const cambiar = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
    // Quita el error del campo apenas el usuario lo corrige
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();

    const nuevosErrores = validar(datos);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      // Lleva al primer campo con error
      const primero = Object.keys(nuevosErrores)[0];
      document.getElementById(`cot-${primero}`)?.focus();
      return;
    }

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(
      armarMensaje(datos)
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const claseCampo = (campo: keyof Datos) =>
    `${campoBase} ${
      errores[campo]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
        : "border-[#02152b]/15"
    }`;

  return (
    <section
      id="cotizacion"
      className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-5 py-20 font-poppins text-[#3a4f66] md:py-28"
    >
      {/* Patrón de puntitos (muy suave) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      {/* Destellos de color bajos */}
      <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid max-w-[1290px] grid-cols-1 items-start gap-10 lg:grid-cols-[5fr_7fr] lg:gap-14">
        {/* =========================================
            Columna izquierda: llamado a la acción
        ========================================= */}
        <Reveal className="lg:sticky lg:top-32">
          <div className="relative overflow-hidden rounded-3xl bg-[#02152b] p-8 text-white shadow-[0_24px_48px_-16px_rgba(2,21,43,0.5)] md:p-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#f5c542]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-[#0054ef]/25 blur-3xl" />

            <div className="relative">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5c542] text-2xl text-[#02152b]">
                <i className="fa-solid fa-wand-magic-sparkles" aria-hidden="true" />
              </span>

              <h2 className="mt-6 font-krona text-2xl uppercase leading-tight tracking-wide text-white! md:text-3xl">
                ¿Listo para crear una experiencia{" "}
                <span className="text-[#f5c542]">inolvidable</span>?
              </h2>

              <p className="mt-5 leading-relaxed text-white/75">
                Déjanos tus datos y nuestro equipo se pondrá en contacto contigo
                para preparar una propuesta a medida.
              </p>

              <ul className="mt-8 space-y-4 border-t border-white/10 pt-8 text-sm">
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-[#f5c542]" aria-hidden="true" />
                  Respuesta personalizada por WhatsApp
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-[#f5c542]" aria-hidden="true" />
                  Propuesta según tu fecha y ubicación
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-[#f5c542]" aria-hidden="true" />
                  Lima Metropolitana y todo el Perú
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        {/* =========================================
            Columna derecha: formulario
        ========================================= */}
        <Reveal delay={150}>
          <form
            onSubmit={enviar}
            noValidate
            className="rounded-3xl border border-[#02152b]/[0.08] bg-white p-6 shadow-[0_24px_48px_-16px_rgba(2,21,43,0.18)] md:p-10"
          >
            <h3 className="font-krona text-xl uppercase tracking-wide text-[#192a3d]! md:text-2xl">
              Solicita tu cotización
            </h3>
            <p className="mt-2 text-sm">
              Completa los siguientes campos para solicitar tu propuesta.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Nombre completo */}
              <div>
                <Etiqueta campo="nombre" texto="Nombre completo" />
                <input
                  id="cot-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  placeholder="Ej. Ana Torres"
                  value={datos.nombre}
                  onChange={cambiar}
                  maxLength={80}
                  aria-invalid={!!errores.nombre}
                  className={claseCampo("nombre")}
                />
                <MensajeError texto={errores.nombre} />
              </div>

              {/* Número de celular */}
              <div>
                <Etiqueta campo="celular" texto="Número de celular" />
                <input
                  id="cot-celular"
                  name="celular"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Ej. 987 654 321"
                  value={datos.celular}
                  onChange={cambiar}
                  maxLength={16}
                  aria-invalid={!!errores.celular}
                  className={claseCampo("celular")}
                />
                <MensajeError texto={errores.celular} />
              </div>

              {/* Tipo de evento */}
              <div>
                <Etiqueta campo="tipo" texto="Tipo de evento" />
                <select
                  id="cot-tipo"
                  name="tipo"
                  value={datos.tipo}
                  onChange={cambiar}
                  aria-invalid={!!errores.tipo}
                  className={claseCampo("tipo")}
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {TIPOS_EVENTO.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <MensajeError texto={errores.tipo} />
              </div>

              {/* Fecha del evento */}
              <div>
                <Etiqueta campo="fecha" texto="Fecha del evento" />
                <input
                  id="cot-fecha"
                  name="fecha"
                  type="date"
                  min={hoy()}
                  value={datos.fecha}
                  onChange={cambiar}
                  aria-invalid={!!errores.fecha}
                  className={claseCampo("fecha")}
                />
                <MensajeError texto={errores.fecha} />
              </div>

              {/* Distrito o ciudad */}
              <div>
                <Etiqueta campo="lugar" texto="Distrito o ciudad" />
                <input
                  id="cot-lugar"
                  name="lugar"
                  type="text"
                  placeholder="Ej. Miraflores, Lima"
                  value={datos.lugar}
                  onChange={cambiar}
                  maxLength={80}
                  aria-invalid={!!errores.lugar}
                  className={claseCampo("lugar")}
                />
                <MensajeError texto={errores.lugar} />
              </div>

              {/* Cantidad aproximada de invitados */}
              <div>
                <Etiqueta campo="invitados" texto="Cantidad aproximada de invitados" />
                <select
                  id="cot-invitados"
                  name="invitados"
                  value={datos.invitados}
                  onChange={cambiar}
                  aria-invalid={!!errores.invitados}
                  className={claseCampo("invitados")}
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>
                  {INVITADOS.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </select>
                <MensajeError texto={errores.invitados} />
              </div>

              {/* Paquete de interés (ocupa las 2 columnas) */}
              <div className="md:col-span-2">
                <Etiqueta campo="paquete" texto="Paquete de interés" />
                <select
                  id="cot-paquete"
                  name="paquete"
                  value={datos.paquete}
                  onChange={cambiar}
                  aria-invalid={!!errores.paquete}
                  className={claseCampo("paquete")}
                >
                  <option value="" disabled>
                    Selecciona un paquete
                  </option>
                  {PAQUETES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <MensajeError texto={errores.paquete} />
              </div>

              {/* Detalles adicionales (opcional) */}
              <div className="md:col-span-2">
                <Etiqueta campo="detalles" texto="Detalles adicionales" opcional />
                <textarea
                  id="cot-detalles"
                  name="detalles"
                  rows={4}
                  placeholder="Cuéntanos la temática, el horario o cualquier detalle que debamos considerar."
                  value={datos.detalles}
                  onChange={cambiar}
                  maxLength={800}
                  className={`${claseCampo("detalles")} resize-none`}
                />
              </div>
            </div>

            {/* Botón + texto de confirmación */}
            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
              <button
                type="submit"
                className="
                  inline-flex shrink-0 items-center justify-center gap-3 rounded-full
                  border border-[#f5c542]/40
                  bg-gradient-to-r from-[#02152b] via-[#09217d] to-[#0054ef]
                  px-7 py-4 font-semibold text-white
                  shadow-xl shadow-[#02152b]/20
                  transition-all duration-300
                  hover:scale-105 hover:from-[#09217d] hover:to-[#0054ef]
                  focus:outline-none focus:ring-4 focus:ring-[#0054ef]/20
                "
              >
                <i className="fa-brands fa-whatsapp text-2xl text-[#f5c542]" aria-hidden="true" />
                Enviar solicitud por WhatsApp
              </button>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-slate-500">
                <i className="fa-solid fa-circle-info mt-0.5 text-[#0054ef]" aria-hidden="true" />
                Al pulsar el botón, se abrirá WhatsApp con los datos ingresados
                para revisar y enviar tu solicitud.
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}