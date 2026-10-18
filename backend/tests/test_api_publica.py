"""Pruebas de la API pública: catálogo, disponibilidad, reservas y pagos."""

from datetime import date, timedelta
from decimal import Decimal
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.fechas import ahora, hoy_local
from app.models import (
    Categoria,
    EstadoPago,
    EstadoReserva,
    EstadoUnidad,
    Pago,
    Producto,
    Reserva,
    Unidad,
)

API = "/api/v1"
FECHA = date(2030, 11, 15)  # lejos en el futuro: siempre es "a partir de mañana"


@pytest.fixture()
def catalogo(db: Session) -> dict[str, int]:
    """Espejo (2 unidades operativas + 1 en mantenimiento) y Cabina (1 unidad)."""
    espejos = Categoria(nombre="Espejos", slug="espejos", orden=1)
    cabinas = Categoria(nombre="Cabinas", slug="cabinas", orden=2)
    oculta = Categoria(nombre="Oculta", slug="oculta", orden=3, activa=False)
    espejo = Producto(nombre="Espejo 65″", slug="espejo-65", precio=Decimal("650"), categoria=espejos)
    cabina = Producto(nombre="Cabina 360", slug="cabina-360", precio=Decimal("401"), categoria=cabinas)
    inactivo = Producto(nombre="Espejo viejo", slug="espejo-viejo", precio=Decimal("100"), categoria=espejos, activo=False)
    escondido = Producto(nombre="Secreto", slug="secreto", precio=Decimal("100"), categoria=oculta)
    db.add_all([espejos, cabinas, oculta, espejo, cabina, inactivo, escondido])
    db.add_all(
        [
            Unidad(codigo="ESP-001", producto=espejo),
            Unidad(codigo="ESP-002", producto=espejo),
            Unidad(codigo="ESP-003", producto=espejo, estado=EstadoUnidad.MANTENIMIENTO),
            Unidad(codigo="CAB-001", producto=cabina),
        ]
    )
    db.commit()
    return {"espejo": espejo.id, "cabina": cabina.id, "inactivo": inactivo.id, "escondido": escondido.id}


def datos_reserva(items: list[dict[str, int]], **cambios: Any) -> dict[str, Any]:
    datos: dict[str, Any] = {
        "fecha_inicio": FECHA.isoformat(),
        "horario": "6 pm - 11 pm",
        "distrito": "Miraflores",
        "cliente": {"nombre": "Camila Ríos", "celular": "+51 987 654 321", "email": ""},
        "items": items,
    }
    datos.update(cambios)
    return datos


def reservar(client: TestClient, items: list[dict[str, int]], **cambios: Any) -> Any:
    return client.post(f"{API}/reservas", json=datos_reserva(items, **cambios))


# ---------- Catálogo ----------


def test_categorias_solo_activas_con_productos(client: TestClient, catalogo: dict[str, int]) -> None:
    respuesta = client.get(f"{API}/categorias")

    assert respuesta.status_code == 200
    assert [c["slug"] for c in respuesta.json()] == ["espejos", "cabinas"]


def test_productos_activos_con_unidades_operativas(client: TestClient, catalogo: dict[str, int]) -> None:
    productos = client.get(f"{API}/productos").json()

    assert {p["slug"]: p["operativas"] for p in productos} == {"cabina-360": 1, "espejo-65": 2}
    assert next(p for p in productos if p["slug"] == "espejo-65")["precio"] == 650.0


def test_productos_filtrados_por_categoria(client: TestClient, catalogo: dict[str, int], db: Session) -> None:
    cabinas = db.scalar(select(Categoria).where(Categoria.slug == "cabinas"))
    productos = client.get(f"{API}/productos", params={"categoria_id": cabinas.id}).json()

    assert [p["slug"] for p in productos] == ["cabina-360"]


# ---------- Disponibilidad ----------


