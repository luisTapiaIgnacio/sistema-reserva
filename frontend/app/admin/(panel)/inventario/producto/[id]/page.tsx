import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import ProductoForm, { type ProductoInicial } from "@/components/admin/ProductoForm";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string }>;
};

// /admin/inventario/producto/nuevo  → crear
// /admin/inventario/producto/3      → editar
export default async function ProductoPage({ params, searchParams }: Props) {
  await exigirAdmin();
  const { id } = await params;
  const { categoria } = await searchParams;

  const categorias = await prisma.categoria.findMany({
    orderBy: { orden: "asc" },
    select: { id: true, nombre: true },
  });

  let producto: ProductoInicial;

  if (id === "nuevo") {
    producto = {
      nombre: "",
      categoriaId: Number(categoria) || categorias[0]?.id,
      precio: "",
      descripcion: "",
      imagen: "",
      activo: true,
    };
  } else {
    const encontrado = await prisma.producto.findUnique({ where: { id: Number(id) || 0 } });
    if (!encontrado) notFound();
    producto = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      categoriaId: encontrado.categoriaId,
      precio: encontrado.precio.toString(), // Decimal → texto (no se puede pasar Decimal al cliente)
      descripcion: encontrado.descripcion ?? "",
      imagen: encontrado.imagen ?? "",
      activo: encontrado.activo,
    };
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/admin/inventario" className="text-sm text-white/60 hover:text-white">
        ← Inventario
      </Link>
      <h1 className="mb-6 mt-2 font-krona text-xl text-white!">
        {producto.id ? "Editar producto" : "Nuevo producto"}
      </h1>

      {categorias.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/15 p-6 text-white/60">
          Primero crea una categoría en el inventario.
        </p>
      ) : (
        <ProductoForm categorias={categorias} producto={producto} />
      )}
    </div>
  );
}
