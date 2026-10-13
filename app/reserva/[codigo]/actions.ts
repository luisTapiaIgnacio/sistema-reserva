"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type EstadoInformePago = { error?: string; ok?: boolean };

const METODOS = { YAPE: "YAPE", PLIN: "PLIN", TRANSFERENCIA: "TRANSFERENCIA" } as const;

// El cliente informa su N.º de operación → queda un Pago POR_VERIFICAR para el admin
export async function informarPago(_prev: EstadoInformePago, formData: FormData): Promise<EstadoInformePago> {
  const codigo = String(formData.get("codigo") ?? "");
  const token = String(formData.get("t") ?? "");
  const metodo = String(formData.get("metodo") ?? "") as keyof typeof METODOS;
  const numeroOperacion = String(formData.get("numeroOperacion") ?? "").replace(/\s/g, "");

  if (!(metodo in METODOS)) return { error: "Elige cómo pagaste." };
  if (!/^[A-Za-z0-9-]{4,30}$/.test(numeroOperacion)) return { error: "Revisa el número de operación." };

  const reserva = await prisma.reserva.findUnique({ where: { codigo } });
  if (!reserva || reserva.tokenAcceso !== token) return { error: "No encontramos tu reserva." };
  if (reserva.estado !== "PENDIENTE" || !reserva.expiraEn || reserva.expiraEn < new Date()) {
    return { error: "Esta reserva ya no está pendiente de pago." };
  }

  const repetido = await prisma.pago.findUnique({ where: { numeroOperacion } });
  if (repetido) return { error: "Ese número de operación ya fue registrado." };

  await prisma.$transaction([
    prisma.pago.create({
      data: {
        reservaId: reserva.id,
        monto: reserva.adelanto,
        metodo: METODOS[metodo],
        origen: "WEB",
        numeroOperacion,
      },
    }),
    prisma.reserva.update({
      where: { id: reserva.id },
      data: { canalPago: metodo === "TRANSFERENCIA" ? "TRANSFERENCIA" : "YAPE_PLIN" },
    }),
  ]);

  revalidatePath(`/reserva/${codigo}`);
  return { ok: true };
}
