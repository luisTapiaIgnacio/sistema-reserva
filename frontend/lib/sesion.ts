// Sesión del panel: el token que entrega la API se guarda en una cookie segura.
// El navegador la envía sola, pero JavaScript no puede leerla (httpOnly).
import "server-only";
import { cookies } from "next/headers";

export const COOKIE_SESION = "miranda_admin";

// En producción la cookie viaja solo por HTTPS. Para probar por http en la red local
// (ej. http://192.168.1.50:3000) se puede desactivar con COOKIE_SECURE=false.
const COOKIE_SEGURA = process.env.COOKIE_SECURE
  ? process.env.COOKIE_SECURE === "true"
  : process.env.NODE_ENV === "production";

export async function guardarToken(token: string, expiraEn: string) {
  const segundos = Math.max(0, Math.floor((new Date(expiraEn).getTime() - Date.now()) / 1000));
  (await cookies()).set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: COOKIE_SEGURA,
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
