// Protege todas las rutas /admin: sin sesión válida, redirige al login.
// (En Next.js 16 este archivo se llama proxy.ts; antes era middleware.ts)
import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // El login siempre es accesible
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get("miranda_admin")?.value;

  if (token && process.env.SESSION_SECRET) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
      return NextResponse.next(); // sesión válida
    } catch {
      // token vencido o alterado: cae al redirect de abajo
    }
  }

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*"],
};