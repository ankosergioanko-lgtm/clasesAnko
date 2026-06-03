"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NuevaClasePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    hora: "20:00",
    lugar: "",
    precio: "15",
    capacidad: "20",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleGuardar() {
    if (!form.nombre || !form.fecha || !form.lugar) {
      setError("Nombre, fecha y lugar son obligatorios")
      return
    }
    setError("")
    setLoading(true)
    const res = await fetch("/api/clases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push("/admin")
    } else {
      setError("Error al guardar la clase")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#FDE8F3" }}>
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <div className="flex items-center gap-3 mb-8 anim-page">
          <Link
            href="/admin"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm btn-press"
            style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
          >
            ←
          </Link>
          <h1 className="text-3xl font-medium" style={{ color: "#1C0814" }}>Nueva clase</h1>
        </div>

        <div className="flex flex-col gap-4 stagger">

          {/* Nombre */}
          <div className="anim-page">
            <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>NOMBRE DE LA CLASE</label>
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder="Ej: Clase Glow Up x Javi Berga"
              className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
              style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
            />
          </div>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3 anim-page">
            <div>
              <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>FECHA</label>
              <input
                type="date"
                value={form.fecha}
                onChange={(e) => set("fecha", e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
                style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
              />
            </div>
            <div>
              <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>HORA</label>
              <input
                type="time"
                value={form.hora}
                onChange={(e) => set("hora", e.target.value)}
                className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
                style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
              />
            </div>
          </div>

          {/* Lugar */}
          <div className="anim-page">
            <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>LUGAR</label>
            <input
              type="text"
              value={form.lugar}
              onChange={(e) => set("lugar", e.target.value)}
              placeholder="Ej: Sala Apollo"
              className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
              style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
            />
          </div>

          {/* Precio y Capacidad */}
          <div className="grid grid-cols-2 gap-3 anim-page">
            <div>
              <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>PRECIO (€)</label>
              <input
                type="number"
                value={form.precio}
                onChange={(e) => set("precio", e.target.value)}
                min="0"
                className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
                style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
              />
            </div>
            <div>
              <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>CAPACIDAD</label>
              <input
                type="number"
                value={form.capacidad}
                onChange={(e) => set("capacidad", e.target.value)}
                min="1"
                className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
                style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
              />
            </div>
          </div>

          {error && (
            <p className="text-sm rounded-xl px-4 py-3 anim-scale" style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleGuardar}
            disabled={loading}
            className="w-full py-4 rounded-2xl text-sm font-medium btn-press disabled:opacity-50 anim-page"
            style={{ backgroundColor: "#FFFFFF", color: "#1C0814", animationDelay: "240ms" }}
          >
            {loading ? "Guardando..." : "Crear clase"}
          </button>
        </div>
      </div>
    </div>
  )
}
