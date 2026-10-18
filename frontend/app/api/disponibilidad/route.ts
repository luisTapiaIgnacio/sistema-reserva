// GET /api/disponibilidad?productoId=1&mes=2026-11
import { NextResponse, type NextRequest } from "next/server";
import { libresPorDia } from "@/lib/servicios/disponibilidad";

export const dynamic = "force-dynamic"; // siempre datos frescos

export async function GET(request: NextRequest) {
  const productoId = Number(request.nextUrl.searchParams.get("productoId"));
  const mes = request.nextUrl.searchParams.get("mes") ?? "";

  if (!productoId || !/^\d{4}-\d{2}$/.test(mes)) {
    return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
  }

  const [anio, m] = mes.split("-").map(Number);
  const ultimoDia = new Date(Date.UTC(anio, m, 0)).getUTCDate();
  const datos = await libresPorDia(productoId, `${mes}-01`, `${mes}-${String(ultimoDia).padStart(2, "0")}`);

  return NextResponse.json(datos);
}
