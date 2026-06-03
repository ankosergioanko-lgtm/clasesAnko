import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { getClase, saveReserva } from "@/lib/store"
import { Reserva } from "@/lib/types"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return NextResponse.json({ error: "Stripe no configurado. Añade STRIPE_SECRET_KEY en .env.local" }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey)
  const body = await req.json()
  const { claseId, nombre, apellido, email } = body

  const clase = getClase(claseId)
  if (!clase) return NextResponse.json({ error: "Clase no encontrada" }, { status: 404 })

  const reservaId = randomUUID()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? `https://${req.headers.get("host")}`

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "bizum"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: clase.nombre,
            description: `${clase.fecha} · ${clase.hora} · ${clase.lugar}`,
          },
          unit_amount: Math.round(clase.precio * 100),
        },
        quantity: 1,
      },
    ],
    customer_email: email || undefined,
    metadata: {
      reservaId,
      claseId,
      nombre,
      apellido,
    },
    success_url: `${baseUrl}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/clases/${claseId}`,
  })

  const reserva: Reserva = {
    id: reservaId,
    claseId,
    nombre,
    apellido,
    email: email ?? "",
    monto: clase.precio,
    estado: "invitado",
    pagado: false,
    stripeSessionId: session.id,
    createdAt: new Date().toISOString(),
  }
  saveReserva(reserva)

  return NextResponse.json({ url: session.url })
}
