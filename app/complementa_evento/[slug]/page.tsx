import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ComplementoHero from "@/components/complementos/ComplementoHero";

import { COMPLEMENTOS, obtenerComplemento } from "@/lib/Complementos";
import ComplementoDescripcion from "@/components/complementos/ComplementoDescripcion";
import ComplementoPorque from "@/components/complementos/ComplementoPorque";
import OtrosComplementos from "@/components/complementos/OtrosComplementos";




type Props = { params: Promise<{ slug: string }> };

// Genera las 12 páginas al compilar
export function generateStaticParams() {
  return COMPLEMENTOS.map((c) => ({ slug: c.slug }));
}

// Título y descripción de cada página (pestaña del navegador y Google)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const complemento = obtenerComplemento(slug);
  if (!complemento) return {};

  return {
    title: `${complemento.titulo} | Miranda Magic Mirror`,
    description: complemento.descripcion,
  };
}

export default async function ComplementoPage({ params }: Props) {
  const { slug } = await params;
  const complemento = obtenerComplemento(slug);

  // Si el slug no existe, muestra la página 404
  if (!complemento) notFound();

  return (
    <>
      <Header />
            <main>
        <ComplementoHero complemento={complemento} />
        <ComplementoDescripcion complemento={complemento} />
        <ComplementoPorque complemento={complemento} />
        <OtrosComplementos slugActual={complemento.slug} />
      </main>
      <Footer mostrarLlamado={false}/>
    </>
  );
}