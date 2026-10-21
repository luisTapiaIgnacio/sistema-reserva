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
    imagen: "/images/complemento-img/carito.png",
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
      "En MIRANDA EVENTS, ofrecemos el servicio de Ticket Ejecutivo Corporativo, una propuesta de presentación personalizada ideal para eventos empresariales, activaciones BTL, lanzamientos de productos, ferias comerciales y celebraciones corporativas. Diseñamos una experiencia alineada con la identidad visual de tu empresa, cuidando cada detalle para transmitir profesionalismo, elegancia y una imagen de marca memorable.",
"Nuestra propuesta se adapta a las necesidades de cada organización, incorporando elementos visuales y detalles personalizados que refuerzan la presencia de tu marca, generan una presentación diferenciada y contribuyen a crear una experiencia especial para tus invitados, clientes y colaboradores.",
    ],
    incluye: [
      "Propuesta de presentación ",
      "Personalización visual según los colores, ",
      "Diseño alineado con la imagen de marca",
      "Coordinación previa para definir los detalles",
      "Adaptación al formato del evento",
     
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
      "Los Souvenirs Corporativos de MIRANDA EVENTS son una excelente herramienta para reforzar el posicionamiento de tu marca y agradecer la participación de clientes, colaboradores e invitados en eventos empresariales, ferias, congresos, activaciones BTL y lanzamientos de productos.",

"Ofrecemos una amplia variedad de recuerdos personalizados como agendas, tomatodos, tazas, libretas, lapiceros, bolsas ecológicas, llaveros, USB, cargadores, termos y otros artículos promocionales, todos adaptados con la identidad visual de tu empresa.",

"Cada souvenir está diseñado para generar recordación de marca y aportar valor a quienes lo reciben, convirtiéndose en una estrategia efectiva para fortalecer relaciones comerciales y prolongar el impacto del evento mucho después de su finalización.",
    ],
    incluye: [
      "Amplio catálogo de souvenirs corporativos",
      "Personalización con logotipo y branding",
      "Asesoría para la selección de productos",
      "Acabados de alta calidad",
      "Producción según la cantidad requerida",
      "Entrega coordinada para el event"
     
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
      "La Plataforma 360° es una de las experiencias más solicitadas para eventos corporativos, activaciones BTL, ferias y lanzamientos de marca. Permite a los asistentes grabar videos dinámicos mientras una cámara gira alrededor de ellos, generando contenido atractivo y listo para compartir en redes sociales.",

"En MIRANDA EVENTS ofrecemos un servicio integral que incluye instalación, operación, personal de apoyo y personalización de la experiencia según la identidad visual de tu marca. Nuestro objetivo es crear momentos memorables que incrementen la interacción de los asistentes y potencien la visibilidad de tu evento.",

"Es la opción ideal para empresas que buscan innovar, generar contenido orgánico y brindar una experiencia moderna durante sus eventos.",
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
      "¡Lleva tu evento al siguiente nivel con el Aro 360° de MIRANDA EVENTS! Una experiencia innovadora que combina iluminación, movimiento y tecnología para crear videos espectaculares, captar todas las miradas y convertir cada momento en un recuerdo inolvidable.",
      "Ideal para eventos corporativos, activaciones BTL, ferias, lanzamientos de marca, bodas, cumpleaños y celebraciones especiales. Nuestro Aro 360° permite a tus invitados protagonizar videos dinámicos y originales, perfectos para compartir en redes sociales y hacer que tu evento destaque mucho más allá del lugar donde se realiza.",
      "En MIRANDA EVENTS transformamos cada grabación en una experiencia única, creando momentos que sorprenden, conectan y generan contenido que todos querrán compartir. ¡Haz que tus invitados sean los protagonistas y que tu evento sea imposible de olvidar!",
    
    ],
    incluye: [
      "Operador especializado durante el evento",
      "Iluminación LED para una experiencia visual impactante",
      "Personalización de la experiencia con la identidad de tu marca",
      "Entrega de videos digitales para descargar y compartir",
      "Instalación y desmontaje del equipo",
     
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
      "¡Cada gran experiencia comienza con una buena planificación!",
"En MIRANDA EVENTS, te acompañamos desde el primer momento para que cada detalle de nuestro servicio esté organizado y listo para sorprender en tu evento. Brindamos orientación y coordinación previa para conocer tus necesidades, definir los detalles del servicio, planificar la instalación y preparar una experiencia que se adapte al estilo de tu celebración.",
"Nos encargamos de coordinar contigo los aspectos necesarios para que todo esté preparado para el gran día, ofreciéndote una atención personalizada y la tranquilidad de saber que cada detalle ha sido considerado.",
"Tú disfruta de la emoción de tu evento; nosotros te ayudamos a preparar una experiencia inolvidable.",
    ],
    incluye: [
      "Asesoría personalizada para conocer tus necesidades",
      "Coordinación previa del servicio según el tipo de evento",
      "Frutos secos, galletas y aperitivos variados",
      "Orientación sobre la experiencia para aprovechar al máximo ",
      "Confirmación de detalles previos para llegar al evento ",
     
    ],
     galeria: [
      "/images/nova-btl/complementarios-3.jpg",
      "/images/nova-btl/complementarios-2.jpg",
       
    ],
  },
  {
    slug: "directivo",
    titulo: "Post Directivo",
    descripcion:
      "Contenido gráfico personalizado para comunicar y promocionar tu evento, con diseños adaptados a la identidad de tu celebración, empresa o marca.",
    imagen: "/images/nova-btl/complementarios.jpg",
     imagenDetalle: "/images/nova-btl/complementarios.jpg",
    detalle: [
      "¡Comunica, impacta y haz que tu evento destaque desde el primer vistazo!",

"En MIRANDA EVENTS, creamos contenido gráfico personalizado para promocionar tu evento, fortalecer la imagen de tu marca y captar la atención de tu público. Diseñamos piezas visuales atractivas y profesionales, adaptadas a la identidad de tu empresa, celebración o marca, cuidando cada detalle para transmitir el mensaje que deseas comunicar.",

"Ideal para eventos corporativos, activaciones BTL, lanzamientos de marca, campañas promocionales, bodas, cumpleaños y celebraciones especiales. Nuestros diseños te ayudan a generar expectativa, compartir información relevante y mantener una imagen visual coherente en tus canales digitales.",


    ],
    incluye: [
      "Diseño gráfico personalizado",
      "Adaptación a la identidad visual",
      "Piezas gráficas promocionales para comunicar",
      "Diseño optimizado para redes sociale",
      "Entrega de archivos digitales listos para publicar",
     
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
      "Los Robots LED son una de las atracciones más llamativas para eventos sociales, corporativos, activaciones BTL y celebraciones de gran impacto. Gracias a su impresionante iluminación, coreografías y efectos visuales, captan la atención de todos los asistentes desde el primer momento.",

"En MIRANDA EVENTS ofrecemos shows con Robots LED de última generación, acompañados de música, interacción con el público y presentaciones adaptadas al tipo de evento. Nuestro equipo coordina cada detalle para brindar una experiencia segura, dinámica e inolvidable.",

"Si buscas sorprender a tus invitados y convertir tu evento en una experiencia única, los Robots LED son la opción ideal para generar un espectáculo moderno, innovador y altamente compartible en redes sociales.",
    ],
    incluye: [
      "Show profesional con Robots LED",
      "Coreografía con música y efectos visuales",
      "Interacción con los asistentes",
      "Iluminación LED de alto impacto",
      "Presentación personalizada según el evento",
      "Coordinación y operación durante la presentación"
     
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
      "El Libro de Recuerdos es el complemento perfecto para bodas, cumpleaños, aniversarios, quinceañeros y todo tipo de celebraciones especiales. Permite reunir fotografías, dedicatorias, mensajes y palabras llenas de cariño de tus invitados, creando un recuerdo único que podrás conservar y revivir con el paso del tiempo.",
"En MIRANDA EVENTS, transformamos los pequeños detalles en grandes recuerdos, ofreciéndote una forma especial de conservar las emociones, sonrisas y buenos deseos de las personas que comparten contigo ese día tan importante.",
"¡Un detalle lleno de emoción que convertirá los mensajes de tus invitados en recuerdos para toda la vida!",
    ],
    incluye: [
      "Presentación decorativa acorde con el estilo de tu celebración",
      "Personalización del libro con nombres, fecha o temática del evento",
      "Libro de recuerdos para reunir mensajes y dedicatorias.",
      "Espacio para fotografías de tus invitados y momentos especiales",
      "Sección para mensajes personalizados llenos de cariño y buenos deseos",
     
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
      "El Espejo Mágico transforma la experiencia tradicional de las fotografías en una actividad interactiva y entretenida para invitados de todas las edades. Gracias a su pantalla táctil de cuerpo completo, los asistentes pueden posar, interactuar con animaciones y obtener fotografías personalizadas al instante.",

"En MIRANDA EVENTS personalizamos cada experiencia con el diseño de tu evento o marca, incorporando marcos exclusivos, mensajes personalizados y accesorios temáticos. Nuestro equipo se encarga de la instalación, operación y asistencia para que cada invitado disfrute de una experiencia moderna e inolvidable.",

"Es una excelente alternativa para generar mayor participación, crear contenido memorable y ofrecer un atractivo tecnológico que destaque cualquier celebración, feria o activación.",
    ],
    incluye: [
      "Espejo mágico interactivo de cuerpo completo",
      "Pantalla táctil con animaciones",
      "Fotografías impresas al instante",
      "personalización con el diseño del evento",
      "Accesorios para fotografías",
      "Instalación, operador y desmontaje"
     
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
      "¡Captura la magia del momento y llévate un recuerdo que puedas tocar, compartir y conservar para siempre!",
      "En MIRANDA EVENTS, hacemos que los mejores momentos de tu celebración se conviertan en recuerdos tangibles. Nuestro servicio de Fotos Instantáneas permite capturar e imprimir fotografías al momento, para que tus invitados se lleven a casa un detalle especial lleno de emociones, sonrisas y recuerdos inolvidables.",
"Ideal para bodas, quinceañeros, cumpleaños, aniversarios, eventos corporativos y todo tipo de celebraciones. Cada fotografía se convierte en un recuerdo único que tus invitados podrán conservar, colocar en un álbum o compartir con sus seres queridos.",
    ],
    incluye: [
      "Fotografías impresas al instante",
      "Captura de momentos especiales",
      "Impresiones para tus invitados",
      "Diseño personalizado de las fotografías",
      "Atención durante el servicio para facilitar la experiencia ",
      "Preparación y configuración del equipo ",
     
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
      "¡El escenario perfecto para fotografías que robarán todas las miradas!",
"Creamos fondos decorativos que transforman tu espacio fotográfico en un rincón único, elegante y lleno de personalidad. Adaptamos cada diseño a la temática, los colores, los nombres y la identidad visual de tu evento, logrando una presentación armoniosa que destaca en cada fotografía.",
"Ideal para bodas, quinceañeros, cumpleaños, eventos corporativos, activaciones BTL y celebraciones especiales. Nuestros fondos decorativos complementan la experiencia fotográfica, realzan la decoración y permiten que tus invitados se lleven imágenes increíbles de ese día tan especial.",
"Haz que cada foto tenga un escenario espectacular y convierte tu celebración en una experiencia visual inolvidable.",
    ],
    incluye: [
      "Diseño adaptado a la temática y los colores",
      "Personalización con nombres, frases o elementos gráfic",
      "Integración visual con el espacio fotográfico",
      "Instalación y montaje del fondo decorativo,",
      "Asesoría previa de diseño para coordinar los detalles",
     
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