"use client";

import { useActionState } from "react";
import { iniciarSesion, type EstadoLogin } from "@/app/admin/actions";


const estadoInicial: EstadoLogin = {};

export default function LoginForm() {
  const [estado, accion, cargando] = useActionState(iniciarSesion, estadoInicial);

  return (
    <form action={accion} className="space-y-5">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white/80">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={estado.email}
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#f5c542]"
          placeholder="admin@miranda.pe"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white/80">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none transition-colors focus:border-[#f5c542]"
        />
      </div>

      {estado.error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {estado.error}
        </p>
      )}

      <button
        type="submit"
        disabled={cargando}
        className="w-full cursor-pointer rounded-xl bg-[#f5c542] py-3.5 text-sm font-semibold text-[#02152b] transition-all duration-300 hover:bg-[#ffe9a8] disabled:cursor-wait disabled:opacity-60"
      >
        {cargando ? "Ingresando…" : "Ingresar"}
      </button>
    </form>
  );
}