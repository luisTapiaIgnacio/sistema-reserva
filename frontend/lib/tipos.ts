// Tipos de las respuestas de la API (backend en Python, /api/v1).
// Se pueden usar tanto en el servidor como en componentes del navegador.

export type EstadoReserva = "RESERVADA" | "CONFIRMADA" | "EN_CURSO" | "FINALIZADA" | "CANCELADA";
export type MetodoPago = "YAPE" | "PLIN" | "TRANSFERENCIA" | "EFECTIVO";
export type EstadoPago = "POR_VERIFICAR" | "VERIFICADO" | "ANULADO";
export type OrigenPago = "WHATSAPP" | "ADMIN" | "PASARELA";
export type EstadoUnidad = "OPERATIVA" | "MANTENIMIENTO" | "BAJA";
export type Rol = "ADMIN" | "OPERADOR";

// ---------- Público ----------

export type Categoria = { id: number; nombre: string; slug: string };

export type Producto = {
  id: number;
  categoria_id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  operativas: number;
};

export type Disponibilidad = {
  mes: string;
  productos: { producto_id: number; total: number; libres: Record<string, number> }[];
};

export type CuentaBancaria = { banco: string; tipo: string; numero: string };

export type Configuracion = {
  horas_para_pagar: number;
  porcentaje_adelanto: number;
  whatsapp: string;
  yape_plin_numero: string;
  yape_plin_titular: string;
  yape_plin_qr: string | null;
  bancos: CuentaBancaria[];
  bancos_titular: string;
};

export type ReservaPublica = {
  codigo: string;
  estado: EstadoReserva;
  vencida: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  horario: string | null;
  distrito: string | null;
  direccion: string | null;
  tipo_evento: string | null;
  cliente_nombre: string;
  items: { producto_id: number; nombre: string; cantidad: number; precio_unitario: number; subtotal: number }[];
  total: number;
  adelanto: number;
  pagado: number;
  saldo: number;
  expira_en: string | null;
  enlace_whatsapp: string;
  creado_en: string;
};

export type ReservaCreada = ReservaPublica & { token_acceso: string };

// ---------- Panel ----------

export type Usuario = { id: number; nombre: string; email: string; rol: Rol };

export type Sesion = { access_token: string; expira_en: string; usuario: Usuario };

export type Novedades = {
  por_confirmar: number;
  por_vencer: number;
  entregas_pendientes: number;
  recojos_pendientes: number;
  ultima_reserva: { id: number; codigo: string; cliente_nombre: string; creado_en: string } | null;
  firma: string;
};

export type ReservaResumen = {
  id: number;
  codigo: string;
  estado: EstadoReserva;
  vencida: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  horario: string | null;
  distrito: string | null;
  cliente_nombre: string;
  cliente_celular: string;
  productos: string;
  total: number;
  adelanto: number;
  pagado: number;
  expira_en: string | null;
  creado_en: string;
};

export type PaginaReservas = { items: ReservaResumen[]; total: number; pagina: number; por_pagina: number };

export type UnidadBreve = { id: number; codigo: string };

export type PagoAdmin = {
  id: number;
  monto: number;
  metodo: MetodoPago;
  origen: OrigenPago;
  numero_operacion: string | null;
  estado: EstadoPago;
  creado_en: string;
};

export type ReservaDetalle = {
  id: number;
  codigo: string;
  estado: EstadoReserva;
  vencida: boolean;
  fecha_inicio: string;
  fecha_fin: string;
  horario: string | null;
  distrito: string | null;
  direccion: string | null;
  tipo_evento: string | null;
  notas: string | null;
  cliente: { id: number; nombre: string; celular: string; email: string | null };
  items: {
    id: number;
    producto_id: number;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    unidades: UnidadBreve[];
  }[];
  pagos: PagoAdmin[];
  total: number;
  adelanto: number;
  pagado: number;
  saldo: number;
  expira_en: string | null;
  creado_en: string;
  token_acceso: string;
  enlace_whatsapp_cliente: string;
};

export type UnidadesItem = {
  reserva_item_id: number;
  producto_id: number;
  nombre: string;
  cantidad: number;
  asignadas: UnidadBreve[];
  libres: UnidadBreve[];
};

export type CategoriaAdmin = Categoria & { orden: number; activa: boolean; productos: number };

export type UnidadAdmin = { id: number; codigo: string; estado: EstadoUnidad; notas: string | null };

export type ProductoAdmin = {
  id: number;
  categoria_id: number;
  categoria_nombre: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  precio: number;
  imagen: string | null;
  activo: boolean;
  unidades_por_estado: Record<EstadoUnidad, number>;
  unidades: UnidadAdmin[];
};
