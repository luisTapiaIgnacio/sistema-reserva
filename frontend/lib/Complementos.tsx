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
      "Complementa tu celebración con carritos de snacks y opciones de catering para ofrecer a tus invitados una experiencia adicional. Las alternativas pueden adaptarse al estilo y temática de tu evento.",
    imagen: "/images/nova-btl/complementarios.jpg",
    imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
      "Una alternativa de presentación ejecutiva para eventos empresariales, activaciones de marca y celebraciones corporativas, con una propuesta personalizada de acuerdo con la identidad de tu empresa.",
    imagen: "/images/nova-btl/complementarios-2.jpg",
    imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
    ],
  },
  {
    slug: "personalizacion-de-merchandising",
    titulo: "Personalización de Merchandising",
    descripcion:
      "Artículos personalizados con nombres, logotipos, fechas o diseños especiales para tus invitados, clientes o colaboradores. Una alternativa ideal para celebraciones sociales y eventos corporativos.",
    imagen: "/images/nova-btl/complementarios-3.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "plataforma-360",
    titulo: "Plataforma 360°",
    descripcion:
      "Una experiencia audiovisual interactiva que permite capturar videos dinámicos de los invitados desde distintos ángulos, creando contenido especial para compartir y recordar.",
    imagen: "/images/nova-btl/celebra/plataforma360.jfif",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "aro-360",
    titulo: "Aro 360°",
    descripcion:
      "Una experiencia audiovisual en la que los invitados pueden posar mientras una cámara gira a su alrededor, creando videos dinámicos para compartir y conservar como recuerdo..",
    imagen: "/images/nova-btl/complementarios-5.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "guia-pre-evento",
    titulo: "Guía Pre-Evento",
    descripcion:
      "Orientación y coordinación previa para organizar los detalles del servicio, planificar la instalación y preparar la experiencia para el día de tu evento.",
    imagen: "/images/nova-btl/complementarios-6.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "directivo",
    titulo: "Directivo",
    descripcion:
      "Contenido gráfico personalizado para comunicar y promocionar tu evento, con diseños adaptados a la identidad de tu celebración, empresa o marca.",
    imagen: "/images/nova-btl/complementarios.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "robot-led",
    titulo: "Robot LED",
    descripcion:
      "Un espectáculo visual con un robot iluminado que aporta entretenimiento, energía y una presencia llamativa a tu evento, sorprendiendo a todos tus invitados.",
    imagen: "/images/nova-btl/complementarios-2.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "libro-de-recuerdos",
    titulo: "Libro de Recuerdos",
    descripcion:
      "Un complemento para reunir fotografías, dedicatorias y mensajes de los invitados, creando un recuerdo especial de la celebración.",
    imagen: "/images/nova-btl/complementarios-3.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "espejo-magico",
    titulo: "Espejo Mágico",
    descripcion:
      "Una experiencia fotográfica interactiva que permite a tus invitados posar, divertirse y capturar fotografías especiales, convirtiendo cada momento en un recuerdo inolvidable.",
    imagen: "/images/nova-btl/complementarios-4.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "fotos-instantaneas",
    titulo: "Fotos Instantáneas",
    descripcion:
      "Fotografías impresas al momento para que tus invitados puedan llevarse un recuerdo físico de la celebración y conservar esos momentos especiales.",
    imagen: "/images/nova-btl/complementarios-5.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "fondos-personalizados",
    titulo: "Fondos Personalizados",
    descripcion:
      "Un fondo decorativo adaptado a la temática, los colores, los nombres o la identidad visual de tu evento, ideal para complementar el espacio fotográfico.",
    imagen: "/images/nova-btl/complementarios-6.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
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
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
];

// Busca un complemento por su slug (o undefined si no existe)
export const obtenerComplemento = (slug: string) =>
  COMPLEMENTOS.find((c) => c.slug === slug);