"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clase } from "@/lib/types"

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "admin123"

function formatFecha(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number)
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
  return `${d} ${meses[m - 1]} ${y}`
}

function ClaseCardAdmin({ clase, index, onDelete }: { clase: Clase; index: number; onDelete: (id: string) => void }) {
  return (
    <div
      className="rounded-3xl p-5 card-lift anim-page"
      style={{ backgroundColor: "#F7CEDF", animationDelay: `${index * 70}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium tracking-widest" style={{ color: "#C45A7A" }}>
          {formatFecha(clase.fecha)}
        </span>
        <Link
          href={`/admin/clase/${clase.id}`}
          className="text-base transition-opacity hover:opacity-60 btn-press"
          style={{ color: "#C45A7A" }}
        >
          ↗
        </Link>
      </div>
      <h2 className="text-2xl font-medium leading-tight mb-1" style={{ color: "#1C0814" }}>
        {clase.nombre}
      </h2>
      <p className="text-sm mb-8" style={{ color: "#C45A7A" }}>
        {clase.lugar}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "#F0C4D4", color: "#1C0814" }}>
          €{clase.precio}
        </span>
        <button
          onClick={() => onDelete(clase.id)}
          className="text-xs transition-opacity hover:opacity-60 btn-press"
          style={{ color: "#C45A7A" }}
        >
          eliminar
        </button>
      </div>
    </div>
  )
}

function CalendarioItemAdmin({ clase, index, onDelete }: { clase: Clase; index: number; onDelete: (id: string) => void }) {
  return (
    <div
      className="rounded-2xl px-5 py-4 flex items-center justify-between card-lift anim-page"
      style={{ backgroundColor: "#F7CEDF", animationDelay: `${index * 60}ms` }}
    >
      <div>
        <p className="text-xs tracking-widest mb-1" style={{ color: "#C45A7A" }}>
          {formatFecha(clase.fecha)} · {clase.hora}
        </p>
        <p className="text-lg font-medium" style={{ color: "#1C0814" }}>{clase.nombre}</p>
        <p className="text-sm" style={{ color: "#C45A7A" }}>{clase.lugar}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "#F0C4D4", color: "#1C0814" }}>
          €{clase.precio}
        </span>
        <Link href={`/admin/clase/${clase.id}`} className="text-base btn-press" style={{ color: "#C45A7A" }}>↗</Link>
        <button onClick={() => onDelete(clase.id)} className="text-xs hover:opacity-60 btn-press" style={{ color: "#C45A7A" }}>
          eliminar
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState("")
  const [pwError, setPwError] = useState(false)
  const [clases, setClases] = useState<Clase[]>([])
  const [vista, setVista] = useState<"galeria" | "calendario">("galeria")
  const [loading, setLoading] = useState(true)

  function loadClases() {
    fetch("/api/clases")
      .then((r) => r.json())
      .then((data) => { setClases(data); setLoading(false) })
  }

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
    } else {
      setPwError(true)
    }
  }

  useEffect(() => {
    if (authed) loadClases()
  }, [authed])

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta clase?")) return
    await fetch(`/api/clases/${id}`, { method: "DELETE" })
    setClases((prev) => prev.filter((c) => c.id !== id))
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#FDE8F3" }}>
        <div className="w-full max-w-sm anim-page">
          <h1 className="text-4xl font-light mb-2" style={{ color: "#1C0814" }}>/admin</h1>
          <p className="text-sm mb-8" style={{ color: "#C45A7A" }}>gestión · pagos · control</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="contraseña"
            className="w-full rounded-2xl px-4 py-3 text-sm input-focus mb-3"
            style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
          />
          {pwError && (
            <p className="text-xs mb-3 anim-scale" style={{ color: "#C45A7A" }}>Contraseña incorrecta</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-2xl text-sm font-medium btn-press"
            style={{ backgroundColor: "#FFFFFF", color: "#1C0814" }}
          >
            Entrar
          </button>
          <p className="text-xs mt-4 text-center" style={{ color: "#C45A7A" }}>
            Contraseña por defecto: <strong>admin123</strong>
          </p>
        </div>
      </div>
    )
  }

  const sorted = clases.slice().sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#FDE8F3" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-10 anim-page">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight" style={{ color: "#1C0814" }}>/ClasesIncera ✩</h1>
            <p className="text-sm mt-1" style={{ color: "#C45A7A" }}>gestión · pagos · control</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/nueva"
              className="px-4 py-2 rounded-2xl text-sm font-medium btn-press"
              style={{ backgroundColor: "#FFFFFF", color: "#1C0814" }}
            >
              + nueva clase
            </Link>
            <button
              onClick={() => setVista("galeria")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={vista === "galeria" ? { backgroundColor: "#FFFFFF", color: "#1C0814" } : { backgroundColor: "#F7CEDF", color: "#1C0814" }}
            >
              galería
            </button>
            <button
              onClick={() => setVista("calendario")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={vista === "calendario" ? { backgroundColor: "#FFFFFF", color: "#1C0814" } : { backgroundColor: "#F7CEDF", color: "#1C0814" }}
            >
              calendario
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl h-48 anim-fade" style={{ backgroundColor: "#F7CEDF", animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        ) : clases.length === 0 ? (
          <div className="text-center py-16 anim-fade">
            <p className="text-sm mb-4" style={{ color: "#C45A7A" }}>No hay clases todavía.</p>
            <Link href="/admin/nueva" className="inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-medium btn-press" style={{ backgroundColor: "#FFFFFF", color: "#1C0814" }}>
              Crear primera clase
            </Link>
          </div>
        ) : vista === "galeria" ? (
          <div key="galeria" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tab-content">
            {sorted.map((c, i) => <ClaseCardAdmin key={c.id} clase={c} index={i} onDelete={handleDelete} />)}
          </div>
        ) : (
          <div key="calendario" className="flex flex-col gap-3 tab-content">
            {sorted.map((c, i) => <CalendarioItemAdmin key={c.id} clase={c} index={i} onDelete={handleDelete} />)}
          </div>
        )}
      </div>
    </div>
  )
}
