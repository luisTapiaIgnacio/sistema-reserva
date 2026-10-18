// Cliente de la API del backend (Python). Solo se usa en el servidor de Next.js:
// el navegador nunca habla directo con la API ni ve el token del panel.
import "server-only";

// Dentro de Docker: http://api:8000/api/v1 (lo pone docker-compose.yml).
// En local se usa 127.0.0.1 y no "localhost": Node prueba primero IPv6 (::1) y,
// como la API escucha solo en IPv4, cada llamada perdía casi un segundo.
const API_URL = process.env.API_URL ?? "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    mensaje: string,
    public datos: Record<string, unknown> = {}
  ) {
    super(mensaje);
  }
}

type Opciones = {
  metodo?: "GET" | "POST" | "PUT" | "PATCH";
  cuerpo?: unknown;
  token?: string;
  query?: Record<string, string | number | (string | number)[] | undefined | null>;
};

// FastAPI responde los errores como {"detail": "mensaje"} o, si los datos no pasan
// la validación, {"detail": [{"msg": "Value error, El celular debe..."}]}.
function mensajeDeError(detalle: unknown): string {
  if (typeof detalle === "string") return detalle;
  if (Array.isArray(detalle) && detalle[0]?.msg) {
    return String(detalle[0].msg).replace(/^Value error, /, "");
  }
  return "Algo salió mal. Intenta de nuevo.";
}

export async function api<T>(ruta: string, { metodo = "GET", cuerpo, token, query }: Opciones = {}): Promise<T> {
  const url = new URL(`${API_URL}${ruta}`);
  for (const [clave, valor] of Object.entries(query ?? {})) {
    if (valor === undefined || valor === null || valor === "") continue;
    for (const v of Array.isArray(valor) ? valor : [valor]) url.searchParams.append(clave, String(v));
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(url, {
      method: metodo,
      cache: "no-store", // reservas y stock cambian a cada rato: siempre datos frescos
      headers: {
        ...(cuerpo !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ApiError(503, "No pudimos conectar con el sistema. Intenta de nuevo en unos segundos.");
  }

  const datos = respuesta.status === 204 ? null : await respuesta.json().catch(() => null);
  if (!respuesta.ok) {
    const { detail, ...extra } = (datos ?? {}) as Record<string, unknown>;
    throw new ApiError(respuesta.status, mensajeDeError(detail), extra);
  }
  return datos as T;
}
