import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservaWizard from "@/components/reservar/ReservaWizard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Reservar | Miranda Magic Mirror",
  description: "Elige tu espejo, revisa la disponibilidad y separa tu fecha en minutos.",
};

export const dynamic = "force-dynamic"; // el inventario puede cambiar en cualquier momento

export default async function ReservarPage() {
  const categorias = await prisma.categoria.findMany({
    where: { activa: true, productos: { some: { activo: true } } },
    orderBy: { orden: "asc" },
    select: { id: true, nombre: true },
  });

  const productos = await prisma.producto.findMany({
    where: { activo: true, categoria: { activa: true } },
    orderBy: { nombre: "asc" },
    include: { _count: { select: { unidades: { where: { estado: "OPERATIVA" } } } } },
  });

  return (
    <>
      <Header />
      <main>
        <ReservaWizard
          categorias={categorias}
          productos={productos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            descripcion: p.descripcion,
            precio: Number(p.precio), // Decimal → número para el cliente
            imagen: p.imagen,
            categoriaId: p.categoriaId,
            operativas: p._count.unidades,
          }))}
        />
      </main>
      <Footer mostrarLlamado={false} />
    </>
  );
}
