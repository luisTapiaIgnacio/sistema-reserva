// Una sola instancia de Prisma para toda la app
// (evita abrir conexiones de más en desarrollo con el recargado en caliente)
import { PrismaClient } from "@prisma/client";

const globalParaPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalParaPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalParaPrisma.prisma = prisma;