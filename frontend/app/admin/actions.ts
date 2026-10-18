"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { crearSesion, cerrarSesion } from "@/lib/sesion";

export type EstadoLogin = { error?: string };

export async function iniciarSesion(
  _estadoAnterior: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Escribe tu correo y contraseña." };
  }

  const usuario = await prisma.usuario.findUnique({ where: { email } });
  const correcta = usuario ? await bcrypt.compare(password, usuario.passwordHash) : false;

  // Mismo mensaje en ambos casos: no revela si el correo existe
  if (!usuario || !correcta) {
    return { error: "Correo o contraseña incorrectos." };
  }

  await crearSesion({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol });
  redirect("/admin");
}

export async function salir() {
  await cerrarSesion();
  redirect("/admin/login");
}