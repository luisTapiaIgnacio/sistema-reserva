// GET /api/disponibilidad?mes=2026-11&producto_id=1&producto_id=2
// Lo usa el calendario de /reservar. Solo reenvía la consulta a la API del backend.
import { NextResponse, type NextRequest } from "next/server";
import { api, ApiError } from "@/lib/api";
import type { Disponibilidad } from "@/lib/tipos";

export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams;
  try {
    const datos = await api<Disponibilidad>("/disponibilidad", {
      query: { mes: parametros.get("mes"), producto_id: parametros.getAll("producto_id") },
    });
    return NextResponse.json(datos);
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    return NextResponse.json({ error: "No se pudo consultar la disponibilidad." }, { status });
  }
}
