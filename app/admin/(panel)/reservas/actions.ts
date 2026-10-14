"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MetodoPago, type EstadoReserva } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import { libresPorDia } from "@/lib/servicios/disponibilidad";
import { aTexto } from "@/lib/fechas";

// Vuelve al detalle mostrando un aviso (verde) o un error (rojo)
function volver(codigo: string, mensaje: string, tipo: "ok" | "error" = "ok"): never {
  revalidatePath("/admin");
  revalidatePath("/admin/reservas");
  revalidatePath(`/admin/reservas/${codigo}`);
  redirect(`/admin/reservas/${codigo}?${tipo}=${encodeURIComponent(mensaje)}`);
}

// ¿Quedan unidades para las fechas de esta reserva?
async function hayStock(productoId: number, inicio: Date, fin: Date, cantidad: number, yaCuenta: boolean) {
  const { libres } = await libresPorDia(productoId, aTexto(inicio), aTexto(fin));
  const minimo = Math.min(...Object.values(libres));
  // si la reserva sigue vigente, ella misma ya está descontada de "libres"
  return minimo + (yaCuenta ? cantidad : 0) >= cantidad;
}

// ---------- Pagos ----------

export async function registrarPago(formData: FormData) {
  await exigirAdmin();
  const codigo = String(formData.get("codigo") ?? "");
  const monto = Number(formData.get("monto"));
  const metodo = String(formData.get("metodo") ?? "") as MetodoPago;
  const numeroOperacion = String(formData.get("numeroOperacion") ?? "").trim() || null;

  if (!Object.values(MetodoPago).includes(metodo)) volver(codigo, "Elige el método de pago.", "error");
  if (!(monto > 0)) volver(codigo, "Escribe un monto válido.", "error");

  const reserva = await prisma.reserva.findUnique({ where: { codigo } });
  if (!reserva) redirect("/admin/reservas");

  if (numeroOperacion && (await prisma.pago.findUnique({ where: { numeroOperacion } }))) {
    volver(codigo, "Ese número de operación ya está registrado.", "error");
  }

  await prisma.pago.create({
    data: {
      reservaId: reserva.id,
      monto,
      metodo,
      numeroOperacion,
      origen: metodo === "EFECTIVO" ? "ADMIN" : "WHATSAPP",
      estado: "VERIFICADO", // lo registra el admin: ya está revisado
    },
  });

  volver(codigo, "Pago registrado.");
}

export async function revisarPago(formData: FormData) {
  await exigirAdmin();
  const codigo = String(formData.get("codigo") ?? "");
  const pagoId = Number(formData.get("pagoId"));
  const decision = String(formData.get("decision"));

  if (decision !== "VERIFICADO" && decision !== "RECHAZADO") volver(codigo, "Acción no válida.", "error");

  await prisma.pago.update({ where: { id: pagoId }, data: { estado: decision } });
  volver(codigo, decision === "VERIFICADO" ? "Pago verificado." : "Pago rechazado.");
}

// ---------- Confirmar y asignar unidad ----------

export async function confirmarReserva(formData: FormData) {
  await exigirAdmin();
  const codigo = String(formData.get("codigo") ?? "");
  const unidadId = Number(formData.get("unidadId"));

  const reserva = await prisma.reserva.findUnique({
    where: { codigo },
    include: { items: true, pagos: true },
  });
  if (!reserva) redirect("/admin/reservas");
  if (reserva.estado !== "PENDIENTE") volver(codigo, "Solo se pueden confirmar reservas pendientes.", "error");
  if (!reserva.pagos.some((p) => p.estado !== "RECHAZADO")) {
    volver(codigo, "Primero registra o verifica el pago del adelanto.", "error");
  }

  const item = reserva.items[0];
  if (!item) volver(codigo, "La reserva no tiene productos.", "error");

  const unidad = await prisma.unidad.findUnique({ where: { id: unidadId } });
  if (!unidad || unidad.productoId !== item.productoId || unidad.estado !== "OPERATIVA") {
    volver(codigo, "Elige una unidad operativa de este producto.", "error");
  }

  // La unidad no debe estar asignada a otra reserva activa en esas fechas
  const ocupada = await prisma.asignacion.findFirst({
    where: {
      unidadId,
      reservaItem: {
        reserva: {
          id: { not: reserva.id },
          estado: { in: ["CONFIRMADA", "EN_CURSO"] },
          fechaInicio: { lte: reserva.fechaFin },
          fechaFin: { gte: reserva.fechaInicio },
        },
      },
    },
  });
  if (ocupada) volver(codigo, `${unidad.codigo} ya está asignada a otra reserva en esa fecha.`, "error");

  const vigente = !!reserva.expiraEn && reserva.expiraEn > new Date();
  if (!(await hayStock(item.productoId, reserva.fechaInicio, reserva.fechaFin, item.cantidad, vigente))) {
    volver(codigo, "Ya no quedan unidades libres para esa fecha.", "error");
  }

  await prisma.$transaction([
    prisma.asignacion.deleteMany({ where: { reservaItemId: item.id } }),
    prisma.asignacion.create({ data: { reservaItemId: item.id, unidadId } }),
    prisma.pago.updateMany({ where: { reservaId: reserva.id, estado: "POR_VERIFICAR" }, data: { estado: "VERIFICADO" } }),
    prisma.reserva.update({ where: { id: reserva.id }, data: { estado: "CONFIRMADA", expiraEn: null } }),
  ]);

  volver(codigo, `Reserva confirmada con ${unidad.codigo}.`);
}

