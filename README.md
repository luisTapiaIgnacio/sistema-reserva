# Sistema de Reservas · Miranda Magic Mirror

Monorepo con el frontend y el backend del sistema de reservas.

```
sistema-reserva/
├── backend/            API en Python (FastAPI + SQLAlchemy)
├── frontend/           Web en Next.js
└── docker-compose.yml  PostgreSQL + API
```

## Levantar con Docker

```bash
docker compose up --build
```

- API: http://localhost:8000/docs
- PostgreSQL: `localhost:5432` (usuario, clave y base: `reservas`)

Al arrancar, la API aplica sola las migraciones. Para cargar datos de
prueba y crear el usuario administrador:

```bash
docker compose exec api python -m scripts.seed
docker compose exec api python -m scripts.crear_admin correo@ejemplo.com "TuContraseña" "Nombre"
```

## Desarrollo sin Docker

**Backend**

```bash
docker compose up -d db          # solo la base de datos
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head             # crea las tablas
python -m scripts.seed           # datos de prueba (opcional)
python -m scripts.crear_admin correo@ejemplo.com "TuContraseña" "Nombre"
uvicorn app.main:app --reload
```

Tests: `pytest` (desde `backend/`; usan SQLite en memoria, no necesitan Postgres).

**Cambios en la base de datos**

1. Modifica los modelos en `backend/app/models/`.
2. Genera la migración: `alembic revision --autogenerate -m "describe el cambio"`.
3. Revisa el archivo creado en `backend/alembic/versions/` y aplícalo: `alembic upgrade head`.

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

Web: http://localhost:3000

## Cómo funciona una reserva

```
Cliente da clic en "Reservar"
        ▼
   RESERVADA ── la fecha queda separada X horas (se cambia en el panel)
        │       el cliente va a WhatsApp con un mensaje ya escrito y manda su comprobante
        ├── vence el plazo ──► vencida (automático: la fecha se libera)
        │
        │  la admin revisa el comprobante y pulsa CONFIRMAR
        │  (registra el pago ≥ adelanto mínimo y se asignan las unidades)
        ▼
   CONFIRMADA ──► EN_CURSO ──► FINALIZADA     (botones en el panel)
        └──────► CANCELADA
```

## API

Documentación interactiva en http://localhost:8000/docs.

| Público (la web) | |
|---|---|
| `GET /api/v1/categorias`, `/productos` | Catálogo |
| `GET /api/v1/disponibilidad?mes=2026-11&producto_id=1&producto_id=2` | Unidades libres por día |
| `GET /api/v1/configuracion` | Plazo, % adelanto, WhatsApp y datos de pago |
| `POST /api/v1/reservas` | Crear reserva (varios productos y cantidades) |
| `GET /api/v1/reservas/{codigo}?t=…` | Ver la reserva con su link secreto |

| Panel (`Authorization: Bearer <token>`) | |
|---|---|
| `POST /api/v1/admin/login` | Inicia sesión y devuelve el token |
| `GET /api/v1/admin/novedades` | Avisos: por confirmar, por vencer, entregas y recojos |
| `GET /api/v1/admin/reservas` | Lista con filtros (estado, fechas, búsqueda) |
| `POST /api/v1/admin/reservas/{codigo}/confirmar` | Pago + asignación de unidades |
| `POST /api/v1/admin/reservas/{codigo}/estado` | EN_CURSO, FINALIZADA o CANCELADA |
| `POST /api/v1/admin/reservas/{codigo}/pagos` | Otro abono o el saldo |
| `/api/v1/admin/categorias`, `/productos`, `/unidades` | Inventario (solo rol ADMIN) |
| `PATCH /api/v1/admin/configuracion` | Plazo, % adelanto, datos de pago (solo rol ADMIN) |

## Estado de la migración

El frontend todavía usa Prisma con su propia base de datos. La lógica de
negocio se está pasando al backend en Python por fases; cuando termine,
el frontend solo llamará a la API.
