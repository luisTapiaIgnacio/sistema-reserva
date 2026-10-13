"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { salir } from "@/app/admin/actions";

const MENU = [
  { href: "/admin", label: "Resumen", icon: "fa-solid fa-chart-simple" },
  { href: "/admin/reservas", label: "Reservas", icon: "fa-regular fa-calendar-check", pronto: true },
  { href: "/admin/inventario", label: "Inventario", icon: "fa-solid fa-boxes-stacked" },
];

export default function AdminShell({ nombre, children }: { nombre: string; children: ReactNode }) {
  const pathname = usePathname();
  const activo = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-screen bg-[#071a30] font-poppins text-white md:flex">
      {/* ---------- Menú lateral (monitor) ---------- */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-[#02152b] p-4 md:flex">
        <Link href="/admin" className="mb-8 block px-2 pt-2">
          <Image src="/images/nova-btl/logo-mirada.png" alt="Miranda" width={150} height={42} className="h-auto max-h-12 w-auto" />
        </Link>

        <nav className="flex flex-1 flex-col gap-1">
          {MENU.map((item) =>
            item.pronto ? (
              <span key={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/30">
                <i className={`${item.icon} w-4`} aria-hidden="true" />
                {item.label}
                <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[10px]">Pronto</span>
              </span>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  activo(item.href) ? "bg-[#f5c542]/15 text-[#f5c542]" : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <i className={`${item.icon} w-4`} aria-hidden="true" />
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="border-t border-white/10 pt-4">
          <p className="px-3 text-xs text-white/50">Sesión de</p>
          <p className="truncate px-3 text-sm font-medium">{nombre}</p>
          <form action={salir} className="mt-3">
            <button type="submit" className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white">
              <i className="fa-solid fa-arrow-right-from-bracket w-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* ---------- Barra superior (celular) ---------- */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#02152b]/95 px-4 py-3 backdrop-blur md:hidden">
        <Image src="/images/nova-btl/logo-mirada.png" alt="Miranda" width={110} height={30} className="h-auto max-h-9 w-auto" />
        <form action={salir}>
          <button type="submit" aria-label="Cerrar sesión" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-white/70 hover:bg-white/5">
            <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
          </button>
        </form>
      </header>

      {/* ---------- Contenido ---------- */}
      <main className="min-w-0 flex-1 px-4 pb-28 pt-6 md:px-8 md:pb-10 md:pt-8">{children}</main>

      {/* ---------- Barra inferior (celular) ---------- */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-white/10 bg-[#02152b]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.pronto ? "#" : item.href}
            aria-disabled={item.pronto}
            className={`flex flex-col items-center gap-1 py-3 text-[11px] ${
              item.pronto ? "pointer-events-none text-white/25" : activo(item.href) ? "text-[#f5c542]" : "text-white/60"
            }`}
          >
            <i className={`${item.icon} text-base`} aria-hidden="true" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
