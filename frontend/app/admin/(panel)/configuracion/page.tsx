import { redirect } from "next/navigation";
import ConfiguracionForm from "@/components/admin/ConfiguracionForm";
import { apiAdmin, exigirAdmin } from "@/lib/admin";
import type { Configuracion } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  const usuario = await exigirAdmin();
  if (usuario.rol !== "ADMIN") redirect("/admin"); // los ajustes son solo del administrador

  const configuracion = await apiAdmin<Configuracion>("/admin/configuracion");

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm text-white/60">Panel administrador</p>
      <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">Ajustes</h1>
      <p className="mt-2 text-sm text-white/60">
        Los cambios se aplican a las reservas nuevas. Las que ya existen conservan su plazo y adelanto.
      </p>
      <ConfiguracionForm configuracion={configuracion} />
    </div>
  );
}