def test_disponibilidad_del_mes_para_varios_productos(client: TestClient, catalogo: dict[str, int]) -> None:
    reservar(client, [{"producto_id": catalogo["espejo"], "cantidad": 1}])

    respuesta = client.get(
        f"{API}/disponibilidad",
        params={"mes": "2030-11", "producto_id": [catalogo["espejo"], catalogo["cabina"]]},
    )

    assert respuesta.status_code == 200
    espejo, cabina = respuesta.json()["productos"]
    assert len(espejo["libres"]) == 30
    assert espejo["total"] == 2
    assert espejo["libres"]["2030-11-15"] == 1
    assert espejo["libres"]["2030-11-16"] == 2
    assert cabina["libres"]["2030-11-15"] == 1


@pytest.mark.parametrize("mes", ["2030-13", "2030-1", "noviembre"])
def test_disponibilidad_rechaza_mes_invalido(client: TestClient, catalogo: dict[str, int], mes: str) -> None:
    respuesta = client.get(f"{API}/disponibilidad", params={"mes": mes, "producto_id": catalogo["espejo"]})
    assert respuesta.status_code == 422


def test_disponibilidad_exige_producto(client: TestClient) -> None:
    assert client.get(f"{API}/disponibilidad", params={"mes": "2030-11"}).status_code == 422


# ---------- Crear reserva ----------


def test_crear_reserva_con_varios_productos(client: TestClient, catalogo: dict[str, int]) -> None:
    respuesta = reservar(
        client,
        [{"producto_id": catalogo["espejo"], "cantidad": 2}, {"producto_id": catalogo["cabina"], "cantidad": 1}],
    )

    assert respuesta.status_code == 201, respuesta.json()
    reserva = respuesta.json()
    assert reserva["codigo"] == f"R-{hoy_local().year}-0001"
    assert reserva["token_acceso"]
    assert reserva["estado"] == "PENDIENTE"
    assert reserva["vencida"] is False
    assert reserva["fecha_fin"] == FECHA.isoformat()  # un solo día si no se envía
    assert reserva["cliente_nombre"] == "Camila Ríos"
    assert [(i["nombre"], i["cantidad"], i["subtotal"]) for i in reserva["items"]] == [
        ("Espejo 65″", 2, 1300.0),
        ("Cabina 360", 1, 401.0),
    ]
    assert reserva["total"] == 1701.0
    assert reserva["adelanto"] == 851.0  # 50 % de 1701 = 850.50 → se redondea hacia arriba
    assert reserva["saldo"] == 850.0


def test_crear_reserva_normaliza_celular_y_reutiliza_cliente(
    client: TestClient, catalogo: dict[str, int], db: Session
) -> None:
    reservar(client, [{"producto_id": catalogo["espejo"]}])
    reservar(
        client,
        [{"producto_id": catalogo["cabina"]}],
        cliente={"nombre": "Camila Ríos Paz", "celular": "987654321", "email": "camila@gmail.com"},
    )

    reservas = db.scalars(select(Reserva)).all()
    assert len(reservas) == 2
    assert reservas[0].cliente_id == reservas[1].cliente_id
    cliente = reservas[0].cliente
    assert (cliente.celular, cliente.nombre, cliente.email) == ("987654321", "Camila Ríos Paz", "camila@gmail.com")


def test_codigos_de_reserva_son_correlativos(client: TestClient, catalogo: dict[str, int]) -> None:
    primera = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    segunda = reservar(
        client, [{"producto_id": catalogo["espejo"]}], cliente={"nombre": "Otro Cliente", "celular": "912345678"}
    ).json()

    assert primera["codigo"].endswith("-0001")
    assert segunda["codigo"].endswith("-0002")


def test_no_se_reserva_mas_de_lo_que_hay(client: TestClient, catalogo: dict[str, int]) -> None:
    assert reservar(client, [{"producto_id": catalogo["espejo"], "cantidad": 2}]).status_code == 201

    respuesta = reservar(
        client,
        [{"producto_id": catalogo["espejo"], "cantidad": 1}],
        cliente={"nombre": "Otro Cliente", "celular": "912345678"},
    )

    assert respuesta.status_code == 409
    assert respuesta.json()["sin_stock"] == [{"producto_id": catalogo["espejo"], "pedido": 1, "disponibles": 0}]


def test_pedir_mas_unidades_que_las_operativas_da_409(client: TestClient, catalogo: dict[str, int]) -> None:
    respuesta = reservar(client, [{"producto_id": catalogo["espejo"], "cantidad": 3}])

    assert respuesta.status_code == 409  # hay 3 unidades, pero una está en mantenimiento


