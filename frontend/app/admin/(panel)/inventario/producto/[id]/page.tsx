import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { apiAdmin, exigirAdmin } from "@/lib/admin";
import { ApiError } from "@/lib/api";
import type { CategoriaAdmin, ProductoAdmin } from "@/lib/tipos";
import ProductoForm, { type ProductoInicial } from "@/components/admin/ProductoForm";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string }>;
};

// /admin/inventario/producto/nuevo  → crear
// /admin/inventario/producto/3      → editar
export default async function ProductoPage({ params, searchParams }: Props) {
  const usuario = await exigirAdmin();
  if (usuario.rol !== "ADMIN") redirect("/admin"); // el inventario es solo del administrador
  const { id } = await params;
  const { categoria } = await searchParams;

  const categorias = await apiAdmin<CategoriaAdmin[]>("/admin/categorias");

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
    let encontrado: ProductoAdmin;
    try {
      encontrado = await apiAdmin<ProductoAdmin>(`/admin/productos/${Number(id) || 0}`);
    } catch (e) {
      if (e instanceof ApiError && (e.status === 404 || e.status === 422)) notFound();
      throw e;
    }
    producto = {
      id: encontrado.id,
      nombre: encontrado.nombre,
      categoriaId: encontrado.categoria_id,
      precio: String(encontrado.precio),
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
        <ProductoForm categorias={categorias.map(({ id, nombre }) => ({ id, nombre }))} producto={producto} />
      )}
    </div>
  );
}
