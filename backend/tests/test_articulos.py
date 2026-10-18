"""Pruebas de los endpoints de Artículos."""

from fastapi.testclient import TestClient

ART = "/api/v1/articulos"
CAT = "/api/v1/categorias"


def _crear_categoria(client: TestClient, nombre: str = "Espejos") -> int:
    return client.post(CAT, json={"nombre": nombre}).json()["id"]


def test_no_se_puede_crear_articulo_sin_categoria_valida(client: TestClient) -> None:
    respuesta = client.post(
        ART, json={"nombre": "Espejo A", "categoria_id": 999, "stock_total": 5}
    )
    assert respuesta.status_code == 400


def test_flujo_completo_articulo(client: TestClient) -> None:
    categoria_id = _crear_categoria(client)

    creado = client.post(
        ART,
        json={
            "nombre": "Espejo A",
            "categoria_id": categoria_id,
            "stock_total": 10,
            "precio_dia": 2.5,
        },
    )
    assert creado.status_code == 201
    datos = creado.json()
    assert datos["categoria"]["nombre"] == "Espejos"  # categoría anidada
    assert datos["stock_total"] == 10


def test_filtrar_articulos_por_categoria(client: TestClient) -> None:
    espejos = _crear_categoria(client, "Espejos")
    mesas = _crear_categoria(client, "Mesas")
    client.post(ART, json={"nombre": "Espejo A", "categoria_id": espejos})
    client.post(ART, json={"nombre": "Mesa redonda", "categoria_id": mesas})

    solo_espejos = client.get(ART, params={"categoria_id": espejos})
    assert solo_espejos.status_code == 200
    nombres = [a["nombre"] for a in solo_espejos.json()]
    assert nombres == ["Espejo A"]


def test_stock_negativo_es_rechazado(client: TestClient) -> None:
    categoria_id = _crear_categoria(client)
    respuesta = client.post(
        ART, json={"nombre": "Mal", "categoria_id": categoria_id, "stock_total": -3}
    )
    assert respuesta.status_code == 422  # validación de Pydantic (ge=0)
