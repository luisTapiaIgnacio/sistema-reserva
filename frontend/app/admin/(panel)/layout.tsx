import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { exigirAdmin } from "@/lib/admin";

// Todas las páginas dentro de (panel) llevan el menú del admin
export default async function PanelLayout({ children }: { children: ReactNode }) {
  const usuario = await exigirAdmin();
  return (
    <AdminShell nombre={usuario.nombre} rol={usuario.rol}>
      {children}
    </AdminShell>
  );
}
