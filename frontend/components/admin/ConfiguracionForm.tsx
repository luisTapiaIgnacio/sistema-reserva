"use client";

import { useActionState } from "react";
import { guardarConfiguracion, type EstadoConfiguracion } from "@/app/admin/(panel)/configuracion/actions";
import type { Configuracion } from "@/lib/tipos";

const inicial: EstadoConfiguracion = {};
const FILAS_BANCOS = 5;

const tarjeta = "space-y-4 rounded-2xl border border-white/10 bg-[#0d1b2a] p-5 md:p-6";
const titulo = "text-xs font-semibold uppercase tracking-wider text-white/50";
const etiqueta = "block text-sm text-white/80";
const campo =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white outline-none placeholder:text-white/30 focus:border-[#f5c542] md:text-sm";

export default function ConfiguracionForm({ configuracion }: { configuracion: Configuracion }) {
  const [estado, accion, guardando] = useActionState(guardarConfiguracion, inicial);
  // Tras guardar (o tras un error) se muestra lo último que se envió
  const c = estado.valores ?? configuracion;
  // Filas vacías al final para poder agregar cuentas
  const bancos = [...c.bancos, ...Array.from({ length: Math.max(0, FILAS_BANCOS - c.bancos.length) }, () => null)];

  return (
    <form action={accion} className="mt-6 space-y-5">
      <section className={tarjeta}>
        <h2 className={titulo}>Reservas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="horas_para_pagar" className={etiqueta}>Horas para mandar el comprobante</label>
            <input id="horas_para_pagar" name="horas_para_pagar" type="number" min={1} max={72} required defaultValue={c.horas_para_pagar} className={campo} />
            <p className="text-xs text-white/50">Si no lo manda a tiempo, la fecha se libera sola.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="porcentaje_adelanto" className={etiqueta}>Adelanto mínimo (%)</label>
            <input id="porcentaje_adelanto" name="porcentaje_adelanto" type="number" min={1} max={100} required defaultValue={c.porcentaje_adelanto} className={campo} />
            <p className="text-xs text-white/50">Lo mínimo que debe pagar para confirmar.</p>
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="whatsapp" className={etiqueta}>WhatsApp del negocio</label>
          <input id="whatsapp" name="whatsapp" inputMode="tel" required defaultValue={c.whatsapp} placeholder="51913956853" className={campo} />
          <p className="text-xs text-white/50">Aquí llegan los mensajes de los clientes al reservar.</p>
        </div>
      </section>

      <section className={tarjeta}>
        <h2 className={titulo}>Yape / Plin</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="yape_plin_numero" className={etiqueta}>Número</label>
            <input id="yape_plin_numero" name="yape_plin_numero" required defaultValue={c.yape_plin_numero} className={campo} />
          </div>
          <div className="space-y-2">
            <label htmlFor="yape_plin_titular" className={etiqueta}>Titular</label>
            <input id="yape_plin_titular" name="yape_plin_titular" required defaultValue={c.yape_plin_titular} className={campo} />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="yape_plin_qr" className={etiqueta}>Imagen del QR (ruta, opcional)</label>
          <input id="yape_plin_qr" name="yape_plin_qr" defaultValue={c.yape_plin_qr ?? ""} placeholder="/images/pagos/qr-yape.png" className={campo} />
        </div>
      </section>

      <section className={tarjeta}>
        <h2 className={titulo}>Cuentas bancarias</h2>
        <div className="space-y-2">
          {bancos.map((b, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1.4fr]">
              <input name="banco" defaultValue={b?.banco ?? ""} placeholder="Banco (ej. BCP)" aria-label={`Banco ${i + 1}`} className={campo} />
              <input name="tipo" defaultValue={b?.tipo ?? ""} placeholder="Tipo (ej. Ahorros soles)" aria-label={`Tipo de cuenta ${i + 1}`} className={campo} />
              <input name="numero" defaultValue={b?.numero ?? ""} placeholder="Número o CCI" aria-label={`Número de cuenta ${i + 1}`} className={`${campo} font-mono`} />
            </div>
          ))}
        </div>
        <p className="text-xs text-white/50">Deja la fila vacía para quitar una cuenta.</p>
        <div className="space-y-2">
          <label htmlFor="bancos_titular" className={etiqueta}>Titular de las cuentas</label>
          <input id="bancos_titular" name="bancos_titular" required defaultValue={c.bancos_titular} className={campo} />
        </div>
      </section>

      {estado.error && (
        <p role="alert" className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{estado.error}</p>
      )}
      {estado.ok && (
        <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{estado.ok}</p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={guardando}
          className="cursor-pointer rounded-xl bg-[#f5c542] px-6 py-3 text-sm font-semibold text-[#02152b] transition-colors hover:bg-[#ffe9a8] disabled:opacity-60"
        >
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
