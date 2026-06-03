import Link from "next/link"

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#E3DFD9" }}>
      <div className="max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ backgroundColor: "#D8D4CE" }}
        >
          ✓
        </div>
        <h1 className="text-3xl font-medium mb-3" style={{ color: "#1C1C1E" }}>
          ¡Plaza reservada!
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#888884" }}>
          Tu pago se ha procesado correctamente. Recibirás los detalles por email. ¡Te esperamos en clase!
        </p>
        <Link
          href="/clases"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1C1C1E", color: "#F5F3EF" }}
        >
          Ver más clases
        </Link>
      </div>
    </div>
  )
}
