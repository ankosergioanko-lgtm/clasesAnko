import { notFound } from "next/navigation"
import Link from "next/link"
import { getClase } from "@/lib/store"

function formatFechaLarga(fecha: string) {
  const [y, m, d] = fecha.split("-").map(Number)
  const meses = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
  return `${d} de ${meses[m - 1]} de ${y}`
}

export default async function ClasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const clase = getClase(id)
  if (!clase || !clase.activa) notFound()

  return (
    <div className="min-h-screen p-6 md:p-10" style={{ backgroundColor: "#E3DFD9" }}>
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <Link
          href="/clases"
          className="inline-flex items-center gap-2 text-sm mb-8 btn-press anim-fade"
          style={{ color: "#888884" }}
        >
          <span
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ backgroundColor: "#D8D4CE" }}
          >
            ←
          </span>
          volver
        </Link>

        {/* Title */}
        <div className="anim-page">
          <h1 className="text-4xl font-medium leading-tight mb-2" style={{ color: "#1C1C1E" }}>
            {clase.nombre}
          </h1>
          <p className="text-sm mb-8" style={{ color: "#888884" }}>
            {formatFechaLarga(clase.fecha)} · {clase.hora} · {clase.lugar}
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 stagger">
          <div className="rounded-2xl p-5 anim-page" style={{ backgroundColor: "#D8D4CE" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#888884" }}>LUGAR</p>
            <p className="text-lg font-medium" style={{ color: "#1C1C1E" }}>{clase.lugar}</p>
          </div>
          <div className="rounded-2xl p-5 anim-page" style={{ backgroundColor: "#D8D4CE" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#888884" }}>PRECIO</p>
            <p className="text-lg font-medium" style={{ color: "#1C1C1E" }}>€{clase.precio}</p>
          </div>
          <div className="rounded-2xl p-5 anim-page" style={{ backgroundColor: "#D8D4CE" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#888884" }}>FECHA</p>
            <p className="text-lg font-medium" style={{ color: "#1C1C1E" }}>{formatFechaLarga(clase.fecha)}</p>
          </div>
          <div className="rounded-2xl p-5 anim-page" style={{ backgroundColor: "#D8D4CE" }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: "#888884" }}>HORA</p>
            <p className="text-lg font-medium" style={{ color: "#1C1C1E" }}>{clase.hora}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="anim-page" style={{ animationDelay: "200ms" }}>
          <Link
            href={`/reservar/${clase.id}`}
            className="w-full flex items-center justify-center py-4 rounded-2xl text-base font-medium btn-press"
            style={{ backgroundColor: "#1C1C1E", color: "#F5F3EF" }}
          >
            Reservar plaza — €{clase.precio}
          </Link>
          <p className="text-xs text-center mt-3" style={{ color: "#888884" }}>
            Pago seguro con tarjeta o Bizum
          </p>
        </div>
      </div>
    </div>
  )
}
