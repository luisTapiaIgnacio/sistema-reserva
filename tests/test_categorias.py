"""Pruebas de los endpoints de Categorías."""

from fastapi.testclient import TestClient

BASE = "/api/v1/categorias"


def test_crear_y_listar_categoria(client: TestClient) -> None:
    respuesta = client.post(BASE, json={"nombre": "Espejos", "descripcion": "Decorativos"})
    assert respuesta.status_code == 201
    datos = respuesta.json()
    assert datos["nombre"] == "Espejos"
    assert datos["id"] > 0

    listado = client.get(BASE)
    assert listado.status_code == 200
    assert len(listado.json()) == 1


def test_no_permite_nombre_duplicado(client: TestClient) -> None:
    client.post(BASE, json={"nombre": "Mesas"})
    repetida = client.post(BASE, json={"nombre": "Mesas"})
    assert repetida.status_code == 409


def test_obtener_categoria_inexistente_da_404(client: TestClient) -> None:
    assert client.get(f"{BASE}/999").status_code == 404


def test_actualizar_y_eliminar_categoria(client: TestClient) -> None:
    creada = client.post(BASE, json={"nombre": "Sillas"}).json()
    cid = creada["id"]

    actualizada = client.patch(f"{BASE}/{cid}", json={"descripcion": "Sillas plegables"})
    assert actualizada.status_code == 200
    assert actualizada.json()["descripcion"] == "Sillas plegables"

    assert client.delete(f"{BASE}/{cid}").status_code == 204
    assert client.get(f"{BASE}/{cid}").status_code == 404
