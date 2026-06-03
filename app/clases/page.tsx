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
          backgroundColor: "#F7CEDF",
          animationDelay: `${index * 70}ms`,
        }}
      >
        <div className="flex justify-between items-start mb-3">
          <span className="text-xs font-medium tracking-widest" style={{ color: "#C45A7A" }}>
            {formatFecha(clase.fecha)}
          </span>
          <span className="text-base transition-transform group-hover:translate-x-0.5" style={{ color: "#C45A7A" }}>↗</span>
        </div>
        <h2 className="text-2xl font-medium leading-tight mb-1" style={{ color: "#1C0814" }}>
          {clase.nombre}
        </h2>
        <p className="text-sm mb-8" style={{ color: "#C45A7A" }}>
          {clase.lugar}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: "#F0C4D4", color: "#1C0814" }}
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
          backgroundColor: "#F7CEDF",
          animationDelay: `${index * 60}ms`,
        }}
      >
        <div>
          <p className="text-xs tracking-widest mb-1" style={{ color: "#C45A7A" }}>
            {formatFechaCalendario(clase.fecha)} · {clase.hora}
          </p>
          <p className="text-lg font-medium" style={{ color: "#1C0814" }}>{clase.nombre}</p>
          <p className="text-sm" style={{ color: "#C45A7A" }}>{clase.lugar}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-sm px-3 py-1 rounded-full"
            style={{ backgroundColor: "#F0C4D4", color: "#1C0814" }}
          >
            €{clase.precio}
          </span>
          <span style={{ color: "#C45A7A" }}>↗</span>
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
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#FDE8F3" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10 anim-page">
          <div>
            <h1 className="text-5xl font-light tracking-tight" style={{ color: "#1C0814" }}>
              /ClasesIncera ✩
            </h1>
            <p className="text-sm mt-1" style={{ color: "#C45A7A" }}>
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
                  ? { backgroundColor: "#FFFFFF", color: "#1C0814" }
                  : { backgroundColor: "#F7CEDF", color: "#1C0814" }
              }
            >
              galería
            </button>
            <button
              onClick={() => setVista("calendario")}
              className="px-4 py-2 rounded-2xl text-sm font-medium toggle-btn btn-press"
              style={
                vista === "calendario"
                  ? { backgroundColor: "#FFFFFF", color: "#1C0814" }
                  : { backgroundColor: "#F7CEDF", color: "#1C0814" }
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
                style={{ backgroundColor: "#F7CEDF", animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        ) : clases.length === 0 ? (
          <p className="text-sm anim-fade" style={{ color: "#C45A7A" }}>No hay clases disponibles.</p>
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
