from fastapi import FastAPI

app = FastAPI(
    title="Sistema de Reservas API",
    description="API para la gestión de alquileres y reservas.",
    version="0.1.0",
)


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
