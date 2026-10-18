-- CreateEnum
CREATE TYPE "TipoProducto" AS ENUM ('ALQUILER', 'SERVICIO');

-- CreateEnum
CREATE TYPE "EstadoUnidad" AS ENUM ('OPERATIVA', 'MANTENIMIENTO', 'BAJA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "CanalPago" AS ENUM ('WHATSAPP', 'YAPE_PLIN', 'TRANSFERENCIA');

-- CreateEnum
CREATE TYPE "MetodoPago" AS ENUM ('YAPE', 'PLIN', 'TRANSFERENCIA', 'EFECTIVO');

-- CreateEnum
CREATE TYPE "OrigenPago" AS ENUM ('WEB', 'WHATSAPP', 'ADMIN');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('POR_VERIFICAR', 'VERIFICADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'OPERADOR');

-- CreateTable
CREATE TABLE "Categoria" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producto" (
    "id" SERIAL NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "tipo" "TipoProducto" NOT NULL DEFAULT 'ALQUILER',
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "imagen" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Unidad" (
    "id" SERIAL NOT NULL,
    "productoId" INTEGER NOT NULL,
    "codigo" TEXT NOT NULL,
    "estado" "EstadoUnidad" NOT NULL DEFAULT 'OPERATIVA',
    "notas" TEXT,

    CONSTRAINT "Unidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "celular" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "tokenAcceso" TEXT NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "horario" TEXT,
    "distrito" TEXT,
    "direccion" TEXT,
    "tipoEvento" TEXT,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "canalPago" "CanalPago",
    "total" DECIMAL(10,2) NOT NULL,
    "adelanto" DECIMAL(10,2) NOT NULL,
    "expiraEn" TIMESTAMP(3),
    "notas" TEXT,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaItem" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnitario" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ReservaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "id" SERIAL NOT NULL,
    "reservaItemId" INTEGER NOT NULL,
    "unidadId" INTEGER NOT NULL,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pago" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "metodo" "MetodoPago" NOT NULL,
    "origen" "OrigenPago" NOT NULL DEFAULT 'WEB',
    "numeroOperacion" TEXT,
    "comprobanteUrl" TEXT,
    "estado" "EstadoPago" NOT NULL DEFAULT 'POR_VERIFICAR',
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");

-- CreateIndex
CREATE INDEX "Producto_categoriaId_idx" ON "Producto"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "Unidad_codigo_key" ON "Unidad"("codigo");

-- CreateIndex
CREATE INDEX "Unidad_productoId_idx" ON "Unidad"("productoId");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_celular_key" ON "Cliente"("celular");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_codigo_key" ON "Reserva"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Reserva_tokenAcceso_key" ON "Reserva"("tokenAcceso");

-- CreateIndex
CREATE INDEX "Reserva_estado_fechaInicio_fechaFin_idx" ON "Reserva"("estado", "fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "Reserva_clienteId_idx" ON "Reserva"("clienteId");

-- CreateIndex
CREATE INDEX "ReservaItem_reservaId_idx" ON "ReservaItem"("reservaId");

-- CreateIndex
CREATE INDEX "ReservaItem_productoId_idx" ON "ReservaItem"("productoId");

-- CreateIndex
CREATE INDEX "Asignacion_unidadId_idx" ON "Asignacion"("unidadId");

-- CreateIndex
CREATE UNIQUE INDEX "Asignacion_reservaItemId_unidadId_key" ON "Asignacion"("reservaItemId", "unidadId");

-- CreateIndex
CREATE UNIQUE INDEX "Pago_numeroOperacion_key" ON "Pago"("numeroOperacion");

-- CreateIndex
CREATE INDEX "Pago_reservaId_idx" ON "Pago"("reservaId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Producto" ADD CONSTRAINT "Producto_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Unidad" ADD CONSTRAINT "Unidad_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaItem" ADD CONSTRAINT "ReservaItem_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaItem" ADD CONSTRAINT "ReservaItem_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_reservaItemId_fkey" FOREIGN KEY ("reservaItemId") REFERENCES "ReservaItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_unidadId_fkey" FOREIGN KEY ("unidadId") REFERENCES "Unidad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pago" ADD CONSTRAINT "Pago_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;
