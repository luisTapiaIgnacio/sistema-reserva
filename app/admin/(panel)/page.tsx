import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";

export default async function ResumenPage() {
  const sesion = await exigirAdmin();

  const [categorias, productos, operativas, mantenimiento] = await Promise.all([
    prisma.categoria.count(),
    prisma.producto.count({ where: { activo: true } }),
    prisma.unidad.count({ where: { estado: "OPERATIVA" } }),
    prisma.unidad.count({ where: { estado: "MANTENIMIENTO" } }),
  ]);

  const tarjetas = [
    { label: "Categorías", valor: categorias },
    { label: "Productos activos", valor: productos },
    { label: "Unidades operativas", valor: operativas },
    { label: "En mantenimiento", valor: mantenimiento, alerta: mantenimiento > 0 },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <p className="text-sm text-white/60">Panel administrador</p>
      <h1 className="mt-1 font-krona text-xl text-white! md:text-2xl">
        Hola, <span className="text-[#f5c542]">{sesion.nombre}</span>
      </h1>

      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tarjetas.map((t) => (
          <div
            key={t.label}
            className={`rounded-2xl border bg-[#0d1b2a] p-4 ${t.alerta ? "border-amber-400/40" : "border-white/10"}`}
          >
            <p className="text-xs text-white/60">{t.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${t.alerta ? "text-amber-400" : ""}`}>{t.valor}</p>
          </div>
        ))}
      </div>

      <Link
        href="/admin/inventario"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#f5c542] px-5 py-3 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8]"
      >
        Ir al inventario
        <i className="fa-solid fa-arrow-right" aria-hidden="true" />
      </Link>
    </div>
  );
}
