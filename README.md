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

## Estado de la migración

El frontend todavía usa Prisma con su propia base de datos. La lógica de
negocio se está pasando al backend en Python por fases; cuando termine,
el frontend solo llamará a la API.