// ---------- Cambios de estado ----------

const PERMITIDOS: Record<string, EstadoReserva[]> = {
  PENDIENTE: ["CANCELADA"],
  CONFIRMADA: ["EN_CURSO", "CANCELADA"],
  EN_CURSO: ["FINALIZADA"],
};

const MENSAJES: Record<string, string> = {
  EN_CURSO: "Reserva marcada en curso.",
  FINALIZADA: "Reserva finalizada.",
  CANCELADA: "Reserva cancelada. La fecha quedó libre.",
};

export async function cambiarEstado(formData: FormData) {
  await exigirAdmin();
  const codigo = String(formData.get("codigo") ?? "");
  const nuevo = String(formData.get("estado")) as EstadoReserva;

  const reserva = await prisma.reserva.findUnique({ where: { codigo } });
  if (!reserva) redirect("/admin/reservas");
  if (!PERMITIDOS[reserva.estado]?.includes(nuevo)) volver(codigo, "Ese cambio de estado no está permitido.", "error");

  // Al finalizar: unidades que volvieron con daños → mantenimiento
  const aMantenimiento = formData.getAll("mantenimiento").map(Number).filter(Boolean);

  await prisma.$transaction([
    prisma.reserva.update({
      where: { id: reserva.id },
      data: { estado: nuevo, ...(nuevo === "CANCELADA" ? { expiraEn: null } : {}) },
    }),
    ...(aMantenimiento.length
      ? [prisma.unidad.updateMany({ where: { id: { in: aMantenimiento } }, data: { estado: "MANTENIMIENTO" } })]
      : []),
  ]);

  volver(codigo, MENSAJES[nuevo] ?? "Estado actualizado.");
}

// ---------- Ampliar plazo de pago ----------

export async function ampliarPlazo(formData: FormData) {
  await exigirAdmin();
  const codigo = String(formData.get("codigo") ?? "");
  const horas = Number(formData.get("horas"));
  if (!(horas > 0 && horas <= 168)) volver(codigo, "Plazo no válido.", "error");

  const reserva = await prisma.reserva.findUnique({ where: { codigo }, include: { items: true } });
  if (!reserva) redirect("/admin/reservas");
  if (reserva.estado !== "PENDIENTE") volver(codigo, "Solo se amplía el plazo de reservas pendientes.", "error");

  const vigente = !!reserva.expiraEn && reserva.expiraEn > new Date();
  const item = reserva.items[0];

  // Si ya venció, otra persona pudo tomar la fecha: se revisa el stock
  if (!vigente && item && !(await hayStock(item.productoId, reserva.fechaInicio, reserva.fechaFin, item.cantidad, false))) {
    volver(codigo, "La fecha ya fue tomada por otra reserva.", "error");
  }

  const base = vigente && reserva.expiraEn ? reserva.expiraEn.getTime() : Date.now();
  await prisma.reserva.update({
    where: { id: reserva.id },
    data: { expiraEn: new Date(base + horas * 60 * 60 * 1000) },
  });

  volver(codigo, `Plazo ampliado ${horas} h.`);
}