def test_reserva_de_varios_dias_revisa_cada_dia(client: TestClient, catalogo: dict[str, int]) -> None:
    # La cabina (1 unidad) está ocupada solo el día 16.
    otra_fecha = (FECHA + timedelta(days=1)).isoformat()
    reservar(client, [{"producto_id": catalogo["cabina"]}], fecha_inicio=otra_fecha)

    respuesta = reservar(
        client,
        [{"producto_id": catalogo["cabina"]}],
        fecha_fin=(FECHA + timedelta(days=2)).isoformat(),
        cliente={"nombre": "Otro Cliente", "celular": "912345678"},
    )

    assert respuesta.status_code == 409


def test_reserva_vencida_libera_la_fecha(client: TestClient, catalogo: dict[str, int], db: Session) -> None:
    reservar(client, [{"producto_id": catalogo["cabina"]}])
    reserva = db.scalar(select(Reserva))
    reserva.expira_en = ahora() - timedelta(minutes=1)
    db.commit()

    respuesta = reservar(
        client, [{"producto_id": catalogo["cabina"]}], cliente={"nombre": "Otro Cliente", "celular": "912345678"}
    )

    assert respuesta.status_code == 201


def test_reserva_cancelada_libera_la_fecha(client: TestClient, catalogo: dict[str, int], db: Session) -> None:
    reservar(client, [{"producto_id": catalogo["cabina"]}])
    db.scalar(select(Reserva)).estado = EstadoReserva.CANCELADA
    db.commit()

    respuesta = reservar(
        client, [{"producto_id": catalogo["cabina"]}], cliente={"nombre": "Otro Cliente", "celular": "912345678"}
    )

    assert respuesta.status_code == 201


def test_doble_envio_no_duplica_ni_revela_el_link(client: TestClient, catalogo: dict[str, int]) -> None:
    primera = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    repetida = reservar(client, [{"producto_id": catalogo["espejo"]}])

    assert repetida.status_code == 409
    assert repetida.json()["codigo"] == primera["codigo"]
    assert "token_acceso" not in repetida.json()


def test_mismo_cliente_puede_reservar_otros_productos_esa_fecha(client: TestClient, catalogo: dict[str, int]) -> None:
    reservar(client, [{"producto_id": catalogo["espejo"]}])

    assert reservar(client, [{"producto_id": catalogo["cabina"]}]).status_code == 201


@pytest.mark.parametrize("clave", ["inactivo", "escondido"])
def test_no_se_reservan_productos_no_disponibles(client: TestClient, catalogo: dict[str, int], clave: str) -> None:
    respuesta = reservar(client, [{"producto_id": catalogo[clave]}])

    assert respuesta.status_code == 422
    assert respuesta.json()["productos_no_disponibles"] == [catalogo[clave]]


def test_no_se_reserva_para_hoy(client: TestClient, catalogo: dict[str, int]) -> None:
    respuesta = reservar(client, [{"producto_id": catalogo["espejo"]}], fecha_inicio=hoy_local().isoformat())

    assert respuesta.status_code == 422
    assert respuesta.json()["detail"] == "Elige una fecha a partir de mañana."


@pytest.mark.parametrize(
    "cambios",
    [
        {"items": []},
        {"cliente": {"nombre": "Ana", "celular": "12345"}},
        {"cliente": {"nombre": "Ana", "celular": "887654321"}},
        {"cliente": {"nombre": "A", "celular": "987654321"}},
        {"cliente": {"nombre": "Ana", "celular": "987654321", "email": "no-es-correo"}},
        {"fecha_fin": (FECHA - timedelta(days=1)).isoformat()},
        {"fecha_fin": (FECHA + timedelta(days=7)).isoformat()},  # 8 días
    ],
)
def test_datos_invalidos_dan_422(client: TestClient, catalogo: dict[str, int], cambios: dict[str, Any]) -> None:
    datos = {**datos_reserva([{"producto_id": catalogo["espejo"]}]), **cambios}
    assert client.post(f"{API}/reservas", json=datos).status_code == 422


