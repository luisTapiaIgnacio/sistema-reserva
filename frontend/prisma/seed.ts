// Datos de prueba: categorías, productos y unidades.
// Ejecutar con: npx prisma db seed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Categorías
  const espejos = await prisma.categoria.upsert({
    where: { slug: "espejos" },
    update: {},
    create: { nombre: "Espejos", slug: "espejos", orden: 1 },
  });

  await prisma.categoria.upsert({
    where: { slug: "cabinas-360" },
    update: {},
    create: { nombre: "Cabinas 360°", slug: "cabinas-360", orden: 2 },
  });

  // Productos con sus unidades (código = prefijo + número)
  const productos = [
    { nombre: "Espejo Mágico 65″", slug: "espejo-magico-65", precio: 650, prefijo: "ESP", unidades: 4 },
    { nombre: "Espejo Mágico Premium", slug: "espejo-magico-premium", precio: 890, prefijo: "PRE", unidades: 2 },
    { nombre: "Espejo Mini Selfie", slug: "espejo-mini-selfie", precio: 420, prefijo: "MIN", unidades: 3 },
  ];

  for (const p of productos) {
    const producto = await prisma.producto.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        nombre: p.nombre,
        slug: p.slug,
        precio: p.precio,
        categoriaId: espejos.id,
      },
    });

    for (let i = 1; i <= p.unidades; i++) {
      const codigo = `${p.prefijo}-${String(i).padStart(3, "0")}`; // ESP-001
      await prisma.unidad.upsert({
        where: { codigo },
        update: {},
        create: { codigo, productoId: producto.id },
      });
    }
  }

  console.log("✅ Datos de prueba cargados");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());