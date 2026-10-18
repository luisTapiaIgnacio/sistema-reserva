// Protege todas las rutas /admin: sin cookie de sesión, redirige al login.
// (En Next.js 16 este archivo se llama proxy.ts; antes era middleware.ts)
// Aquí solo se mira que exista la cookie: la API valida el token en cada petición
// y, si venció, las páginas del panel también mandan al login.
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_SESION = "miranda_admin";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) return NextResponse.next();
  if (request.cookies.has(COOKIE_SESION)) return NextResponse.next();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};
