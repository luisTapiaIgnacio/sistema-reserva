import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Pagebanner from "@/components/Pagebanner";

/*import ServicioPremium from "@/components/servicios/Serviciopremium"; */
import PortafolioGaleria from "@/components/portafolio/PortafolioGaleria";


export default function PortafolioPage() {
  return (
    <>
      <Header />
      <main>
        <Pagebanner titulo="Portafolio" ruta="Portafolio" />
       
        <PortafolioGaleria />
      </main>
      <Footer mostrarLlamado={false} />
    </>
  );
}