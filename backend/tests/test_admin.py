"""Pruebas del panel: sesión, reservas (confirmar, pagos, estados), novedades, inventario y configuración."""

from datetime import date, datetime, timedelta
from typing import Any

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.fechas import ahora, hoy_local
from app.core.security import crear_token
from app.models import EstadoUnidad, Reserva, Unidad

API = "/api/v1"
ADMIN = f"{API}/admin"
FECHA = date(2030, 11, 15)


def reservar(client: TestClient, items: list[dict[str, int]], celular: str = "987654321", **cambios: Any) -> dict:
    datos = {
        "fecha_inicio": FECHA.isoformat(),
        "horario": "6 pm - 11 pm",
        "cliente": {"nombre": "Camila Ríos", "celular": celular},
        "items": items,
        **cambios,
    }
    respuesta = client.post(f"{API}/reservas", json=datos)
    assert respuesta.status_code == 201, respuesta.json()
    return respuesta.json()


def confirmar(client: TestClient, admin: dict[str, str], codigo: str, **datos: Any) -> Any:
    cuerpo = {"pago": {"monto": 325, "metodo": "YAPE", "numero_operacion": "00112233"}, **datos}
    return client.post(f"{ADMIN}/reservas/{codigo}/confirmar", json=cuerpo, headers=admin)


def vencer(db: Session, codigo: str) -> None:
    db.scalar(select(Reserva).where(Reserva.codigo == codigo)).expira_en = ahora() - timedelta(minutes=1)
    db.commit()


def cambiar_estado(client: TestClient, admin: dict[str, str], codigo: str, estado: str, **datos: Any) -> Any:
    return client.post(f"{ADMIN}/reservas/{codigo}/estado", json={"estado": estado, **datos}, headers=admin)


# ---------- Sesión ----------


def test_login_correcto(client: TestClient, db: Session) -> None:
    from scripts.crear_admin import crear_o_actualizar_admin

    crear_o_actualizar_admin(db, "admin@miranda.pe", "clave-admin-123", "Luis")

    respuesta = client.post(f"{ADMIN}/login", json={"email": " Admin@Miranda.PE ", "password": "clave-admin-123"})

    assert respuesta.status_code == 200
    sesion = respuesta.json()
    assert sesion["token_type"] == "bearer"
    assert sesion["usuario"] == {"id": 1, "nombre": "Luis", "email": "admin@miranda.pe", "rol": "ADMIN"}
    yo = client.get(f"{ADMIN}/yo", headers={"Authorization": f"Bearer {sesion['access_token']}"})
    assert yo.json()["email"] == "admin@miranda.pe"


@pytest.mark.parametrize(
    "credenciales",
    [
        {"email": "admin@miranda.pe", "password": "clave-incorrecta"},
        {"email": "nadie@miranda.pe", "password": "clave-admin-123"},
    ],
)
def test_login_incorrecto_mismo_mensaje(client: TestClient, admin: dict[str, str], credenciales: dict) -> None:
    respuesta = client.post(f"{ADMIN}/login", json=credenciales)

    assert respuesta.status_code == 401
    assert respuesta.json()["detail"] == "Correo o contraseña incorrectos."


@pytest.mark.parametrize(
    "cabeceras",
    [{}, {"Authorization": "Bearer token-falso"}, {"Authorization": "Basic abc"}],
)
def test_panel_exige_sesion(client: TestClient, cabeceras: dict[str, str]) -> None:
    for ruta in ("/reservas", "/novedades", "/productos", "/configuracion", "/yo"):
        assert client.get(f"{ADMIN}{ruta}", headers=cabeceras).status_code == 401, ruta


