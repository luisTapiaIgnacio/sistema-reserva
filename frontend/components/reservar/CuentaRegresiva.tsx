"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Muestra hh:mm:ss hasta que vence la reserva; al llegar a 0 recarga la página
export default function CuentaRegresiva({ hasta }: { hasta: string }) {
  const router = useRouter();
  const fin = new Date(hasta).getTime();
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setAhora(t);
      if (t >= fin) {
        clearInterval(id);
        router.refresh();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [fin, router]);

  const resto = Math.max(0, fin - ahora);
  const h = Math.floor(resto / 3_600_000);
  const m = Math.floor((resto % 3_600_000) / 60_000);
  const s = Math.floor((resto % 60_000) / 1000);
  const dos = (n: number) => String(n).padStart(2, "0");

  return (
    <span suppressHydrationWarning className="font-mono font-semibold tabular-nums">
      {dos(h)}:{dos(m)}:{dos(s)}
    </span>
  );
}
