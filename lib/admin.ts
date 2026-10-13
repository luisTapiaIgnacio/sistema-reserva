import { redirect } from "next/navigation";
import { leerSesion } from "./sesion";

// Úsalo al inicio de cada página o acción del panel
export async function exigirAdmin() {
  const sesion = await leerSesion();
  if (!sesion) redirect("/admin/login");
  return sesion;
}
