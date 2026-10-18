// Sesión del panel: el token que entrega la API se guarda en una cookie segura.
// El navegador la envía sola, pero JavaScript no puede leerla (httpOnly).
import "server-only";
import { cookies } from "next/headers";

export const COOKIE_SESION = "miranda_admin";

export async function guardarToken(token: string, expiraEn: string) {
  const segundos = Math.max(0, Math.floor((new Date(expiraEn).getTime() - Date.now()) / 1000));
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // solo HTTPS en producción
    sameSite: "lax",
    path: "/",
    maxAge: segundos, // vence junto con el token
  });
}

export async function leerToken(): Promise<string | null> {
  return (await cookies()).get(COOKIE_SESION)?.value ?? null;
}

export async function borrarToken() {
  (await cookies()).delete(COOKIE_SESION);
}
