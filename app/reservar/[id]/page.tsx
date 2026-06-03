"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Clase } from "@/lib/types"

export default function ReservarPage() {
  const params = useParams()
  const router = useRouter()
  const claseId = params.id as string

  const [clase, setClase] = useState<Clase | null>(null)
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/clases/${claseId}`)
      .then((r) => r.json())
      .then(setClase)
  }, [claseId])

  async function handlePagar() {
    if (!nombre.trim() || !apellido.trim()) {
      setError("Nombre y apellido son obligatorios")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setError("El email es obligatorio")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claseId, nombre: nombre.trim(), apellido: apellido.trim(), email: email.trim() }),
      })
      const data = await res.json()
      if (data.url) {
        router.push(data.url)
      } else {
        setError(data.error ?? "Error al procesar el pago. Comprueba la configuración de Stripe.")
        setLoading(false)
      }
    } catch {
      setError("Error de conexión")
      setLoading(false)
    }
  }

  if (!clase) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#FDE8F3" }}>
        <p className="text-sm anim-fade" style={{ color: "#C45A7A" }}>cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#FDE8F3" }}>
      <div className="max-w-lg mx-auto">

        {/* Back */}
        <Link
          href={`/clases/${claseId}`}
          className="inline-flex items-center gap-2 text-sm mb-8 btn-press anim-fade"
          style={{ color: "#C45A7A" }}
        >
          <span className="w-8 h-8 rounded-xl flex items-center justify-center text-sm" style={{ backgroundColor: "#F7CEDF" }}>
            ←
          </span>
          volver
        </Link>

        <div className="anim-page">
          <h1 className="text-3xl font-medium mb-1" style={{ color: "#1C0814" }}>Reservar plaza</h1>
          <p className="text-sm mb-8" style={{ color: "#C45A7A" }}>
            {clase.nombre} · €{clase.precio}
          </p>
        </div>

        {/* Resumen clase */}
        <div className="rounded-2xl p-4 mb-6 flex items-center justify-between anim-page" style={{ backgroundColor: "#F7CEDF", animationDelay: "60ms" }}>
          <div>
            <p className="font-medium" style={{ color: "#1C0814" }}>{clase.nombre}</p>
            <p className="text-sm" style={{ color: "#C45A7A" }}>{clase.lugar} · {clase.hora}</p>
          </div>
          <p className="text-lg font-medium" style={{ color: "#1C0814" }}>€{clase.precio}</p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3 mb-6 stagger">
          <div className="anim-page">
            <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>NOMBRE</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
              style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
            />
          </div>
          <div className="anim-page">
            <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>APELLIDO</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Tu apellido"
              className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
              style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
            />
          </div>
          <div className="anim-page">
            <label className="text-xs tracking-widest block mb-2" style={{ color: "#C45A7A" }}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-2xl px-4 py-3 text-sm input-focus"
              style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm mb-4 rounded-xl px-4 py-3 anim-scale" style={{ backgroundColor: "#F7CEDF", color: "#1C0814" }}>
            {error}
          </p>
        )}

        <div className="anim-page" style={{ animationDelay: "250ms" }}>
          <button
            onClick={handlePagar}
            disabled={loading}
            className="w-full flex items-center justify-center py-4 rounded-2xl text-base font-medium btn-press disabled:opacity-50"
            style={{ backgroundColor: "#FFFFFF", color: "#1C0814" }}
          >
            {loading ? "Redirigiendo..." : `Pagar €${clase.precio} con Bizum o tarjeta`}
          </button>
          <p className="text-xs text-center mt-3" style={{ color: "#C45A7A" }}>
            Pago seguro procesado por Stripe
          </p>
        </div>
      </div>
    </div>
  )
}
