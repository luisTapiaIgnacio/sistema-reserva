import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagebanner from "@/components/Pagebanner";

import Serviciopremium from "@/components/servicios/Serviciopremium";

import Complemento from "@/components/servicios/Complemento";
import Asistencia from "@/components/servicios/Asistencia";
import PlanesPaquetes from "@/components/servicios/PlanesPaquetes";

import ServiciosAdicionales from "@/components/servicios/ServiciosAdicionales";
import ExperienciaCelebracion from "@/components/servicios/ExperienciaCelebracion";

import GaleriaSection from "@/components/servicios/GaleriaSection";
import EnvioNacional from "@/components/servicios/EnvioNacional";
import CotizacionForm from "@/components/servicios/CotizacionForm";

export default function ServiciosPage(){
   return (
    <>
      <Header />
      <main>
       <Pagebanner titulo="Nuestros" destacado="servicios" ruta="Servicios" />
        <Serviciopremium />
        <Complemento/>
        <Asistencia />
        <PlanesPaquetes/>
        <ExperienciaCelebracion />
        <ServiciosAdicionales />
        <GaleriaSection />
        <EnvioNacional />
        <CotizacionForm />
      </main>
      <Footer mostrarLlamado={false} />
    </>
  );
}