def test_token_de_usuario_borrado_no_sirve(client: TestClient, admin: dict[str, str], db: Session) -> None:
    token, _ = crear_token(999)
    assert client.get(f"{ADMIN}/yo", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_operador_gestiona_reservas_pero_no_inventario(client: TestClient, operador: dict[str, str]) -> None:
    assert client.get(f"{ADMIN}/reservas", headers=operador).status_code == 200
    assert client.get(f"{ADMIN}/productos", headers=operador).status_code == 403
    assert client.patch(f"{ADMIN}/configuracion", json={"horas_para_pagar": 2}, headers=operador).status_code == 403


# ---------- Listado y detalle ----------


def test_listar_y_filtrar_reservas(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    r1 = reservar(client, [{"producto_id": catalogo["espejo"]}])
    r2 = reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")
    r3 = reservar(client, [{"producto_id": catalogo["espejo"]}], celular="923456789")
    vencer(db, r3["codigo"])

    def codigos(**params: Any) -> list[str]:
        respuesta = client.get(f"{ADMIN}/reservas", params=params, headers=admin)
        assert respuesta.status_code == 200
        return [r["codigo"] for r in respuesta.json()["items"]]

    assert codigos() == [r3["codigo"], r2["codigo"], r1["codigo"]]  # recientes primero
    assert set(codigos(estado="RESERVADA")) == {r1["codigo"], r2["codigo"]}
    assert codigos(estado="VENCIDA") == [r3["codigo"]]
    assert codigos(buscar="912345") == [r2["codigo"]]
    assert codigos(buscar=r1["codigo"]) == [r1["codigo"]]
    assert codigos(desde="2030-11-16") == []
    pagina = client.get(f"{ADMIN}/reservas", params={"por_pagina": 2, "pagina": 2}, headers=admin).json()
    assert (pagina["total"], len(pagina["items"])) == (3, 1)


def test_resumen_y_detalle(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(
        client, [{"producto_id": catalogo["espejo"], "cantidad": 2}, {"producto_id": catalogo["cabina"]}]
    )

    fila = client.get(f"{ADMIN}/reservas", headers=admin).json()["items"][0]
    assert fila["productos"] == "2× Espejo 65″, 1× Cabina 360"
    assert (fila["cliente_celular"], fila["pagado"], fila["vencida"]) == ("987654321", 0.0, False)

    detalle = client.get(f"{ADMIN}/reservas/{creada['codigo']}", headers=admin).json()
    assert detalle["token_acceso"] == creada["token_acceso"]
    assert detalle["enlace_whatsapp_cliente"] == "https://wa.me/51987654321"
    assert [i["unidades"] for i in detalle["items"]] == [[], []]


def test_reserva_inexistente_da_404(client: TestClient, admin: dict[str, str]) -> None:
    assert client.get(f"{ADMIN}/reservas/R-2030-9999", headers=admin).status_code == 404


# ---------- Confirmar ----------


def test_confirmar_registra_pago_y_asigna_unidades(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])

    respuesta = confirmar(client, admin, creada["codigo"])

    assert respuesta.status_code == 200, respuesta.json()
    detalle = respuesta.json()
    assert detalle["estado"] == "CONFIRMADA"
    assert detalle["expira_en"] is None
    assert detalle["canal_pago"] == "YAPE_PLIN"
    assert (detalle["pagado"], detalle["saldo"]) == (325.0, 325.0)
    assert detalle["pagos"][0]["origen"] == "WHATSAPP"
    assert detalle["pagos"][0]["estado"] == "VERIFICADO"
    assert [u["codigo"] for u in detalle["items"][0]["unidades"]] == ["ESP-001"]


def test_confirmar_con_pago_mayor_al_minimo(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])

    detalle = confirmar(client, admin, creada["codigo"], pago={"monto": 650, "metodo": "TRANSFERENCIA"}).json()

    assert (detalle["pagado"], detalle["saldo"]) == (650.0, 0.0)


def test_confirmar_exige_el_adelanto_minimo(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])

    respuesta = confirmar(client, admin, creada["codigo"], pago={"monto": 200, "metodo": "YAPE"})

    assert respuesta.status_code == 422
    assert respuesta.json()["detail"] == "Para confirmar, el pago mínimo es S/ 325.00. Registrado: S/ 200.00."
    # No se guardó nada.
    detalle = client.get(f"{ADMIN}/reservas/{creada['codigo']}", headers=admin).json()
    assert (detalle["estado"], detalle["pagos"]) == ("RESERVADA", [])


