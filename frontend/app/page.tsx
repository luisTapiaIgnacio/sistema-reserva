import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiciosCarousel from "@/components/ServiciosGrid";
/*import ComplementaSection from "@/components/ComplementaSection"; */
import CelebraSection from "@/components/CelebraSecction";
import ExperienciaSection from "@/components/ExperienciaSection";
import ComoReservarSection from "@/components/ConservarSection";
import PorQueSection from "@/components/PorQueSection";
import ProcesoSection from "@/components/ProcesoSection";
import EnvioNacional from "@/components/EnvioNacional";
import FaqSection from "@/components/FaqSection";
import AliadosCarousel from "@/components/AliadosCarousel";
import Footer from "@/components/Footer";
import Marquee from "@/components/Marquee";

const MARQUEE_ITEMS = [
  "Diseño de Eventos",
  "Estrategia BTL",
  "Team Building",
  "Merchandising & Branding",
];

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <ServiciosCarousel />
      <CelebraSection />
      <ExperienciaSection />
      <ComoReservarSection />
      <EnvioNacional />
      <Marquee items={MARQUEE_ITEMS} variant="light" />
      <PorQueSection />

      <div className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="pointer-events-none absolute left-10 top-10 h-72 w-72 rounded-full bg-[#f5c542]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-[#0054ef]/10 blur-3xl" />

        <ProcesoSection />
        <FaqSection />
      </div>

      <AliadosCarousel />
      <Footer />
    </>
  );
}
