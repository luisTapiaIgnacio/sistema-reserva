import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservaWizard from "@/components/reservar/ReservaWizard";
import { api } from "@/lib/api";
import type { Categoria, Configuracion, Producto } from "@/lib/tipos";

export const metadata: Metadata = {
  title: "Reservar | Miranda Magic Mirror",
  description: "Elige tus espejos, revisa la disponibilidad y separa tu fecha en minutos.",
};

export const dynamic = "force-dynamic"; // el inventario puede cambiar en cualquier momento

export default async function ReservarPage() {
  const [categorias, productos, configuracion] = await Promise.all([
    api<Categoria[]>("/categorias"),
    api<Producto[]>("/productos"),
    api<Configuracion>("/configuracion"),
  ]);

  return (
    <>
      <Header />
      <main>
        <ReservaWizard
          categorias={categorias}
          productos={productos}
          horasParaPagar={configuracion.horas_para_pagar}
          porcentajeAdelanto={configuracion.porcentaje_adelanto}
        />
      </main>
      <Footer mostrarLlamado={false} />
    </>
  );
}
