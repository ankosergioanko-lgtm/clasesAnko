import Link from "next/link"

export default function ConfirmacionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#FDE8F3" }}>
      <div className="max-w-md w-full text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl"
          style={{ backgroundColor: "#F7CEDF" }}
        >
          ✓
        </div>
        <h1 className="text-3xl font-medium mb-3" style={{ color: "#1C0814" }}>
          ¡Plaza reservada!
        </h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "#C45A7A" }}>
          Tu pago se ha procesado correctamente. Recibirás los detalles por email. ¡Te esperamos en clase!
        </p>
        <Link
          href="/clases"
          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl text-sm font-medium transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#FFFFFF", color: "#1C0814" }}
        >
          Ver más clases
        </Link>
      </div>
    </div>
  )
}