def test_confirmar_sin_pago_nuevo_si_ya_pago_antes(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    client.post(f"{ADMIN}/reservas/{creada['codigo']}/pagos", json={"monto": 400, "metodo": "PLIN"}, headers=admin)

    respuesta = client.post(f"{ADMIN}/reservas/{creada['codigo']}/confirmar", json={}, headers=admin)

    assert respuesta.status_code == 200
    assert respuesta.json()["pagado"] == 400.0


def test_confirmar_dos_veces_da_409(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    confirmar(client, admin, creada["codigo"])

    assert confirmar(client, admin, creada["codigo"], pago=None).status_code == 409


def test_confirmar_eligiendo_unidad(client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    item_id = client.get(f"{ADMIN}/reservas/{creada['codigo']}", headers=admin).json()["items"][0]["id"]
    esp2 = db.scalar(select(Unidad).where(Unidad.codigo == "ESP-002"))

    detalle = confirmar(
        client, admin, creada["codigo"], asignaciones=[{"reserva_item_id": item_id, "unidad_ids": [esp2.id]}]
    ).json()

    assert [u["codigo"] for u in detalle["items"][0]["unidades"]] == ["ESP-002"]


def test_no_se_asigna_unidad_en_mantenimiento_ni_ocupada(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    primera = reservar(client, [{"producto_id": catalogo["espejo"]}])
    segunda = reservar(client, [{"producto_id": catalogo["espejo"]}], celular="912345678")
    confirmar(client, admin, primera["codigo"])  # se lleva ESP-001
    item_id = client.get(f"{ADMIN}/reservas/{segunda['codigo']}", headers=admin).json()["items"][0]["id"]
    unidades = {u.codigo: u.id for u in db.scalars(select(Unidad)).all()}

    for codigo in ("ESP-001", "ESP-003"):  # ocupada / en mantenimiento
        respuesta = confirmar(
            client,
            admin,
            segunda["codigo"],
            pago={"monto": 325, "metodo": "YAPE"},
            asignaciones=[{"reserva_item_id": item_id, "unidad_ids": [unidades[codigo]]}],
        )
        assert respuesta.status_code == 409, codigo

    libres = client.get(f"{ADMIN}/reservas/{segunda['codigo']}/unidades", headers=admin).json()
    assert [u["codigo"] for u in libres[0]["libres"]] == ["ESP-002"]


def test_confirmar_reserva_vencida_si_aun_hay_stock(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["cabina"]}])
    vencer(db, creada["codigo"])

    assert confirmar(client, admin, creada["codigo"], pago={"monto": 201, "metodo": "YAPE"}).status_code == 200


def test_no_confirma_vencida_si_otro_tomo_la_fecha(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["cabina"]}])
    vencer(db, creada["codigo"])
    reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")  # toma la única cabina

    respuesta = confirmar(client, admin, creada["codigo"], pago={"monto": 201, "metodo": "YAPE"})

    assert respuesta.status_code == 409


