"use server";

import { redirect } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import type { ReservaCreada } from "@/lib/tipos";

// valores: lo que escribió el cliente vuelve al formulario si hay un error
// (React vacía el formulario después de cada envío).
export type EstadoReservaForm = { error?: string; sinStock?: boolean; valores?: Record<string, string> };

const CAMPOS_CLIENTE = ["nombre", "celular", "distrito", "email", "direccion"];

type Item = { producto_id: number; cantidad: number };

export async function crearReserva(_prev: EstadoReservaForm, formData: FormData): Promise<EstadoReservaForm> {
  let items: Item[];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { error: "Elige al menos un producto.", valores: {} };
  }
  const texto = (campo: string) => String(formData.get(campo) ?? "");
  const valores = Object.fromEntries(CAMPOS_CLIENTE.map((c) => [c, texto(c)]));

  let reserva: ReservaCreada;
  try {
    // La API valida todo (celular, fecha, stock) y responde con un mensaje claro si algo falla
    reserva = await api<ReservaCreada>("/reservas", {
      metodo: "POST",
      cuerpo: {
        fecha_inicio: texto("fecha"),
        horario: texto("horario"),
        distrito: texto("distrito"),
        direccion: texto("direccion"),
        cliente: { nombre: texto("nombre"), celular: texto("celular"), email: texto("email") },
        items,
      },
    });
  } catch (e) {
    if (!(e instanceof ApiError)) throw e;
    if (e.status === 409 && e.datos.sin_stock) {
      return { error: "Alguien acaba de reservar esa fecha. Elige otra, por favor.", sinStock: true, valores };
    }
    return { error: e.message, valores };
  }

  redirect(`/reserva/${reserva.codigo}?t=${reserva.token_acceso}`);
}
