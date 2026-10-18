import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageBanner from "@/components/Pagebanner";

import ContactoFormulario from "@/components/contacto/ContactoFormulario";
import ContactoMapa from "@/components/contacto/ContactoMapa";
import LlamadoWhatsapp from "@/components/contacto/LlamadoWhatsapp";



export const metadata: Metadata = {
  title: "Contáctanos | Miranda Magic Mirror",
  description: "Escríbenos para cotizar tu espejo mágico o resolver tus dudas.",
};

export default function ContactanosPage() {
  return (
    <>
      <Header />
      <main>
        <PageBanner titulo="Contáctanos" ruta="Contáctanos" />
        {/* Aquí irán las secciones de contacto */}
        
<ContactoFormulario />
<ContactoMapa />
<LlamadoWhatsapp />
      </main>
      <Footer />
    </>
  );
}