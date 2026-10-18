import type { Metadata } from "next";
import { Poppins, Krona_One } from "next/font/google";
/*import "app/globals.css";*/
import "@/app/globals.css";
import BackToTop from "@/components/BackToTop";


import WhatsAppButton from "@/components/WhatsAppButton";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const kronaOne = Krona_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-krona",
});

export const metadata: Metadata = {
  title: "Agencia BTL en Lima | Activaciones y Eventos Corporativos",
  description:
    "Agencia BTL en Lima especializada en activaciones de marca, eventos corporativos y experiencias para empresas. Diseñamos campañas que conectan con tu público.",
  openGraph: {
    title: "Agencia BTL en Lima | Activaciones y Eventos Corporativos",
    description:
      "Agencia BTL en Lima especializada en activaciones de marca, eventos corporativos y experiencias para empresas.",
    url: "https://novabtlyeventos.com/",
    siteName: "Nova BTL y eventos",
    images: ["/images/nova-btl/imgi_46_Banner-principal-Nova-BTL.jpg"],
    locale: "es_ES",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-PE" className={`${poppins.variable} ${kronaOne.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>

      <body>
       
        {children}

        <BackToTop />
        <WhatsAppButton />
      </body>
    </html>
  );
}