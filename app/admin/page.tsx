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
      style={{ backgroundColor: "#D8D4CE", animationDelay: `${index * 70}ms` }}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium tracking-widest" style={{ color: "#888884" }}>
          {formatFecha(clase.fecha)}
        </span>
        <Link
          href={`/admin/clase/${clase.id}`}
          className="text-base transition-opacity hover:opacity-60 btn-press"
          style={{ color: "#888884" }}
        >
          ↗
        </Link>
      </div>
      <h2 className="text-2xl font-medium leading-tight mb-1" style={{ color: "#1C1C1E" }}>
        {clase.nombre}
      </h2>
      <p className="text-sm mb-8" style={{ color: "#888884" }}>
        {clase.lugar}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "#C8C4BE", color: "#1C1C1E" }}>
          €{clase.precio}
        </span>
        <button
          onClick={() => onDelete(clase.id)}
          className="text-xs transition-opacity hover:opacity-60 btn-press"
          style={{ color: "#888884" }}
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
      style={{ backgroundColor: "#D8D4CE", animationDelay: `${index * 60}ms` }}
    >
      <div>
        <p className="text-xs tracking-widest mb-1" style={{ color: "#888884" }}>
          {formatFecha(clase.fecha)} · {clase.hora}
        </p>
        <p className="text-lg font-medium" style={{ color: "#1C1C1E" }}>{clase.nombre}</p>
        <p className="text-sm" style={{ color: "#888884" }}>{clase.lugar}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm px-3 py-1 rounded-full" style={{ backgroundColor: "#C8C4BE", color: "#1C1C1E" }}>
          €{clase.precio}
        </span>
        <Link href={`/admin/clase/${clase.id}`} className="text-base btn-press" style={{ color: "#888884" }}>↗</Link>
        <button onClick={() => onDelete(clase.id)} className="text-xs hover:opacity-60 btn-press" style={{ color: "#888884" }}>
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
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#E3DFD9" }}>
        <div className="w-full max-w-sm anim-page">
          <h1 className="text-4xl font-light mb-2" style={{ color: "#1C1C1E" }}>/admin</h1>
          <p className="text-sm mb-8" style={{ color: "#888884" }}>gestión · pagos · control</p>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPwError(false) }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="contraseña"
            className="w-full rounded-2xl px-4 py-3 text-sm input-focus mb-3"
            style={{ backgroundColor: "#D8D4CE", color: "#1C1C1E" }}
          />
          {pwError && (
            <p className="text-xs mb-3 anim-scale" style={{ color: "#888884" }}>Contraseña incorrecta</p>
          )}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-2xl text-sm font-medium btn-press"
            style={{ backgroundColor: "#1C1C1E", color: "#F5F3EF" }}
          >
            Entrar
          </button>
          <p className="text-xs mt-4 text-center" style={{ color: "#888884" }}>
            Contraseña por defecto: <strong>admin123</strong>
          </p>
        </div>
      </div>
    )
  }

  const sorted = clases.slice().sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#E3DFD9" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 anim-page">
          <div>
            <h1 className="text-5xl font-light tracking-tight" style={{ color: "#1C1C1E" }}>/clasesAnko</h1>
            <p className="text-sm mt-1" style={{ color: "#888884" }}>gestión · pagos · control</p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Link
              href="/admin/nueva"
              className="px-4 py-2 rounded-2xl text-sm font-medium btn-press"
              style={{ backgroundColor: "#1C1C1E", color: "#F5F3EF" }}
            >
              + nueva clase
            </Link>
            <button
              onClick={() => setVista("galeria")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={vista === "galeria" ? { backgroundColor: "#1C1C1E", color: "#F5F3EF" } : { backgroundColor: "#D8D4CE", color: "#1C1C1E" }}
            >
              galería
            </button>
            <button
              onClick={() => setVista("calendario")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={vista === "calendario" ? { backgroundColor: "#1C1C1E", color: "#F5F3EF" } : { backgroundColor: "#D8D4CE", color: "#1C1C1E" }}
            >
              calendario
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl h-48 anim-fade" style={{ backgroundColor: "#D8D4CE", animationDelay: `${i * 80}ms` }} />
            ))}
          </div>
        ) : clases.length === 0 ? (
          <div className="text-center py-16 anim-fade">
            <p className="text-sm mb-4" style={{ color: "#888884" }}>No hay clases todavía.</p>
            <Link href="/admin/nueva" className="inline-flex items-center justify-center px-5 py-3 rounded-2xl text-sm font-medium btn-press" style={{ backgroundColor: "#1C1C1E", color: "#F5F3EF" }}>
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
