# Frontend · Miranda Magic Mirror

Web pública y panel de administración en **Next.js 16**. No tiene base de datos
propia: todo lo pide a la API en Python (`../backend`) desde el servidor de Next.js.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # dirección de la API
npm run dev                  # http://localhost:3000
```

La API debe estar corriendo (ver el README de la raíz).

## Estructura

| Carpeta | Qué hay |
|---|---|
| `app/reservar`, `app/reserva/[codigo]` | Reserva del cliente (carrito → fecha → datos → WhatsApp) |
| `app/admin` | Panel: login, resumen, reservas, inventario, ajustes |
| `app/api` | Dos rutas que reenvían a la API (calendario y avisos del panel) |
| `lib/api.ts` | Cliente de la API (solo servidor) |
| `lib/admin.ts`, `lib/sesion.ts` | Sesión del panel: el token va en una cookie `httpOnly` |
| `lib/tipos.ts` | Tipos de las respuestas de la API |
| `proxy.ts` | Protege `/admin` (en Next.js 16 se llama así, en minúsculas) |

## Compilar

```bash
npm run build
```

En máquinas con poca memoria (≈ 2 GB) Turbopack puede quedarse sin RAM;
`npx next build --webpack` usa bastante menos.
