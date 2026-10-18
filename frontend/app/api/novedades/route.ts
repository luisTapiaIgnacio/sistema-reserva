
// GET /api/admin/novedades → resumen pequeño que el panel consulta cada 15 s
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leerSesion } from "@/lib/sesion";

export const dynamic = "force-dynamic";

export async function GET() {
  // Solo el admin con sesión puede consultarlo
  if (!(await leerSesion())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ahora = new Date();
  const [pendientes, porVerificar, ultimaReserva, ultimoPago] = await Promise.all([
    prisma.reserva.count({ where: { estado: "PENDIENTE", expiraEn: { gt: ahora } } }),
    prisma.pago.count({ where: { estado: "POR_VERIFICAR" } }),
    prisma.reserva.findFirst({ orderBy: { id: "desc" }, select: { id: true, codigo: true } }),
    prisma.pago.findFirst({
      where: { estado: "POR_VERIFICAR" },
      orderBy: { id: "desc" },
      select: { id: true, reserva: { select: { codigo: true } } },
    }),
  ]);

  return NextResponse.json({
    pendientes,
    porVerificar,
    ultimaReserva,
    ultimoPago: ultimoPago ? { id: ultimoPago.id, codigo: ultimoPago.reserva.codigo } : null,
    // Si cambia la "firma", el panel se actualiza
    firma: [pendientes, porVerificar, ultimaReserva?.id ?? 0, ultimoPago?.id ?? 0].join("|"),
  });
}