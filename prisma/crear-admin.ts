// Crea (o actualiza) el usuario administrador.
// Uso: npx tsx prisma/crear-admin.ts correo@ejemplo.com "TuContraseña" "Nombre"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const [correo, password, nombre = "Administrador"] = process.argv.slice(2);

  if (!correo || !password) {
    console.log('Uso: npx tsx prisma/crear-admin.ts correo@ejemplo.com "TuContraseña" "Nombre"');
    process.exit(1);
  }
  if (password.length < 8) {
    console.log("❌ La contraseña debe tener al menos 8 caracteres");
    process.exit(1);
  }

  const email = correo.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12); // se guarda cifrada, nunca en texto

  await prisma.usuario.upsert({
    where: { email },
    update: { passwordHash, nombre },
    create: { email, passwordHash, nombre },
  });

  console.log(`✅ Admin listo: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());