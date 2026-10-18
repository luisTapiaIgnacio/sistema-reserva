"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Novedades = {
  pendientes: number;
  porVerificar: number;
  ultimaReserva: { id: number; codigo: string } | null;
  ultimoPago: { id: number; codigo: string } | null;
  firma: string;
};

export type Aviso = { id: number; texto: string; href: string };

const INTERVALO = 15_000; // cada 15 segundos

// "Ding" corto generado por el navegador (no necesita archivo de audio)
function sonar() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const vol = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    vol.gain.setValueAtTime(0.0001, ctx.currentTime);
    vol.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    vol.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(vol).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
    osc.onended = () => ctx.close();
  } catch {
    // algunos navegadores bloquean el sonido hasta que el usuario haga clic
  }
}

export function useNovedades() {
  const router = useRouter();
  const anterior = useRef<Novedades | null>(null);
  const [pendientes, setPendientes] = useState(0);
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [permiso, setPermiso] = useState<NotificationPermission | "no-soportado">("default");

  const revisar = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/novedades", { cache: "no-store" });
      if (!r.ok) return;
      const n: Novedades = await r.json();

      setPendientes(n.pendientes);
      setPermiso("Notification" in window ? Notification.permission : "no-soportado");

      const prev = anterior.current;
      anterior.current = n;
      if (!prev || prev.firma === n.firma) return; // primera carga o sin cambios

      router.refresh(); // vuelve a pedir los datos de la página actual, sin recargar

      const nuevos: Aviso[] = [];
      if (n.ultimaReserva && n.ultimaReserva.id !== prev.ultimaReserva?.id) {
        nuevos.push({
          id: Date.now(),
          texto: `Nueva reserva: ${n.ultimaReserva.codigo}`,
          href: `/admin/reservas/${n.ultimaReserva.codigo}`,
        });
      }
      if (n.ultimoPago && n.ultimoPago.id !== prev.ultimoPago?.id) {
        nuevos.push({
          id: Date.now() + 1,
          texto: `Pago por verificar: ${n.ultimoPago.codigo}`,
          href: `/admin/reservas/${n.ultimoPago.codigo}`,
        });
      }
      if (nuevos.length === 0) return;

      setAvisos((a) => [...a, ...nuevos].slice(-4));
      sonar();

      // Notificación del sistema si el panel está en otra pestaña
      if (document.hidden && "Notification" in window && Notification.permission === "granted") {
        for (const aviso of nuevos) {
          const notif = new Notification("Miranda · Panel", {
            body: aviso.texto,
            icon: "/images/nova-btl/logo-mirada.png",
            tag: aviso.href,
          });
          notif.onclick = () => {
            window.focus();
            router.push(aviso.href);
            notif.close();
          };
        }
      }

      // Los avisos se cierran solos a los 8 s
      for (const aviso of nuevos) {
        setTimeout(() => setAvisos((a) => a.filter((x) => x.id !== aviso.id)), 8000);
      }
    } catch {
      // sin conexión: se vuelve a intentar en la siguiente vuelta
    }
  }, [router]);

  
    useEffect(() => {
    const primera = setTimeout(revisar, 0); // primera revisión apenas carga
    const id = setInterval(revisar, INTERVALO);
    const alVolver = () => {
      if (!document.hidden) revisar(); // al regresar a la pestaña, revisa de inmediato
    };
    document.addEventListener("visibilitychange", alVolver);
    return () => {
      clearTimeout(primera);
      clearInterval(id);
      document.removeEventListener("visibilitychange", alVolver);
    };
  }, [revisar]);

  async function pedirPermiso() {
    if (!("Notification" in window)) return;
    setPermiso(await Notification.requestPermission());
  }

  function cerrarAviso(id: number) {
    setAvisos((a) => a.filter((x) => x.id !== id));
  }

  return { pendientes, avisos, permiso, pedirPermiso, cerrarAviso };
}