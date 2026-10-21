import Image from "next/image";
import Reveal from "@/components/Reveal";

// 👇 Los 4 círculos (imágenes de relleno: cámbialas por las reales)
const ITEMS = [
  { src: "/images/nova-btl/complementarios-3.jpg", titulo: "Experiencia", texto: "Creamos espacios de interacción y entretenimiento" },
  { src: "/images/nova-btl/complementarios-3.jpg", titulo: "Personalizacion", texto: "Adaptamos la propuesta al estilo de cada evento" },
  { src: "/images/nova-btl/complementarios-3.jpg", titulo: "Dedicación", texto: "Cuidamos la preparación y presentación del servicio" },
  { src: "/images/nova-btl/complementarios-3.jpg", titulo: "Conexión", texto: "Buscamos que cada invitado disfrute y se lleve un recuerdo" },
];

export default function NosotrosAmbientacion() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f2f5f7] to-[#fafbfc] px-5 py-20 font-poppins text-[#3a4f66] md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(2,21,43,0.07)_1px,transparent_1px)] bg-[length:24px_24px]" />

      <div className="relative z-10 mx-auto max-w-[1150px]">
        <Reveal>
          <div>
            
          </div>
          <h2 className="text-center font-krona text-2xl leading-tight text-[#192a3d]! md:text-4xl">
            Una experiencia pensada <span className="text-[#c47f0a]">para disfrutar</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base leading-relaxed">
            Complementamos el espejo con accesorios y ambientación que hacen que cada foto sea única y que tus
            invitados disfruten de principio a fin.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {ITEMS.map((it, i) => (
            <Reveal key={it.titulo} delay={i * 120}>
              <div className="group text-center">
                <div className="relative mx-auto aspect-square w-full max-w-[200px]">
                  {/* Anillo dorado */}
                  <span className="absolute -inset-2 rounded-full border border-dashed border-[#f5c542]/60 transition-transform duration-700 group-hover:rotate-45" aria-hidden="true" />
                  <div className="relative h-full w-full overflow-hidden rounded-full shadow-[0_20px_40px_-16px_rgba(2,21,43,0.4)]">
                    <Image
                      src={it.src}
                      alt={it.titulo}
                      fill
                      sizes="(max-width: 768px) 45vw, 200px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>
                <h3 className="mt-10 text-lg font-semibold text-[#192a3d]">{it.titulo}</h3>
                <p className="mt-1 text-sm">{it.texto}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}