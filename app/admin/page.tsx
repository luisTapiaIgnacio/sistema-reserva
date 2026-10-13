import { redirect } from "next/navigation";
import { leerSesion } from "@/lib/sesion";
import { salir } from "./actions";

export default async function AdminPage() {
  const sesion = await leerSesion();
  if (!sesion) redirect("/admin/login"); // segunda protección, además del proxy

  return (
    <main className="min-h-screen bg-[#071a30] px-5 py-10 font-poppins text-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/60">Panel administrador</p>
          <h1 className="mt-1 font-krona text-xl text-white!">
            Hola, <span className="text-[#f5c542]">{sesion.nombre}</span>
          </h1>
        </div>

        <form action={salir}>
          <button
            type="submit"
            className="cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-sm text-white/80 transition-colors hover:border-[#f5c542] hover:text-white"
          >
            Cerrar sesión
          </button>
        </form>
      </div>

      <p className="mx-auto mt-10 max-w-4xl text-white/60">
        Aquí irán las reservas y el inventario (pasos 3 y 6).
      </p>
    </main>
  );
}