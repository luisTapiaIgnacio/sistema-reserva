// Sesión del admin: un token firmado guardado en una cookie segura.
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const COOKIE_SESION = "miranda_admin";
const DURACION_SEGUNDOS = 60 * 60 * 24 * 7; // 7 días

export type Sesion = { id: number; nombre: string; rol: string };

function clave() {
  const secreto = process.env.SESSION_SECRET;
  if (!secreto) throw new Error("Falta SESSION_SECRET en el archivo .env");
  return new TextEncoder().encode(secreto);
}

export async function crearSesion(datos: Sesion) {
  const token = await new SignJWT({ ...datos })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(clave());

  const almacen = await cookies();
  almacen.set(COOKIE_SESION, token, {
    httpOnly: true, // JavaScript del navegador no puede leerla
    secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
    sameSite: "lax",
    path: "/",
    maxAge: DURACION_SEGUNDOS,
  });
}

export async function leerSesion(): Promise<Sesion | null> {
  const token = (await cookies()).get(COOKIE_SESION)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave());
    return payload as unknown as Sesion;
  } catch {
    return null; // token vencido o alterado
  }
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE_SESION);
}