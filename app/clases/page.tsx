"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Clase } from "@/lib/types"

function formatFecha(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number)
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
  return `${d} ${meses[m - 1]} ${y}`
}

function formatFechaCalendario(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number)
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  return `${d} de ${meses[m - 1]} de ${y}`
}

function ClaseCard({ clase, index }: { clase: Clase; index: number }) {
  return (
    <Link href={`/clases/${clase.id}`} className="block">
      <div
        className="rounded-3xl p-5 card-lift cursor-pointer anim-page"
        style={{
          backgroundColor: "#D8D4CE",
          animationDelay: `${index * 70}ms`,
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-medium tracking-widest" style={{ color: "#888884" }}>
            {formatFecha(clase.fecha)}
          </span>
          <span className="text-base transition-transform group-hover:translate-x-0.5" style={{ color: "#888884" }}>↗</span>
        </div>
        <h2 className="text-2xl font-medium leading-tight mb-1" style={{ color: "#1C1C1E" }}>
          {clase.nombre}
        </h2>
        <p className="text-sm mb-8" style={{ color: "#888884" }}>
          {clase.lugar}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: "#C8C4BE", color: "#1C1C1E" }}
          >
            €{clase.precio}
          </span>
        </div>
      </div>
    </Link>
  )
}

function CalendarioItem({ clase, index }: { clase: Clase; index: number }) {
  return (
    <Link href={`/clases/${clase.id}`} className="block">
      <div
        className="rounded-2xl px-5 py-4 flex items-center justify-between card-lift cursor-pointer anim-page"
        style={{
          backgroundColor: "#D8D4CE",
          animationDelay: `${index * 60}ms`,
        }}
      >
        <div>
          <p className="text-xs tracking-widest mb-1" style={{ color: "#888884" }}>
            {formatFechaCalendario(clase.fecha)} · {clase.hora}
          </p>
          <p className="text-lg font-medium" style={{ color: "#1C1C1E" }}>{clase.nombre}</p>
          <p className="text-sm" style={{ color: "#888884" }}>{clase.lugar}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: "#C8C4BE", color: "#1C1C1E" }}
          >
            €{clase.precio}
          </span>
          <span style={{ color: "#888884" }}>↗</span>
        </div>
      </div>
    </Link>
  )
}

export default function ClasesPage() {
  const [clases, setClases] = useState<Clase[]>([])
  const [vista, setVista] = useState<"galeria" | "calendario">("galeria")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/clases")
      .then((r) => r.json())
      .then((data) => {
        setClases(data.filter((c: Clase) => c.activa))
        setLoading(false)
      })
  }, [])

  const sorted = clases.slice().sort((a, b) => a.fecha.localeCompare(b.fecha))

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#E3DFD9" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 anim-page">
          <div>
            <h1 className="text-5xl font-light tracking-tight" style={{ color: "#1C1C1E" }}>
              /clasesAnko
            </h1>
            <p className="text-sm mt-1" style={{ color: "#888884" }}>
              reserva tu plaza · paga online
            </p>
          </div>
          {/* Vista toggle */}
          <div className="flex gap-1 mt-2">
            <button
              onClick={() => setVista("galeria")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={
                vista === "galeria"
                  ? { backgroundColor: "#1C1C1E", color: "#F5F3EF" }
                  : { backgroundColor: "#D8D4CE", color: "#1C1C1E" }
              }
            >
              galería
            </button>
            <button
              onClick={() => setVista("calendario")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={
                vista === "calendario"
                  ? { backgroundColor: "#1C1C1E", color: "#F5F3EF" }
                  : { backgroundColor: "#D8D4CE", color: "#1C1C1E" }
              }
            >
              calendario
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl h-48 anim-fade"
                style={{ backgroundColor: "#D8D4CE", animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : clases.length === 0 ? (
          <p className="text-sm anim-fade" style={{ color: "#888884" }}>No hay clases disponibles.</p>
        ) : vista === "galeria" ? (
          <div key="galeria" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 tab-content">
            {sorted.map((c, i) => <ClaseCard key={c.id} clase={c} index={i} />)}
          </div>
        ) : (
          <div key="calendario" className="flex flex-col gap-3 tab-content">
            {sorted.map((c, i) => <CalendarioItem key={c.id} clase={c} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
