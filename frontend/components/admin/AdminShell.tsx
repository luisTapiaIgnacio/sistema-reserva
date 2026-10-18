"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { salir } from "@/app/admin/actions";
import { useNovedades } from "./useNovedades";

type ItemMenu = { href: string; label: string; icon: string; pronto?: boolean };

const MENU: ItemMenu[] = [
  { href: "/admin", label: "Resumen", icon: "fa-solid fa-chart-simple" },
  { href: "/admin/reservas", label: "Reservas", icon: "fa-regular fa-calendar-check" },
  { href: "/admin/inventario", label: "Inventario", icon: "fa-solid fa-boxes-stacked" },
];

export default function AdminShell({ nombre, children }: { nombre: string; children: ReactNode }) {
  const pathname = usePathname();
  const activo = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const { pendientes, avisos, permiso, pedirPermiso, cerrarAviso } = useNovedades();

  // Número de pendientes junto a "Reservas"
  const insignia = (href: string) =>
    href === "/admin/reservas" && pendientes > 0 ? (
      <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-[#02152b]">{pendientes}</span>
    ) : null;

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
                {insignia(item.href)}
              </Link>
            )
          )}
        </nav>

        {/* Activar notificaciones del navegador */}
        {permiso === "default" && (
          <button
            type="button"
            onClick={pedirPermiso}
            className="mb-4 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-[#f5c542]/40 px-3 py-2.5 text-left text-xs text-[#ffe9a8] hover:bg-[#f5c542]/10"
          >
            <i className="fa-regular fa-bell w-4" aria-hidden="true" />
            Activar notificaciones
          </button>
        )}

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
        <div className="flex items-center gap-1">
          {permiso === "default" && (
            <button
              type="button"
              onClick={pedirPermiso}
              aria-label="Activar notificaciones"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-[#ffe9a8] hover:bg-white/5"
            >
              <i className="fa-regular fa-bell" aria-hidden="true" />
            </button>
          )}
          <form action={salir}>
            <button type="submit" aria-label="Cerrar sesión" className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl text-white/70 hover:bg-white/5">
              <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true" />
            </button>
          </form>
        </div>
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
            className={`relative flex flex-col items-center gap-1 py-3 text-[11px] ${
              item.pronto ? "pointer-events-none text-white/25" : activo(item.href) ? "text-[#f5c542]" : "text-white/60"
            }`}
          >
            <span className="relative">
              <i className={`${item.icon} text-base`} aria-hidden="true" />
              {item.href === "/admin/reservas" && pendientes > 0 && (
                <span className="absolute -right-3 -top-1.5 rounded-full bg-amber-400 px-1.5 text-[9px] font-bold leading-4 text-[#02152b]">
                  {pendientes}
                </span>
              )}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* ---------- Avisos emergentes ---------- */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-24 z-50 flex flex-col items-end gap-2 md:bottom-6 md:left-auto md:right-6"
      >
        {avisos.map((a) => (
          <div
            key={a.id}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-[#f5c542]/40 bg-[#0d1b2a] px-4 py-3 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.7)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5c542]/15 text-[#f5c542]">
              <i className="fa-solid fa-bell" aria-hidden="true" />
            </span>
            <Link href={a.href} onClick={() => cerrarAviso(a.id)} className="min-w-0 flex-1 text-sm font-medium text-white hover:text-[#ffe9a8]">
              {a.texto}
            </Link>
            <button
              type="button"
              aria-label="Cerrar aviso"
              onClick={() => cerrarAviso(a.id)}
              className="cursor-pointer text-white/40 hover:text-white"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}