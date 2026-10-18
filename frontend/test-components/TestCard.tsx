import Image from "next/image";

type ServicioCardProps = {
  eyebrow: string;
  titulo: string;
  descripcion: string;
  whatsapp: string;
  imagen: string;
};

export default function ServicioCard({
  eyebrow,
  titulo,
  descripcion,
  whatsapp,
  imagen,
}: ServicioCardProps) {
  return (
    <div
      className="
        group relative flex h-full min-h-[460px] flex-col overflow-hidden
        rounded-xl bg-white
        shadow-[0_12px_18px_-6px_rgba(34,56,101,0.08)]
        transition-all duration-500 ease-out
        hover:-translate-y-2 hover:scale-[1.02]
        hover:shadow-[0_24px_40px_-12px_rgba(34,56,101,0.35)]
      "
    >
      {/* 🖼️ Imagen de fondo */}
      <Image
        src={imagen}
        alt={titulo}
        fill
        sizes="(max-width: 768px) 100vw, 25vw"
        className="
          object-cover
          opacity-0
          transition-opacity duration-500 ease-out
          group-hover:opacity-100
        "
      />

      {/* 🟦 Barra superior con degradado primary */}
      <div className="
        relative z-10 py-2 text-center
        bg-gradient-to-r from-primary to-primary-dark
      ">
        <span className="font-krona text-[16px] font-bold uppercase tracking-[0.15em] text-white">
          {eyebrow}
        </span>
      </div>

      {/* 📝 Contenido */}
      <div className="relative z-10 flex flex-1 flex-col items-center p-8 text-center">
        <h3
          className="
            flex w-full min-h-[64px] items-center justify-center
            text-xl font-bold uppercase tracking-wide text-heading
            transition-colors duration-500
            group-hover:text-white
          "
        >
          {titulo}
        </h3>

        <hr
          className="
            my-5 w-full border-t-2 border-primary/30
            transition-colors duration-500
            group-hover:border-white
          "
        />

        <p
          className="
            mb-6 flex-1 w-full
            font-roboto text-[19px] leading-relaxed tracking-wide text-gray-600
            transition-colors duration-500
            group-hover:text-white
          "
        >
          {descripcion}
        </p>

        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-auto inline-flex items-center justify-center gap-2
            rounded-full px-8 py-3
            bg-gradient-to-r from-primary to-primary-dark
            text-sm font-semibold tracking-wide text-white
            transition-all duration-300
            hover:scale-105 hover:brightness-110
            focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
          "
        >
          Cotiza tu evento
        </a>
      </div>
    </div>
  );
}