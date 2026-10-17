"""Pruebas de QA de caja negra contra la API EN VIVO.

Actúa como un tester: ejecuta casos positivos (happy path) y negativos
(datos inválidos, límites, conflictos) y emite un reporte PASS/FAIL.

Uso:
    python qa/qa_smoke.py                 # contra http://127.0.0.1:8000
    BASE_URL=http://host:puerto python qa/qa_smoke.py
"""

from __future__ import annotations

import os
import sys

import httpx

BASE_URL = os.getenv("BASE_URL", "http://127.0.0.1:8000")
API = f"{BASE_URL}/api/v1"

_passed = 0
_failed = 0


def check(nombre: str, condicion: bool, detalle: str = "") -> None:
    global _passed, _failed
    if condicion:
        _passed += 1
        print(f"  [PASS] {nombre}")
    else:
        _failed += 1
        print(f"  [FAIL] {nombre}  {detalle}")


def main() -> int:
    with httpx.Client(timeout=10.0) as c:
        print("== Health ==")
        r = c.get(f"{BASE_URL}/health")
        check("GET /health responde 200", r.status_code == 200, f"-> {r.status_code}")
        check("health dice ok", r.json().get("status") == "ok")

        print("\n== Categorías (casos negativos y positivos) ==")
        r = c.get(f"{API}/categorias/999999")
        check("categoría inexistente -> 404", r.status_code == 404, f"-> {r.status_code}")

        r = c.post(f"{API}/categorias", json={"nombre": ""})
        check("nombre vacío -> 422 (validación)", r.status_code == 422, f"-> {r.status_code}")

        r = c.post(f"{API}/categorias", json={"nombre": "Sillas", "descripcion": "De eventos"})
        check("crear categoría -> 201", r.status_code == 201, f"-> {r.status_code}")
        categoria_id = r.json().get("id") if r.status_code == 201 else None

        r = c.post(f"{API}/categorias", json={"nombre": "Sillas"})
        check("categoría duplicada -> 409", r.status_code == 409, f"-> {r.status_code}")

        print("\n== Artículos ==")
        r = c.post(f"{API}/articulos", json={"nombre": "X", "categoria_id": 999999})
        check("artículo con categoría inexistente -> 400", r.status_code == 400, f"-> {r.status_code}")

        r = c.post(
            f"{API}/articulos",
            json={"nombre": "Silla plegable", "categoria_id": categoria_id, "stock_total": -1},
        )
        check("stock negativo -> 422", r.status_code == 422, f"-> {r.status_code}")

        r = c.post(
            f"{API}/articulos",
            json={
                "nombre": "Silla plegable",
                "categoria_id": categoria_id,
                "stock_total": 5,
                "precio_dia": 2.0,
            },
        )
        check("crear artículo -> 201", r.status_code == 201, f"-> {r.status_code}")
        articulo_id = r.json().get("id") if r.status_code == 201 else None
        check("artículo trae categoría anidada", r.json().get("categoria", {}).get("nombre") == "Sillas")

        print("\n== Disponibilidad y Reservas (lógica de periodo) ==")
        r = c.get(
            f"{API}/reservas/disponibilidad",
            params={"articulo_id": articulo_id, "fecha_inicio": "2026-12-01", "fecha_fin": "2026-12-05"},
        )
        check("disponibilidad inicial = stock (5)", r.json().get("unidades_disponibles") == 5, f"-> {r.text}")

        cliente = {"nombre": "Ana QA", "telefono": "999", "correo": "ana.qa@correo.com"}

        def reserva(cant: int, ini: str, fin: str) -> httpx.Response:
            return c.post(
                f"{API}/reservas",
                json={
                    "cliente": cliente,
                    "fecha_inicio": ini,
                    "fecha_fin": fin,
                    "mensaje": "evento",
                    "items": [{"articulo_id": articulo_id, "cantidad": cant}],
                },
            )

        r = reserva(4, "2026-12-01", "2026-12-05")
        check("reserva válida (4 de 5) -> 201", r.status_code == 201, f"-> {r.status_code}")
        reserva_id = r.json().get("id") if r.status_code == 201 else None

        r = reserva(1, "2026-12-10", "2026-12-01")
        check("fecha_fin < inicio -> 422", r.status_code == 422, f"-> {r.status_code}")

        r = reserva(0, "2026-12-01", "2026-12-02")
        check("cantidad 0 -> 422", r.status_code == 422, f"-> {r.status_code}")

        r = reserva(2, "2026-12-03", "2026-12-07")
        check("sobrepasa disponibilidad en solape -> 409", r.status_code == 409, f"-> {r.status_code}")

        r = reserva(1, "2026-12-03", "2026-12-07")
        check("cabe la unidad que queda -> 201", r.status_code == 201, f"-> {r.status_code}")

        r = reserva(5, "2026-12-20", "2026-12-25")
        check("periodo sin solape admite 5 -> 201", r.status_code == 201, f"-> {r.status_code}")

        print("\n== Cancelación libera stock ==")
        r = c.post(f"{API}/reservas/{reserva_id}/cancelar")
        check("cancelar reserva -> 200", r.status_code == 200, f"-> {r.status_code}")
        check("estado = cancelada", r.json().get("estado") == "cancelada")
        r = c.post(f"{API}/reservas/{reserva_id}/cancelar")
        check("cancelar de nuevo -> 409", r.status_code == 409, f"-> {r.status_code}")

        print("\n== Cliente quedó registrado ==")
        r = c.get(f"{API}/clientes")
        correos = [cl["correo"] for cl in r.json()]
        check("cliente ana.qa en el listado", "ana.qa@correo.com" in correos)

    print("\n" + "=" * 40)
    print(f"RESULTADO QA:  {_passed} PASS / {_failed} FAIL")
    print("=" * 40)
    return 1 if _failed else 0


if __name__ == "__main__":
    sys.exit(main())
