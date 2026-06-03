import { NextRequest, NextResponse } from "next/server"
import { getReservas, getReservasByClase, saveReserva } from "@/lib/store"
import { Reserva } from "@/lib/types"
import { randomUUID } from "crypto"

export async function GET(req: NextRequest) {
  const claseId = req.nextUrl.searchParams.get("claseId")
  const reservas = claseId ? getReservasByClase(claseId) : getReservas()
  return NextResponse.json(reservas)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const reserva: Reserva = {
    id: randomUUID(),
    claseId: body.claseId,
    nombre: body.nombre,
    apellido: body.apellido,
    email: body.email ?? "",
    monto: Number(body.monto),
    estado: body.estado ?? "invitado",
    pagado: body.pagado ?? false,
    stripeSessionId: body.stripeSessionId,
    createdAt: new Date().toISOString(),
  }
  saveReserva(reserva)
  return NextResponse.json(reserva, { status: 201 })
}
