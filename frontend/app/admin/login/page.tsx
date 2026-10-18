import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import { leerSesion } from "@/lib/sesion";

export default async function LoginPage() {
  // Si ya inició sesión, va directo al panel
  if (await leerSesion()) redirect("/admin");

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#02152b] px-5 py-12 font-poppins">
      {/* Puntitos y destellos */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:24px_24px]" />
      <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#f5c542]/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#0054ef]/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d1b2a]/90 p-7 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-9">
        <div className="mb-8 text-center">
          <Image
            src="/images/nova-btl/logo-mirada.png"
            alt="Miranda Magic Mirror"
            width={180}
            height={50}
            className="mx-auto h-auto max-h-16 w-auto"
            priority
          />
          <h1 className="mt-5 font-krona text-lg tracking-wide text-white!">
            Panel <span className="text-[#f5c542]">administrador</span>
          </h1>
          <p className="mt-2 text-sm text-white/60">Ingresa para gestionar reservas e inventario.</p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}