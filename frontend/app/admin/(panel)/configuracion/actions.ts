"use server";

import { revalidatePath } from "next/cache";
import { apiAdmin, mensajeError } from "@/lib/admin";
import type { Configuracion } from "@/lib/tipos";

// valores: lo escrito vuelve al formulario si hay un error (React lo vacía al enviar)
export type EstadoConfiguracion = { error?: string; ok?: string; valores?: Configuracion };

export async function guardarConfiguracion(_prev: EstadoConfiguracion, formData: FormData): Promise<EstadoConfiguracion> {
  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  // Filas de bancos: solo se guardan las que tienen los tres datos
  const bancos = formData
    .getAll("banco")
    .map((_, i) => ({
      banco: String(formData.getAll("banco")[i]).trim(),
      tipo: String(formData.getAll("tipo")[i]).trim(),
      numero: String(formData.getAll("numero")[i]).trim(),
    }))
    .filter((b) => b.banco && b.tipo && b.numero);

  const valores: Configuracion = {
    horas_para_pagar: Number(texto("horas_para_pagar")),
    porcentaje_adelanto: Number(texto("porcentaje_adelanto")),
    whatsapp: texto("whatsapp"),
    yape_plin_numero: texto("yape_plin_numero"),
    yape_plin_titular: texto("yape_plin_titular"),
    yape_plin_qr: texto("yape_plin_qr") || null,
    bancos,
    bancos_titular: texto("bancos_titular"),
  };

  try {
    await apiAdmin("/admin/configuracion", { metodo: "PATCH", cuerpo: valores });
  } catch (e) {
    return { error: mensajeError(e), valores };
  }
  revalidatePath("/admin/configuracion");
  return { ok: "Cambios guardados. Se aplican a las reservas nuevas.", valores };
}
