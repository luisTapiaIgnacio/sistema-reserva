"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { EstadoUnidad } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { exigirAdmin } from "@/lib/admin";
import { crearSlug } from "@/lib/slug";

const RUTA = "/admin/inventario";

export type EstadoForm = { error?: string; ok?: string };

// Devuelve un slug que no esté usado (agrega -2, -3… si hace falta)
async function slugLibre(base: string, tabla: "categoria" | "producto", excluirId?: number) {
  const inicio = base || "item";
  let slug = inicio;
  for (let n = 2; ; n++) {
    const existe =
      tabla === "categoria"
        ? await prisma.categoria.findUnique({ where: { slug } })
        : await prisma.producto.findUnique({ where: { slug } });
    if (!existe || existe.id === excluirId) return slug;
    slug = `${inicio}-${n}`;
  }
}

// ---------- Categorías ----------

export async function crearCategoria(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await exigirAdmin();
  const nombre = String(formData.get("nombre") ?? "").trim();
  if (nombre.length < 2) return { error: "Escribe el nombre de la categoría." };

  const slug = await slugLibre(crearSlug(nombre), "categoria");
  const total = await prisma.categoria.count();
  await prisma.categoria.create({ data: { nombre, slug, orden: total + 1 } });

  revalidatePath(RUTA);
  return { ok: `Categoría "${nombre}" creada.` };
}

export async function alternarCategoria(formData: FormData) {
  await exigirAdmin();
  const id = Number(formData.get("id"));
  const categoria = await prisma.categoria.findUnique({ where: { id } });
  if (!categoria) return;

  await prisma.categoria.update({ where: { id }, data: { activa: !categoria.activa } });
  revalidatePath(RUTA);
}

// ---------- Productos ----------

const productoSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe el nombre del producto."),
  categoriaId: z.coerce.number().int().positive("Elige una categoría."),
  precio: z.coerce.number().positive("El precio debe ser mayor a 0."),
  descripcion: z.string().trim(),
  imagen: z.string().trim(),
  activo: z.boolean(),
});

export async function guardarProducto(_prev: EstadoForm, formData: FormData): Promise<EstadoForm> {
  await exigirAdmin();

  const id = Number(formData.get("id")) || undefined; // vacío = producto nuevo
  const resultado = productoSchema.safeParse({
    nombre: String(formData.get("nombre") ?? ""),
    categoriaId: String(formData.get("categoriaId") ?? ""),
    precio: String(formData.get("precio") ?? ""),
    descripcion: String(formData.get("descripcion") ?? ""),
    imagen: String(formData.get("imagen") ?? ""),
    activo: formData.get("activo") === "on",
  });

  if (!resultado.success) {
    return { error: resultado.error.issues[0]?.message ?? "Revisa los datos." };
  }

  const d = resultado.data;
  const slug = await slugLibre(crearSlug(d.nombre), "producto", id);
  const datos = {
    nombre: d.nombre,
    slug,
    categoriaId: d.categoriaId,
    precio: d.precio,
    descripcion: d.descripcion || null,
    imagen: d.imagen || null,
    activo: d.activo,
  };

  if (id) {
    await prisma.producto.update({ where: { id }, data: datos });
  } else {
    await prisma.producto.create({ data: datos });
  }

  revalidatePath(RUTA);
  redirect(RUTA);
}

// ---------- Unidades ----------

export async function crearUnidad(formData: FormData) {
  await exigirAdmin();
  const productoId = Number(formData.get("productoId"));
  const producto = await prisma.producto.findUnique({
    where: { id: productoId },
    include: { unidades: { select: { codigo: true }, take: 1 } },
  });
  if (!producto) return;

  // Prefijo: el de sus unidades actuales (ESP) o 3 letras del nombre
  const prefijo =
    producto.unidades[0]?.codigo.split("-")[0] ||
    crearSlug(producto.nombre).replace(/-/g, "").slice(0, 3).toUpperCase() ||
    "UNI";

  // Siguiente número libre para ese prefijo (ESP-005)
  const existentes = await prisma.unidad.findMany({
    where: { codigo: { startsWith: `${prefijo}-` } },
    select: { codigo: true },
  });
  const mayor = existentes.reduce((max, u) => {
    const n = Number(u.codigo.split("-")[1]);
    return Number.isFinite(n) && n > max ? n : max;
  }, 0);
  const codigo = `${prefijo}-${String(mayor + 1).padStart(3, "0")}`;

  await prisma.unidad.create({ data: { codigo, productoId } });
  revalidatePath(RUTA);
}

export async function cambiarEstadoUnidad(formData: FormData) {
  await exigirAdmin();
  const id = Number(formData.get("id"));
  const estado = String(formData.get("estado"));

  if (!Object.values(EstadoUnidad).includes(estado as EstadoUnidad)) return;

  await prisma.unidad.update({ where: { id }, data: { estado: estado as EstadoUnidad } });
  revalidatePath(RUTA);
}
