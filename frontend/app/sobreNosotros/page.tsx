import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/Pagebanner";
import NosotrosExperiencia from "@/components/sobreNosotros/NosotrosExperiencia";
import NosotrosPorQue from "@/components/sobreNosotros/NosotrosPorQue";
import NosotrosProceso from "@/components/sobreNosotros/NosotrosProceso";

import NosotrosIntro from "@/components/sobreNosotros/NosotrosIntro";
import NosotrosServiciosBTL from "@/components/sobreNosotros/NosotrosServiciosBTL";
import NosotrosAmbientacion from "@/components/sobreNosotros/NosotrosAmbientacion";

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
        <NosotrosIntro />
<NosotrosServiciosBTL />
<NosotrosAmbientacion />
        <NosotrosProceso />
      </main>
      <Footer />
    </>
  );
}
