import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/Pagebanner";
import NosotrosExperiencia from "@/components/sobreNosotros/NosotrosExperiencia";
import NosotrosPorQue from "@/components/sobreNosotros/NosotrosPorQue";
import NosotrosProceso from "@/components/sobreNosotros/NosotrosProceso";

export const metadata: Metadata = {
  title: "Sobre nosotros | Miranda Magic Mirror",
  description: "Conoce al equipo de Miranda Magic Mirror y cómo hacemos de cada evento un recuerdo inolvidable.",
};

export default function SobreNosotrosPage() {
  return (
    <>
      <Header />
      <main>
        <PageBanner titulo="Sobre nosotros" ruta="Sobre nosotros" />
        <NosotrosExperiencia />
        <NosotrosPorQue />
        <NosotrosProceso />
      </main>
      <Footer />
    </>
  );
}
