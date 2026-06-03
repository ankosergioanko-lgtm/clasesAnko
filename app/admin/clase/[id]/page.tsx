"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Clase, Gasto, Reserva } from "@/lib/types"

function formatFechaCorta(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number)
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
  return `${d} ${meses[m - 1]} ${y}`
}

/* Count-up animation */
function useCountUp(target: number, duration = 650) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setValue(eased * target)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

function StatCard({ label, value, prefix = "", green = false, delay = 0, subtitle }: {
  label: string; value: number; prefix?: string; green?: boolean; delay?: number; subtitle?: string
}) {
  const display = useCountUp(value)
  return (
    <div
      className="rounded-2xl p-5 anim-page"
      style={{ backgroundColor: "#F09FBA", animationDelay: `${delay}ms` }}
    >
      <p className="text-xs tracking-widest mb-3" style={{ color: "#C45A7A" }}>{label}</p>
      <p
        className="text-5xl font-light mb-1"
        style={{ color: green ? "#4ADE80" : "#1C0814" }}
      >
        {prefix}{display % 1 === 0 ? Math.round(display) : display.toFixed(2)}
      </p>
      {subtitle && <p className="text-xs" style={{ color: "#C45A7A" }}>{subtitle}</p>}
    </div>
  )
}

export default function AdminClasePage() {
  const params = useParams()
  const claseId = params.id as string

  const [clase, setClase] = useState<Clase | null>(null)
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [tab, setTab] = useState<"asistentes" | "dinero">("asistentes")
  const [buscar, setBuscar] = useState("")
  const [nuevoNombre, setNuevoNombre] = useState("")
  const [nuevoMonto, setNuevoMonto] = useState(15)
  const [gastos, setGastos] = useState<Gasto[]>([
    { nombre: "Sala", monto: 0 },
    { nombre: "Videógrafo", monto: 0 },
  ])
  const [loading, setLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/clases/${claseId}`).then((r) => r.json()),
      fetch(`/api/reservas?claseId=${claseId}`).then((r) => r.json()),
    ]).then(([c, r]) => {
      setClase(c)
      setReservas(r)
      if (c.gastos?.length) setGastos(c.gastos)
      setLoading(false)
    })
  }, [claseId])

  const saveGastos = useCallback(async (updated: Gasto[]) => {
    if (!clase) return
    await fetch(`/api/clases/${claseId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...clase, gastos: updated }),
    })
  }, [clase, claseId])

  function updateGasto(i: number, monto: number) {
    const updated = gastos.map((g, idx) => idx === i ? { ...g, monto } : g)
    setGastos(updated)
    saveGastos(updated)
  }

  async function handleAgregar() {
    if (!nuevoNombre.trim()) return
    const parts = nuevoNombre.trim().split(" ")
    const nombre = parts[0]
    const apellido = parts.slice(1).join(" ")
    const res = await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claseId, nombre, apellido, email: "", monto: nuevoMonto, estado: "invitado", pagado: false }),
    })
    const nueva = await res.json()
    setReservas((prev) => [...prev, nueva])
    setNuevoNombre("")
    inputRef.current?.focus()
  }

  async function handleTogglePagado(reserva: Reserva) {
    const updated = { ...reserva, pagado: !reserva.pagado, estado: (!reserva.pagado ? "confirmado" : "invitado") as Reserva["estado"] }
    await fetch(`/api/reservas/${reserva.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
    setReservas((prev) => prev.map((r) => r.id === reserva.id ? updated : r))
  }

  async function handleEliminar(id: string) {
    await fetch(`/api/reservas/${id}`, { method: "DELETE" })
    setReservas((prev) => prev.filter((r) => r.id !== id))
  }

  if (loading || !clase) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#F9B0C4" }}>
        <p className="text-sm anim-fade" style={{ color: "#C45A7A" }}>cargando...</p>
      </div>
    )
  }

  const filtradas = reservas.filter((r) =>
    `${r.nombre} ${r.apellido}`.toLowerCase().includes(buscar.toLowerCase())
  )
  const invitados = filtradas.filter((r) => !r.pagado)
  const confirmados = filtradas.filter((r) => r.pagado)
  const totalRecaudado = reservas.filter((r) => r.pagado).reduce((s, r) => s + r.monto, 0)
  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const ganancias = totalRecaudado - totalGastos

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#F9B0C4" }}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="anim-page">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/admin"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm btn-press"
              style={{ backgroundColor: "#F09FBA", color: "#1C0814" }}
            >
              ←
            </Link>
            <h1 className="text-3xl font-medium leading-tight" style={{ color: "#1C0814" }}>
              {clase.nombre}
            </h1>
          </div>
          <p className="text-sm mb-8 ml-12" style={{ color: "#C45A7A" }}>
            {formatFechaCorta(clase.fecha)} · {clase.lugar}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 anim-page" style={{ animationDelay: "60ms" }}>
          {(["asistentes", "dinero"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={tab === t ? { backgroundColor: "#FFF0F5", color: "#1C0814" } : { backgroundColor: "#F09FBA", color: "#1C0814" }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── TAB: ASISTENTES ── */}
        {tab === "asistentes" && (
          <div className="tab-content">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <StatCard label="TOTAL RESERVAS" value={reservas.length} delay={0} />
              <StatCard label="PAGADOS" value={confirmados.length} delay={80} />
            </div>

            {/* Buscar + agregar */}
            <div className="rounded-2xl p-4 mb-5 flex flex-col gap-3 anim-page" style={{ backgroundColor: "#F09FBA", animationDelay: "120ms" }}>
              <input
                type="text"
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                placeholder="buscar..."
                className="w-full rounded-xl px-4 py-3 text-sm input-focus"
                style={{ backgroundColor: "#E8A5BC", color: "#1C0814" }}
              />
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={nuevoNombre}
                  onChange={(e) => setNuevoNombre(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAgregar()}
                  placeholder="nombre"
                  className="flex-1 rounded-xl px-4 py-3 text-sm input-focus"
                  style={{ backgroundColor: "#E8A5BC", color: "#1C0814" }}
                />
                <input
                  type="number"
                  value={nuevoMonto}
                  onChange={(e) => setNuevoMonto(Number(e.target.value))}
                  className="w-20 rounded-xl px-3 py-3 text-sm text-center input-focus"
                  style={{ backgroundColor: "#E8A5BC", color: "#1C0814" }}
                />
                <button
                  onClick={handleAgregar}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium btn-press btn-pop"
                  style={{ backgroundColor: "#FFF0F5", color: "#1C0814" }}
                >
                  +
                </button>
              </div>
              <p className="text-xs" style={{ color: "#C45A7A" }}>
                Ingresa nombre, monto y agregar. Luego marca como pagado.
              </p>
            </div>

            {/* INVITADOS */}
            {invitados.length > 0 && (
              <div className="mb-4">
                <p className="text-xs tracking-widest mb-2 flex items-center gap-1" style={{ color: "#C45A7A" }}>
                  <span>⭐</span> INVITADOS
                </p>
                <div className="flex flex-col gap-2">
                  {invitados.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl px-4 py-3 flex items-center justify-between anim-row"
                      style={{ backgroundColor: "#F09FBA" }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={r.pagado}
                          onChange={() => handleTogglePagado(r)}
                          className="w-4 h-4 rounded accent-stone-800"
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: "#1C0814" }}>
                            {r.nombre} {r.apellido}
                          </p>
                          <p className="text-xs" style={{ color: "#C45A7A" }}>€{r.monto.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs tracking-widest" style={{ color: "#C45A7A" }}>INVITADO</span>
                        <button
                          onClick={() => handleEliminar(r.id)}
                          className="text-xs hover:opacity-60 btn-press"
                          style={{ color: "#C45A7A" }}
                        >
                          eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CONFIRMADOS */}
            {confirmados.length > 0 && (
              <div>
                <p className="text-xs tracking-widest mb-2 flex items-center gap-1" style={{ color: "#C45A7A" }}>
                  <span>✓</span> CONFIRMADOS
                </p>
                <div className="flex flex-col gap-2">
                  {confirmados.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl px-4 py-3 flex items-center justify-between anim-row"
                      style={{ backgroundColor: "#F09FBA" }}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={r.pagado}
                          onChange={() => handleTogglePagado(r)}
                          className="w-4 h-4 rounded accent-stone-800"
                        />
                        <div>
                          <p className="font-medium text-sm" style={{ color: "#1C0814" }}>
                            {r.nombre} {r.apellido}
                          </p>
                          <p className="text-xs" style={{ color: "#C45A7A" }}>€{r.monto.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs tracking-widest" style={{ color: "#1C0814" }}>CONFIRMADO</span>
                        <button
                          onClick={() => handleEliminar(r.id)}
                          className="text-xs hover:opacity-60 btn-press"
                          style={{ color: "#C45A7A" }}
                        >
                          eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reservas.length === 0 && (
              <p className="text-sm text-center py-8 anim-fade" style={{ color: "#C45A7A" }}>
                Aún no hay reservas para esta clase.
              </p>
            )}
          </div>
        )}

        {/* ── TAB: DINERO ── */}
        {tab === "dinero" && (
          <div className="tab-content">
            {/* Stats dinero */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <StatCard
                label="TOTAL RECAUDADO"
                value={totalRecaudado}
                prefix="€"
                delay={0}
                subtitle="Asistentes que han pagado"
              />
              <StatCard
                label="GANANCIAS"
                value={ganancias}
                prefix="€"
                green
                delay={80}
                subtitle="Recaudado menos gastos"
              />
            </div>

            {/* Gastos */}
            <div
              className="rounded-2xl overflow-hidden anim-page"
              style={{ backgroundColor: "#F09FBA", animationDelay: "160ms" }}
            >
              <p className="text-xs tracking-widest px-5 pt-5 pb-3" style={{ color: "#C45A7A" }}>
                GASTOS
              </p>

              {gastos.map((g, i) => (
                <div key={i}>
                  <div className="flex items-center px-5 py-3">
                    <p className="flex-1 text-sm font-medium" style={{ color: "#1C0814" }}>{g.nombre}</p>
                    <input
                      type="number"
                      value={g.monto === 0 ? "" : g.monto}
                      onChange={(e) => updateGasto(i, Number(e.target.value) || 0)}
                      placeholder={`€0 (opcional)`}
                      className="w-40 rounded-xl px-3 py-2 text-sm text-right input-focus"
                      style={{ backgroundColor: "#E8A5BC", color: "#1C0814" }}
                    />
                  </div>
                  {i < gastos.length - 1 && (
                    <div className="mx-5" style={{ height: "1px", backgroundColor: "#E8A5BC" }} />
                  )}
                </div>
              ))}

              <div className="mx-5" style={{ height: "1px", backgroundColor: "#E8A5BC" }} />
              <div className="flex items-center px-5 py-4">
                <p className="flex-1 text-sm" style={{ color: "#C45A7A" }}>Total gastos</p>
                <p className="text-sm font-medium" style={{ color: "#1C0814" }}>
                  €{totalGastos.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Detalle pagos */}
            {confirmados.length > 0 && (
              <div className="mt-5 anim-page" style={{ animationDelay: "240ms" }}>
                <p className="text-xs tracking-widest mb-2" style={{ color: "#C45A7A" }}>PAGOS RECIBIDOS</p>
                <div className="flex flex-col gap-2">
                  {confirmados.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-2xl px-4 py-3 flex items-center justify-between anim-row"
                      style={{ backgroundColor: "#F09FBA" }}
                    >
                      <p className="font-medium text-sm" style={{ color: "#1C0814" }}>
                        {r.nombre} {r.apellido}
                      </p>
                      <p className="text-sm font-medium" style={{ color: "#1C0814" }}>€{r.monto.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
