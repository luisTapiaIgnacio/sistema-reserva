// GET /api/admin/novedades → resumen pequeño que el panel consulta cada 15 s
// Reenvía la consulta a la API con el token de la sesión (la cookie no es legible desde el navegador).
import { NextResponse } from "next/server";
import { api, ApiError } from "@/lib/api";
import { leerToken } from "@/lib/sesion";
import type { Novedades } from "@/lib/tipos";

export async function GET() {
  const token = await leerToken();
  if (!token) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    return NextResponse.json(await api<Novedades>("/admin/novedades", { token }));
  } catch (e) {
    const status = e instanceof ApiError ? e.status : 500;
    return NextResponse.json({ error: "No se pudo consultar." }, { status });
  }
}
