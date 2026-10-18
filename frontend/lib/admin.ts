// Acceso del panel a la API con la sesión del usuario.
import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { api, ApiError } from "./api";
import { leerToken } from "./sesion";
import type { Usuario } from "./tipos";

type Opciones = Parameters<typeof api>[1];

// Llama a la API como el usuario conectado. Si la sesión venció, vuelve al login.
export async function apiAdmin<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const token = await leerToken();
  if (!token) redirect("/admin/login");
  try {
    return await api<T>(ruta, { ...opciones, token });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) redirect("/admin/login");
    throw e;
  }
}

// Usuario conectado, o null si no hay sesión válida.
// cache(): el layout y la página lo piden en la misma visita, pero se consulta una vez.
export const usuarioActual = cache(async (): Promise<Usuario | null> => {
  const token = await leerToken();
  if (!token) return null;
  try {
    return await api<Usuario>("/admin/yo", { token });
  } catch (e) {
    if (e instanceof ApiError && e.status === 401) return null;
    throw e;
  }
});

// Úsalo al inicio de cada página del panel.
export async function exigirAdmin(): Promise<Usuario> {
  const usuario = await usuarioActual();
  if (!usuario) redirect("/admin/login");
  return usuario;
}

// Mensaje para mostrar al usuario a partir de un error de la API.
export function mensajeError(e: unknown): string {
  if (e instanceof ApiError) return e.message;
  throw e; // errores inesperados (o el redirect de Next.js) siguen su curso
}