def test_cambiar_unidad_de_reserva_confirmada(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    detalle = confirmar(client, admin, creada["codigo"]).json()
    esp2 = db.scalar(select(Unidad).where(Unidad.codigo == "ESP-002"))

    respuesta = client.put(
        f"{ADMIN}/reservas/{creada['codigo']}/unidades",
        json=[{"reserva_item_id": detalle["items"][0]["id"], "unidad_ids": [esp2.id]}],
        headers=admin,
    )

    assert respuesta.status_code == 200
    assert [u["codigo"] for u in respuesta.json()["items"][0]["unidades"]] == ["ESP-002"]


# ---------- Pagos ----------


def test_registrar_saldo_y_anular_pago(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    confirmar(client, admin, creada["codigo"])

    saldo = client.post(
        f"{ADMIN}/reservas/{creada['codigo']}/pagos", json={"monto": 325, "metodo": "EFECTIVO"}, headers=admin
    )
    assert saldo.status_code == 201
    detalle = saldo.json()
    assert (detalle["pagado"], detalle["saldo"]) == (650.0, 0.0)
    assert detalle["pagos"][1]["origen"] == "ADMIN"

    anulado = client.post(
        f"{ADMIN}/reservas/{creada['codigo']}/pagos/{detalle['pagos'][1]['id']}/anular", headers=admin
    ).json()
    assert (anulado["pagado"], anulado["pagos"][1]["estado"]) == (325.0, "ANULADO")


def test_pago_no_puede_superar_el_total(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    confirmar(client, admin, creada["codigo"])

    respuesta = client.post(
        f"{ADMIN}/reservas/{creada['codigo']}/pagos", json={"monto": 326, "metodo": "YAPE"}, headers=admin
    )

    assert respuesta.status_code == 422


def test_numero_de_operacion_no_se_repite(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    primera = reservar(client, [{"producto_id": catalogo["espejo"]}])
    segunda = reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")
    confirmar(client, admin, primera["codigo"])

    respuesta = confirmar(client, admin, segunda["codigo"])  # mismo N.º 00112233

    assert respuesta.status_code == 409
    assert respuesta.json()["detail"] == "Ese número de operación ya está registrado."


def test_no_se_anula_pago_de_otra_reserva(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    primera = reservar(client, [{"producto_id": catalogo["espejo"]}])
    segunda = reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")
    pago_id = confirmar(client, admin, primera["codigo"]).json()["pagos"][0]["id"]

    respuesta = client.post(f"{ADMIN}/reservas/{segunda['codigo']}/pagos/{pago_id}/anular", headers=admin)

    assert respuesta.status_code == 404


# ---------- Estados ----------


def test_ciclo_completo_hasta_finalizar(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    unidad_id = confirmar(client, admin, creada["codigo"]).json()["items"][0]["unidades"][0]["id"]

    assert cambiar_estado(client, admin, creada["codigo"], "EN_CURSO").json()["estado"] == "EN_CURSO"
    final = cambiar_estado(
        client, admin, creada["codigo"], "FINALIZADA", unidades_mantenimiento=[unidad_id], nota="Pantalla rayada"
    )

    assert final.status_code == 200
    assert final.json()["estado"] == "FINALIZADA"
    assert "FINALIZADA: Pantalla rayada" in final.json()["notas"]
    assert db.get(Unidad, unidad_id).estado == EstadoUnidad.MANTENIMIENTO


@pytest.mark.parametrize(
    ("previos", "nuevo"),
    [([], "EN_CURSO"), ([], "FINALIZADA"), (["CONFIRMAR"], "FINALIZADA"), (["CONFIRMAR", "CANCELADA"], "EN_CURSO")],
)
def test_transiciones_no_permitidas(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], previos: list[str], nuevo: str
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    for paso in previos:
        if paso == "CONFIRMAR":
            confirmar(client, admin, creada["codigo"])
        else:
            cambiar_estado(client, admin, creada["codigo"], paso)

    assert cambiar_estado(client, admin, creada["codigo"], nuevo).status_code == 409


def test_cancelar_confirmada_libera_unidad_y_fecha(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["cabina"]}])
    confirmar(client, admin, creada["codigo"], pago={"monto": 201, "metodo": "YAPE"})

    assert cambiar_estado(client, admin, creada["codigo"], "CANCELADA").json()["estado"] == "CANCELADA"
    otra = reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")
    assert confirmar(client, admin, otra["codigo"], pago={"monto": 201, "metodo": "PLIN"}).status_code == 200


def test_mantenimiento_solo_unidades_de_la_reserva(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    confirmar(client, admin, creada["codigo"])  # ESP-001
    cambiar_estado(client, admin, creada["codigo"], "EN_CURSO")
    esp2 = db.scalar(select(Unidad).where(Unidad.codigo == "ESP-002"))

    respuesta = cambiar_estado(client, admin, creada["codigo"], "FINALIZADA", unidades_mantenimiento=[esp2.id])

    assert respuesta.status_code == 422


# ---------- Ampliar plazo ----------


def test_ampliar_plazo_suma_horas(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])

    detalle = client.post(
        f"{ADMIN}/reservas/{creada['codigo']}/ampliar-plazo", json={"horas": 2}, headers=admin
    ).json()

    antes, despues = (datetime.fromisoformat(x) for x in (creada["expira_en"], detalle["expira_en"]))
    assert despues - antes == timedelta(hours=2)  # se suma al plazo que tenía, no a la hora actual


def test_ampliar_plazo_de_vencida_revisa_stock(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["cabina"]}])
    vencer(db, creada["codigo"])
    reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")

    respuesta = client.post(f"{ADMIN}/reservas/{creada['codigo']}/ampliar-plazo", json={"horas": 2}, headers=admin)

    assert respuesta.status_code == 409


def test_ampliar_plazo_reactiva_vencida_con_stock(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["cabina"]}])
    vencer(db, creada["codigo"])

    detalle = client.post(
        f"{ADMIN}/reservas/{creada['codigo']}/ampliar-plazo", json={"horas": 3}, headers=admin
    ).json()

    assert detalle["vencida"] is False


