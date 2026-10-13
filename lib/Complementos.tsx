// Datos de los 12 complementos.
// Cada uno genera su propia página en /complementa_evento/[slug]
// Actualiza descripciones e imágenes con la información real.

export type Complemento = {
  slug: string; // parte de la URL (sin espacios ni tildes)
  titulo: string;
  descripcion: string;
  imagen: string;
  imagenDetalle?: string; // imagen de la sección de descripción
  detalle?: string[]; // párrafos de la descripción
  incluye?: string[]; // tarjetas de "¿Qué incluye?"
  galeria?: string[]; // 2 fotos debajo de "¿Por qué elegir?"
};

export const COMPLEMENTOS: Complemento[] = [
    {
    slug: "carritos-snacks-y-catering",
    titulo: "Carritos Snacks y Catering",
    descripcion:
      "Carritos y estaciones de snacks con una selección gourmet de quesos, embutidos, frutos secos y aperitivos para sorprender a tus invitados.",
    imagen: "/images/nova-btl/complementarios.jpg",
    imagenDetalle: "/images/nova-btl/complementarios-2.jpg",
    detalle: [
      "El carrito snack de Miranda ofrece una experiencia gastronómica diferente, ideal para eventos corporativos, bodas, ferias, activaciones y celebraciones donde se busca brindar un servicio elegante y de alta calidad.",
      "Nuestra estación gourmet reúne una cuidada selección de quesos, embutidos, frutos secos, galletas artesanales y otros aperitivos premium, presentados de forma atractiva para que cada invitado disfrute de una experiencia única.",
      "Además de complementar la decoración, el carrito snack fomenta la interacción entre los asistentes y aporta un toque sofisticado a cualquier celebración.",
    ],
    incluye: [
      "Selección de 12 snacks gourmet",
      "Quesos, embutidos y charcutería premium",
      "Frutos secos, galletas y aperitivos variados",
      "Presentación elegante tipo estación gourmet",
      "Personal de atención durante el servicio",
      "Montaje, decoración y desmontaje",
    ],
    galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
    ],
  },
  {
    slug: "ticket-ejecutivo-corporativo",
    titulo: "Ticket Ejecutivo Corporativo",
    descripcion:
      "Una experiencia ejecutiva pensada para eventos de empresa, con atención y detalles a la altura de tu marca.",
    imagen: "/images/nova-btl/complementarios-2.jpg",
  },
  {
    slug: "personalizacion-de-merchandising",
    titulo: "Personalización de Merchandising",
    descripcion:
      "Productos personalizados con tu logo o temática para que tus invitados se lleven un recuerdo del evento.",
    imagen: "/images/nova-btl/complementarios-3.jpg",
  },
  {
    slug: "plataforma-360",
    titulo: "Plataforma 360°",
    descripcion:
      "Videos en cámara lenta 360° listos para compartir en redes, personalizados con la identidad de tu evento.",
    imagen: "/images/nova-btl/complementarios-4.jpg",
  },
  {
    slug: "aro-360",
    titulo: "Aro 360°",
    descripcion:
      "Un aro giratorio que captura videos dinámicos y divertidos desde todos los ángulos.",
    imagen: "/images/nova-btl/complementarios-5.jpg",
  },
  {
    slug: "guia-pre-evento",
    titulo: "Guía Pre-Evento",
    descripcion:
      "Te acompañamos antes del evento para coordinar cada detalle y que todo salga según lo planeado.",
    imagen: "/images/nova-btl/complementarios-6.jpg",
  },
  {
    slug: "directivo",
    titulo: "Directivo",
    descripcion:
      "Servicio pensado para reuniones directivas y eventos ejecutivos que requieren una atención especial.",
    imagen: "/images/nova-btl/complementarios.jpg",
  },
  {
    slug: "robot-led",
    titulo: "Robot LED",
    descripcion:
      "Show de robot con luces LED que llena de energía la pista de baile en el momento más esperado.",
    imagen: "/images/nova-btl/complementarios-2.jpg",
  },
  {
    slug: "libro-de-recuerdos",
    titulo: "Libro de Recuerdos",
    descripcion:
      "Un álbum para conservar fotografías y mensajes de tus invitados como recuerdo del evento.",
    imagen: "/images/nova-btl/complementarios-3.jpg",
  },
  {
    slug: "espejo-magico",
    titulo: "Espejo Mágico",
    descripcion:
      "Un espejo fotográfico interactivo de cuerpo entero que aporta entretenimiento y elegancia a tu celebración.",
    imagen: "/images/nova-btl/complementarios-4.jpg",
  },
  {
    slug: "fotos-instantaneas",
    titulo: "Fotos Instantáneas",
    descripcion:
      "Fotografías impresas al momento para que cada invitado se lleve un recuerdo físico del evento.",
    imagen: "/images/nova-btl/complementarios-5.jpg",
  },
  {
    slug: "fondos-personalizados",
    titulo: "Fondos Personalizados",
    descripcion:
      "Fondos decorativos adaptados a la temática de tu evento para fotografías únicas.",
    imagen: "/images/nova-btl/complementarios-6.jpg",
  },
];

// Busca un complemento por su slug (o undefined si no existe)
export const obtenerComplemento = (slug: string) =>
  COMPLEMENTOS.find((c) => c.slug === slug);