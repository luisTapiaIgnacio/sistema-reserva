"use server";

import { randomBytes } from "crypto";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { libresPorDia } from "@/lib/servicios/disponibilidad";
import { aFecha, hoyLima } from "@/lib/fechas";
import { PAGOS } from "@/lib/config-pagos";

export type EstadoReservaForm = { error?: string; sinStock?: boolean };

const esquema = z.object({
  productoId: z.coerce.number().int().positive("Elige un producto."),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha."),
  horario: z.string().trim().max(60),
  nombre: z.string().trim().min(3, "Escribe tu nombre completo."),
  celular: z
    .string()
    .transform((s) => {
      const d = s.replace(/\D/g, ""); // solo números
      return d.length === 11 && d.startsWith("51") ? d.slice(2) : d; // quita el +51
    })
    .pipe(z.string().regex(/^9\d{8}$/, "El celular debe tener 9 dígitos y empezar con 9.")),
  distrito: z.string().trim().max(60),
  email: z
    .string()
    .trim()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Revisa tu correo."),
});

export async function crearReserva(
  _prev: EstadoReservaForm,
  formData: FormData
): Promise<EstadoReservaForm> {
  const r = esquema.safeParse({
    productoId: String(formData.get("productoId") ?? ""),
    fecha: String(formData.get("fecha") ?? ""),
    horario: String(formData.get("horario") ?? ""),
    nombre: String(formData.get("nombre") ?? ""),
    celular: String(formData.get("celular") ?? ""),
    distrito: String(formData.get("distrito") ?? ""),
    email: String(formData.get("email") ?? ""),
  });
  if (!r.success) return { error: r.error.issues[0]?.message ?? "Revisa los datos." };

  const d = r.data;
  if (d.fecha <= hoyLima()) return { error: "Elige una fecha a partir de mañana." };

  const producto = await prisma.producto.findFirst({
    where: { id: d.productoId, activo: true, categoria: { activa: true } },
  });
  if (!producto) return { error: "Ese producto ya no está disponible." };

  // Si ya separó lo mismo y sigue vigente, lo llevamos a esa reserva (no se duplica)
  const existente = await prisma.reserva.findFirst({
    where: {
      estado: "PENDIENTE",
      expiraEn: { gt: new Date() },
      fechaInicio: aFecha(d.fecha),
      cliente: { celular: d.celular },
      items: { some: { productoId: d.productoId } },
    },
  });
  if (existente) redirect(`/reserva/${existente.codigo}?t=${existente.tokenAcceso}`);

  let destino = "";
  try {
    // Transacción "serializable": si dos personas toman la última unidad a la vez, solo una gana
    destino = await prisma.$transaction(
      async (tx) => {
        const { libres } = await libresPorDia(d.productoId, d.fecha, d.fecha, tx);
        if ((libres[d.fecha] ?? 0) < 1) throw new Error("SIN_STOCK");

        const cliente = await tx.cliente.upsert({
          where: { celular: d.celular },
          update: { nombre: d.nombre, ...(d.email ? { email: d.email } : {}) },
          create: { nombre: d.nombre, celular: d.celular, email: d.email || null },
        });

        const anio = hoyLima().slice(0, 4);
        const cantidad = await tx.reserva.count({ where: { codigo: { startsWith: `R-${anio}-` } } });
        const codigo = `R-${anio}-${String(cantidad + 1).padStart(4, "0")}`; // R-2026-0001

        const total = Number(producto.precio);
        const adelanto = Math.ceil((total * PAGOS.porcentajeAdelanto) / 100);
        const tokenAcceso = randomBytes(16).toString("base64url"); // link seguro

        await tx.reserva.create({
          data: {
            codigo,
            tokenAcceso,
            clienteId: cliente.id,
            fechaInicio: aFecha(d.fecha),
            fechaFin: aFecha(d.fecha),
            horario: d.horario || null,
            distrito: d.distrito || null,
            total,
            adelanto,
            expiraEn: new Date(Date.now() + PAGOS.horasParaPagar * 60 * 60 * 1000),
            items: { create: { productoId: d.productoId, cantidad: 1, precioUnitario: total } },
          },
        });

        return `/reserva/${codigo}?t=${tokenAcceso}`;
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
    );
  } catch (e) {
    if (e instanceof Error && e.message === "SIN_STOCK") {
      return { error: "Alguien acaba de reservar esa fecha. Elige otra, por favor.", sinStock: true };
    }
    console.error(e);
    return { error: "No pudimos separar la fecha. Intenta de nuevo en unos segundos." };
  }

  redirect(destino);
}
