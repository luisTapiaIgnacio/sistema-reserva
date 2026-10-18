"""Pruebas de Reservas y de la lógica de disponibilidad por periodo."""

from fastapi.testclient import TestClient

CAT = "/api/v1/categorias"
ART = "/api/v1/articulos"
RES = "/api/v1/reservas"


def _articulo_con_stock(client: TestClient, stock: int, nombre: str = "Silla") -> int:
    categoria_id = client.post(CAT, json={"nombre": f"cat-{nombre}"}).json()["id"]
    return client.post(
        ART, json={"nombre": nombre, "categoria_id": categoria_id, "stock_total": stock}
    ).json()["id"]


def _cliente() -> dict:
    return {"nombre": "Ana", "telefono": "999", "correo": "ana@correo.com"}


def _reserva_payload(articulo_id: int, cantidad: int, inicio: str, fin: str) -> dict:
    return {
        "cliente": _cliente(),
        "fecha_inicio": inicio,
        "fecha_fin": fin,
        "mensaje": "Para un evento",
        "items": [{"articulo_id": articulo_id, "cantidad": cantidad}],
    }


def test_crear_reserva_ok_y_crea_cliente(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=10)
    r = client.post(RES, json=_reserva_payload(articulo_id, 3, "2026-11-01", "2026-11-05"))
    assert r.status_code == 201
    datos = r.json()
    assert datos["estado"] == "pendiente"
    assert datos["cliente"]["correo"] == "ana@correo.com"
    assert datos["detalles"][0]["cantidad"] == 3
    # El cliente quedó registrado
    assert len(client.get("/api/v1/clientes").json()) == 1


def test_fecha_fin_anterior_es_rechazada(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=5)
    r = client.post(RES, json=_reserva_payload(articulo_id, 1, "2026-11-10", "2026-11-05"))
    assert r.status_code == 422


def test_cantidad_cero_es_rechazada(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=5)
    r = client.post(RES, json=_reserva_payload(articulo_id, 0, "2026-11-01", "2026-11-02"))
    assert r.status_code == 422


def test_sin_disponibilidad_en_periodo_solapado(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=5)
    # Reservo 4 de 5 del 1 al 5.
    client.post(RES, json=_reserva_payload(articulo_id, 4, "2026-11-01", "2026-11-05"))
    # Pido 2 más que solapan (del 3 al 7): solo queda 1 -> 409.
    r = client.post(RES, json=_reserva_payload(articulo_id, 2, "2026-11-03", "2026-11-07"))
    assert r.status_code == 409
    assert "disponibilidad" in r.json()["detail"].lower()


def test_hay_disponibilidad_justa_en_periodo_solapado(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=5)
    client.post(RES, json=_reserva_payload(articulo_id, 4, "2026-11-01", "2026-11-05"))
    # Pido 1 (la que queda) solapando -> 201.
    r = client.post(RES, json=_reserva_payload(articulo_id, 1, "2026-11-03", "2026-11-07"))
    assert r.status_code == 201


def test_periodos_que_no_solapan_no_compiten(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=5)
    client.post(RES, json=_reserva_payload(articulo_id, 5, "2026-11-01", "2026-11-05"))
    # Del 6 al 10 no solapa -> puedo volver a pedir las 5.
    r = client.post(RES, json=_reserva_payload(articulo_id, 5, "2026-11-06", "2026-11-10"))
    assert r.status_code == 201


def test_cancelar_libera_unidades(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=5)
    creada = client.post(
        RES, json=_reserva_payload(articulo_id, 5, "2026-11-01", "2026-11-05")
    ).json()
    # Sin disponibilidad mientras está activa.
    bloqueada = client.post(RES, json=_reserva_payload(articulo_id, 1, "2026-11-02", "2026-11-03"))
    assert bloqueada.status_code == 409
    # Cancelo y se liberan.
    cancelada = client.post(f"{RES}/{creada['id']}/cancelar")
    assert cancelada.status_code == 200
    assert cancelada.json()["estado"] == "cancelada"
    libre = client.post(RES, json=_reserva_payload(articulo_id, 5, "2026-11-02", "2026-11-03"))
    assert libre.status_code == 201


def test_consultar_disponibilidad(client: TestClient) -> None:
    articulo_id = _articulo_con_stock(client, stock=8)
    client.post(RES, json=_reserva_payload(articulo_id, 3, "2026-11-01", "2026-11-05"))
    r = client.get(
        f"{RES}/disponibilidad",
        params={
            "articulo_id": articulo_id,
            "fecha_inicio": "2026-11-02",
            "fecha_fin": "2026-11-04",
        },
    )
    assert r.status_code == 200
    datos = r.json()
    assert datos["stock_total"] == 8
    assert datos["unidades_disponibles"] == 5
