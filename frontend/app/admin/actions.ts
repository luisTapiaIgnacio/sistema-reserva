"use server";

import { redirect } from "next/navigation";
import { api } from "@/lib/api";
import { mensajeError } from "@/lib/admin";
import { borrarToken, guardarToken } from "@/lib/sesion";
import type { Sesion } from "@/lib/tipos";

export type EstadoLogin = { error?: string };

export async function iniciarSesion(_estadoAnterior: EstadoLogin, formData: FormData): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Escribe tu correo y contraseña." };

  try {
    const sesion = await api<Sesion>("/admin/login", { metodo: "POST", cuerpo: { email, password } });
    await guardarToken(sesion.access_token, sesion.expira_en);
  } catch (e) {
    return { error: mensajeError(e) };
  }
  redirect("/admin");
}

export async function salir() {
  await borrarToken();
  redirect("/admin/login");
}
