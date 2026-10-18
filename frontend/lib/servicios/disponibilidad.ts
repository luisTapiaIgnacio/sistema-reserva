// Regla de negocio: libres = unidades OPERATIVAS − unidades comprometidas ese día.
// Comprometen unidad: CONFIRMADA, EN_CURSO y PENDIENTE que aún no vence.
import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { aFecha, aTexto, sumarDias } from "@/lib/fechas";

type Db = PrismaClient | Prisma.TransactionClient;

function reservasQueOcupan(desde: Date, hasta: Date): Prisma.ReservaWhereInput {
  return {
    fechaInicio: { lte: hasta },
    fechaFin: { gte: desde },
    OR: [
      { estado: { in: ["CONFIRMADA", "EN_CURSO"] } },
      { estado: "PENDIENTE", expiraEn: { gt: new Date() } }, // la vencida ya no cuenta
    ],
  };
}

// Devuelve las unidades libres de cada día entre "desde" y "hasta" (YYYY-MM-DD)
export async function libresPorDia(productoId: number, desde: string, hasta: string, db: Db = prisma) {
  const total = await db.unidad.count({ where: { productoId, estado: "OPERATIVA" } });

  const items = await db.reservaItem.findMany({
    where: { productoId, reserva: reservasQueOcupan(aFecha(desde), aFecha(hasta)) },
    select: { cantidad: true, reserva: { select: { fechaInicio: true, fechaFin: true } } },
  });

  const libres: Record<string, number> = {};
  for (let dia = desde; dia <= hasta; dia = sumarDias(dia, 1)) {
    const ocupadas = items.reduce((suma, it) => {
      const inicio = aTexto(it.reserva.fechaInicio);
      const fin = aTexto(it.reserva.fechaFin);
      return inicio <= dia && dia <= fin ? suma + it.cantidad : suma;
    }, 0);
    libres[dia] = Math.max(0, total - ocupadas);
  }

  return { total, libres };
}