# ---------- Novedades ----------


def test_novedades(client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session) -> None:
    vacio = client.get(f"{ADMIN}/novedades", headers=admin).json()
    assert (vacio["por_confirmar"], vacio["ultima_reserva"]) == (0, None)

    r1 = reservar(client, [{"producto_id": catalogo["espejo"]}])
    r2 = reservar(client, [{"producto_id": catalogo["cabina"]}], celular="912345678")
    # r2 vence en 30 min
    db.scalar(select(Reserva).where(Reserva.codigo == r2["codigo"])).expira_en = ahora() + timedelta(minutes=30)
    db.commit()

    datos = client.get(f"{ADMIN}/novedades", headers=admin).json()
    assert (datos["por_confirmar"], datos["por_vencer"]) == (2, 1)
    assert datos["ultima_reserva"]["codigo"] == r2["codigo"]
    assert datos["ultima_reserva"]["cliente_nombre"] == "Camila Ríos"

    confirmar(client, admin, r1["codigo"])
    despues = client.get(f"{ADMIN}/novedades", headers=admin).json()
    assert despues["por_confirmar"] == 1
    assert despues["firma"] != datos["firma"]


def test_novedades_entregas_y_recojos_de_hoy(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    confirmar(client, admin, creada["codigo"])
    reserva = db.scalar(select(Reserva))
    reserva.fecha_inicio = reserva.fecha_fin = hoy_local()
    db.commit()

    assert client.get(f"{ADMIN}/novedades", headers=admin).json()["entregas_pendientes"] == 1
    cambiar_estado(client, admin, creada["codigo"], "EN_CURSO")
    datos = client.get(f"{ADMIN}/novedades", headers=admin).json()
    assert (datos["entregas_pendientes"], datos["recojos_pendientes"]) == (0, 1)


# ---------- Inventario ----------


def test_crear_categoria_y_producto_con_unidades(client: TestClient, admin: dict[str, str]) -> None:
    categoria = client.post(f"{ADMIN}/categorias", json={"nombre": "Cabinas 360°"}, headers=admin).json()
    assert (categoria["slug"], categoria["orden"]) == ("cabinas-360", 1)

    producto = client.post(
        f"{ADMIN}/productos",
        json={"nombre": "Cabina Glam", "categoria_id": categoria["id"], "precio": "799.90", "descripcion": " "},
        headers=admin,
    ).json()
    assert (producto["slug"], producto["precio"], producto["descripcion"]) == ("cabina-glam", 799.9, None)

    con_unidades = client.post(
        f"{ADMIN}/productos/{producto['id']}/unidades", json={"cantidad": 3}, headers=admin
    ).json()
    assert [u["codigo"] for u in con_unidades["unidades"]] == ["CAB-001", "CAB-002", "CAB-003"]
    assert con_unidades["unidades_por_estado"]["OPERATIVA"] == 3

    mas = client.post(f"{ADMIN}/productos/{producto['id']}/unidades", json={"cantidad": 1}, headers=admin).json()
    assert mas["unidades"][-1]["codigo"] == "CAB-004"


def test_slug_repetido_agrega_numero(client: TestClient, admin: dict[str, str], catalogo: dict[str, int]) -> None:
    categoria = client.post(f"{ADMIN}/categorias", json={"nombre": "Espejos"}, headers=admin).json()

    assert categoria["slug"] == "espejos-2"


def test_desactivar_producto_lo_quita_de_la_web(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    respuesta = client.patch(f"{ADMIN}/productos/{catalogo['cabina']}", json={"activo": False}, headers=admin)

    assert respuesta.status_code == 200
    publicos = [p["id"] for p in client.get(f"{API}/productos").json()]
    assert catalogo["cabina"] not in publicos
    # En el panel sigue apareciendo.
    assert catalogo["cabina"] in [p["id"] for p in client.get(f"{ADMIN}/productos", headers=admin).json()]


def test_cambiar_precio_no_afecta_reservas_hechas(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    client.patch(f"{ADMIN}/productos/{catalogo['espejo']}", json={"precio": 999}, headers=admin)

    detalle = client.get(f"{ADMIN}/reservas/{creada['codigo']}", headers=admin).json()

    assert detalle["total"] == 650.0


def test_no_se_saca_de_servicio_unidad_con_evento_confirmado(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    unidad_id = confirmar(client, admin, creada["codigo"]).json()["items"][0]["unidades"][0]["id"]

    respuesta = client.patch(f"{ADMIN}/unidades/{unidad_id}", json={"estado": "BAJA"}, headers=admin)

    assert respuesta.status_code == 409
    assert respuesta.json()["reservas"] == [creada["codigo"]]
    # Las notas sí se pueden cambiar.
    notas = client.patch(f"{ADMIN}/unidades/{unidad_id}", json={"notas": "Revisar cable"}, headers=admin)
    assert notas.json()["notas"] == "Revisar cable"


def test_unidad_en_mantenimiento_reduce_stock(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int], db: Session
) -> None:
    esp1 = db.scalar(select(Unidad).where(Unidad.codigo == "ESP-001"))
    client.patch(f"{ADMIN}/unidades/{esp1.id}", json={"estado": "MANTENIMIENTO"}, headers=admin)

    productos = {p["id"]: p for p in client.get(f"{API}/productos").json()}

    assert productos[catalogo["espejo"]]["operativas"] == 1


# ---------- Configuración ----------


def test_cambiar_configuracion(client: TestClient, admin: dict[str, str]) -> None:
    respuesta = client.patch(
        f"{ADMIN}/configuracion",
        json={
            "horas_para_pagar": 2,
            "porcentaje_adelanto": 30,
            "whatsapp": "+51 913 000 111",
            "bancos": [{"banco": "BCP", "tipo": "Ahorros", "numero": "191-12345678-0-12"}],
        },
        headers=admin,
    )

    assert respuesta.status_code == 200
    datos = client.get(f"{API}/configuracion").json()
    assert (datos["horas_para_pagar"], datos["porcentaje_adelanto"], datos["whatsapp"]) == (2, 30, "51913000111")
    assert datos["bancos"] == [{"banco": "BCP", "tipo": "Ahorros", "numero": "191-12345678-0-12"}]
    assert datos["yape_plin_titular"] == "Miranda Magic Mirror"  # lo no enviado no cambia


@pytest.mark.parametrize(
    "cambios",
    [{"horas_para_pagar": 0}, {"porcentaje_adelanto": 101}, {"whatsapp": "123"}, {"horas_para_pagar": None}],
)
def test_configuracion_invalida(client: TestClient, admin: dict[str, str], cambios: dict) -> None:
    assert client.patch(f"{ADMIN}/configuracion", json=cambios, headers=admin).status_code == 422


def test_cambiar_configuracion_no_afecta_reservas_hechas(
    client: TestClient, admin: dict[str, str], catalogo: dict[str, int]
) -> None:
    creada = reservar(client, [{"producto_id": catalogo["espejo"]}])
    client.patch(f"{ADMIN}/configuracion", json={"porcentaje_adelanto": 100}, headers=admin)

    detalle = client.get(f"{ADMIN}/reservas/{creada['codigo']}", headers=admin).json()

    assert detalle["adelanto"] == 325.0
