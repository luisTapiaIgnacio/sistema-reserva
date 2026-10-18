"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiAdmin, mensajeError } from "@/lib/admin";

// Vuelve al detalle mostrando un aviso (verde) o un error (rojo)
function volver(codigo: string, mensaje: string, tipo: "ok" | "error" = "ok"): never {
  revalidatePath("/admin", "layout");
  redirect(`/admin/reservas/${encodeURIComponent(codigo)}?${tipo}=${encodeURIComponent(mensaje)}`);
}

// Ejecuta la llamada a la API y vuelve con el resultado
async function ejecutar(codigo: string, accion: string, cuerpo: unknown, mensajeOk: string): Promise<never> {
  try {
    await apiAdmin(`/admin/reservas/${encodeURIComponent(codigo)}/${accion}`, { metodo: "POST", cuerpo });
  } catch (e) {
    volver(codigo, mensajeError(e), "error");
  }
  volver(codigo, mensajeOk);
}

function pagoDelFormulario(formData: FormData) {
  const monto = Number(formData.get("monto"));
  if (!(monto > 0)) return null;
  return {
    monto,
    metodo: String(formData.get("metodo") ?? ""),
    numero_operacion: String(formData.get("numeroOperacion") ?? "").trim() || null,
  };
}

// ---------- Confirmar (registra el comprobante y asigna unidades) ----------

export async function confirmarReserva(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "");

  // Unidades elegidas: un <select name="unidad-{itemId}"> por cada unidad del item
  const porItem = new Map<number, number[]>();
  for (const [clave, valor] of formData.entries()) {
    if (!clave.startsWith("unidad-")) continue;
    const itemId = Number(clave.slice("unidad-".length));
    porItem.set(itemId, [...(porItem.get(itemId) ?? []), Number(valor)]);
  }
  const asignaciones = [...porItem].map(([reserva_item_id, unidad_ids]) => ({ reserva_item_id, unidad_ids }));

  await ejecutar(
    codigo,
    "confirmar",
    { pago: pagoDelFormulario(formData), asignaciones: asignaciones.length ? asignaciones : null },
    "Reserva confirmada."
  );
}

// ---------- Pagos ----------

export async function registrarPago(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "");
  const pago = pagoDelFormulario(formData);
  if (!pago) volver(codigo, "Escribe un monto válido.", "error");
  await ejecutar(codigo, "pagos", pago, "Pago registrado.");
}

export async function anularPago(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "");
  const pagoId = Number(formData.get("pagoId"));
  await ejecutar(codigo, `pagos/${pagoId}/anular`, undefined, "Pago anulado.");
}

// ---------- Estados ----------

const MENSAJES: Record<string, string> = {
  EN_CURSO: "Reserva marcada en curso.",
  FINALIZADA: "Reserva finalizada.",
  CANCELADA: "Reserva cancelada. La fecha quedó libre.",
};

export async function cambiarEstado(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "");
  const estado = String(formData.get("estado") ?? "");
  await ejecutar(
    codigo,
    "estado",
    {
      estado,
      // Al finalizar: unidades que volvieron con daños → mantenimiento
      unidades_mantenimiento: formData.getAll("mantenimiento").map(Number).filter(Boolean),
      nota: String(formData.get("nota") ?? "").trim() || null,
    },
    MENSAJES[estado] ?? "Estado actualizado."
  );
}

export async function ampliarPlazo(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "");
  const horas = Number(formData.get("horas"));
  await ejecutar(codigo, "ampliar-plazo", { horas }, `Plazo ampliado ${horas} h.`);
}

export async function guardarNotas(formData: FormData) {
  const codigo = String(formData.get("codigo") ?? "");
  try {
    await apiAdmin(`/admin/reservas/${encodeURIComponent(codigo)}/notas`, {
      metodo: "PUT",
      cuerpo: { notas: String(formData.get("notas") ?? "") },
    });
  } catch (e) {
    volver(codigo, mensajeError(e), "error");
  }
  volver(codigo, "Notas guardadas.");
}
