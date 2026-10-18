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

## Desarrollo sin Docker

**Backend**

```bash
docker compose up -d db          # solo la base de datos
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Tests: `pytest` (desde `backend/`).

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
