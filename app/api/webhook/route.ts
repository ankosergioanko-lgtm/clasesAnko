import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { updateReservaPagado } from "@/lib/store"

export async function POST(req: NextRequest) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripeKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe no configurado" }, { status: 500 })
  }

  const stripe = new Stripe(stripeKey)
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Webhook signature inválida" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === "paid") {
      updateReservaPagado(session.id, true)
    }
  }

  return NextResponse.json({ received: true })
}