def test_producto_repetido_o_cantidad_invalida_da_422(client: TestClient, catalogo: dict[str, int]) -> None:
    pid = catalogo["espejo"]
    assert reservar(client, [{"producto_id": pid}, {"producto_id": pid}]).status_code == 422
    assert reservar(client, [{"producto_id": pid, "cantidad": 0}]).status_code == 422
    assert reservar(client, [{"producto_id": pid, "cantidad": 11}]).status_code == 422


# ---------- Ver reserva ----------


def test_ver_reserva_con_token(client: TestClient, catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()

    respuesta = client.get(f"{API}/reservas/{creada['codigo']}", params={"t": creada["token_acceso"]})

    assert respuesta.status_code == 200
    assert respuesta.json()["codigo"] == creada["codigo"]
    assert "token_acceso" not in respuesta.json()


@pytest.mark.parametrize("token", ["token-falso", None])
def test_ver_reserva_sin_token_correcto(client: TestClient, catalogo: dict[str, int], token: str | None) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    params = {"t": token} if token else {}

    respuesta = client.get(f"{API}/reservas/{creada['codigo']}", params=params)

    assert respuesta.status_code in (404, 422)


def test_ver_reserva_inexistente_da_404(client: TestClient) -> None:
    assert client.get(f"{API}/reservas/R-2030-9999", params={"t": "x"}).status_code == 404


def test_reserva_vencida_se_marca(client: TestClient, catalogo: dict[str, int], db: Session) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    db.scalar(select(Reserva)).expira_en = ahora() - timedelta(minutes=1)
    db.commit()

    respuesta = client.get(f"{API}/reservas/{creada['codigo']}", params={"t": creada["token_acceso"]})

    assert respuesta.json()["vencida"] is True


# ---------- Informar pago ----------


def informar(client: TestClient, reserva: dict[str, Any], **datos: str) -> Any:
    cuerpo = {"metodo": "YAPE", "numero_operacion": "00123456", **datos}
    return client.post(f"{API}/reservas/{reserva['codigo']}/pagos", params={"t": reserva["token_acceso"]}, json=cuerpo)


def test_informar_pago(client: TestClient, catalogo: dict[str, int], db: Session) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()

    respuesta = informar(client, creada, numero_operacion=" 0012 3456 ")

    assert respuesta.status_code == 201
    datos = respuesta.json()
    assert datos["pago_en_revision"] is True
    assert datos["pagos"][0]["monto"] == creada["adelanto"]
    pago = db.scalar(select(Pago))
    assert (pago.numero_operacion, pago.estado) == ("00123456", EstadoPago.POR_VERIFICAR)
    assert pago.reserva.canal_pago.value == "YAPE_PLIN"


def test_no_se_informa_dos_veces_mientras_se_verifica(client: TestClient, catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    informar(client, creada)

    assert informar(client, creada, numero_operacion="99999999").status_code == 409


def test_numero_de_operacion_repetido_da_409(client: TestClient, catalogo: dict[str, int]) -> None:
    primera = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    segunda = reservar(
        client, [{"producto_id": catalogo["cabina"]}], cliente={"nombre": "Otro Cliente", "celular": "912345678"}
    ).json()
    informar(client, primera)

    respuesta = informar(client, segunda)

    assert respuesta.status_code == 409
    assert respuesta.json()["detail"] == "Ese número de operación ya fue registrado."


def test_no_se_informa_pago_de_reserva_vencida(client: TestClient, catalogo: dict[str, int], db: Session) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()
    db.scalar(select(Reserva)).expira_en = ahora() - timedelta(minutes=1)
    db.commit()

    assert informar(client, creada).status_code == 409


def test_informar_pago_con_token_falso_da_404(client: TestClient, catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()

    assert informar(client, {**creada, "token_acceso": "falso"}).status_code == 404


@pytest.mark.parametrize("cuerpo", [{"metodo": "EFECTIVO"}, {"numero_operacion": "12"}, {"numero_operacion": "abc$%&"}])
def test_informar_pago_datos_invalidos(client: TestClient, catalogo: dict[str, int], cuerpo: dict[str, str]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}]).json()

    assert informar(client, creada, **cuerpo).status_code == 422
