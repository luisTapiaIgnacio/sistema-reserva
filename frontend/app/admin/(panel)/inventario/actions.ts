"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiAdmin, mensajeError } from "@/lib/admin";
import type { ProductoAdmin } from "@/lib/tipos";

const RUTA = "/admin/inventario";

export type EstadoForm = { error?: string; ok?: string };

// Vuelve al inventario mostrando un aviso (verde) o un error (rojo)
function volver(mensaje: string, tipo: "ok" | "error" = "ok"): never {
  revalidatePath(RUTA);
  redirect(`${RUTA}?${tipo}=${encodeURIComponent(mensaje)}`);
}

// ---------- Categorías ----------

export async function crearCategoria(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (nombre.length < 2) return { error: "Escribe el nombre de la categoría." };
  try {
    await apiAdmin("/admin/categorias", { metodo: "POST", cuerpo: { nombre } });
  } catch (e) {
    return { error: mensajeError(e) };
  }
  revalidatePath(RUTA);
  return { ok: `Categoría "${nombre}" creada.` };
}

export async function alternarCategoria(formData: FormData) {
  const id = Number(formData.get("id"));
  const activa = formData.get("activa") === "true";
  try {
    await apiAdmin(`/admin/categorias/${id}`, { metodo: "PATCH", cuerpo: { activa: !activa } });
  } catch (e) {
    volver(mensajeError(e), "error");
  }
  volver(activa ? "Categoría oculta de la web." : "Categoría visible en la web.");
}

// ---------- Productos ----------

export async function guardarProducto(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const id = Number(formData.get("id")) || undefined; // vacío = producto nuevo
  const datos = {
    nombre: String(formData.get("nombre") ?? ""),
    categoria_id: Number(formData.get("categoriaId")),
    precio: String(formData.get("precio") ?? ""),
    descripcion: String(formData.get("descripcion") ?? ""),
    imagen: String(formData.get("imagen") ?? ""),
    activo: formData.get("activo") === "on",
  };
  if (!datos.precio) return { error: "Escribe el precio." };

  let producto: ProductoAdmin;
  try {
    producto = id
      ? await apiAdmin<ProductoAdmin>(`/admin/productos/${id}`, { metodo: "PATCH", cuerpo: datos })
      : await apiAdmin<ProductoAdmin>("/admin/productos", { metodo: "POST", cuerpo: datos });
  } catch (e) {
    return { error: mensajeError(e) };
  }
  volver(id ? `"${producto.nombre}" guardado.` : `"${producto.nombre}" creado. Agrégale unidades.`);
}

// ---------- Unidades ----------

export async function crearUnidad(formData: FormData) {
  const productoId = Number(formData.get("productoId"));
  let producto: ProductoAdmin;
  try {
    producto = await apiAdmin<ProductoAdmin>(`/admin/productos/${productoId}/unidades`, {
      metodo: "POST",
      cuerpo: { cantidad: 1 },
    });
  } catch (e) {
    volver(mensajeError(e), "error");
  }
  volver(`Unidad ${producto.unidades.at(-1)?.codigo ?? ""} agregada.`);
}

export async function cambiarEstadoUnidad(formData: FormData) {
  const id = Number(formData.get("id"));
  const estado = String(formData.get("estado"));
  try {
    await apiAdmin(`/admin/unidades/${id}`, { metodo: "PATCH", cuerpo: { estado } });
  } catch (e) {
    // Ej.: está asignada a un evento confirmado
    volver(mensajeError(e), "error");
  }
  revalidatePath(RUTA);
}
