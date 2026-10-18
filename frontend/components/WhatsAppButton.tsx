"use client";

import { useState, useEffect } from "react";

const WHATSAPP_URL =
  "https://wa.me/51989661090?text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20sus%20servicios";

export default function WhatsAppButton() {
  const [showMessage, setShowMessage] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Mostrar el mensaje después de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => setShowMessage(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShowMessage(false);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-end gap-3">
      {/* Botón circular de WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="
          group relative
          flex h-14 w-14 shrink-0 items-center justify-center
          rounded-full bg-[#25D366]
          shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)]
          transition-all duration-300
          hover:scale-110 hover:shadow-[0_12px_32px_-6px_rgba(37,211,102,0.8)]
        "
      >
        {/* Anillo pulsante */}
        <span
          className="
            absolute inset-0 rounded-full bg-[#25D366]
            animate-ping opacity-30
          "
          aria-hidden="true"
        />

        {/* Ícono de WhatsApp */}
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="relative z-10"
          aria-hidden="true"
        >
          <path
            fill="#fff"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
      </a>

      {/* Burbuja de mensaje */}
      {showMessage && !dismissed && (
        <div
          className="
            relative max-w-[240px]
            rounded-2xl rounded-bl-sm
            bg-[#e6f9ed]
            px-5 py-3.5 pr-8
            shadow-[0_8px_24px_-8px_rgba(37,211,102,0.4)]
            animate-in fade-in slide-in-from-left-2 duration-500
          "
        >
          {/* Texto */}
          <p className="font-poppins text-sm leading-snug text-[#1f7a4d]">
            <span className="font-normal">¡Hola! </span>
            <span className="font-bold">¿En qué podemos ayudarte?</span>
          </p>

          {/* Botón de cerrar */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Cerrar mensaje"
            className="
              absolute -top-2 -right-2
              flex h-6 w-6 items-center justify-center
              rounded-full bg-white text-[#1f7a4d]
              shadow-md
              transition-all duration-200
              hover:scale-110 hover:bg-gray-100
            "
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Piquito de la burbuja (apunta al ícono) */}
          <span
            className="
              absolute bottom-4 -left-2
              h-4 w-4 rotate-45
              bg-[#e6f9ed]
            "
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}