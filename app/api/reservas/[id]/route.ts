import { NextRequest, NextResponse } from "next/server"
import { getReserva, saveReserva, deleteReserva } from "@/lib/store"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reserva = getReserva(id)
  if (!reserva) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(reserva)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const reserva = getReserva(id)
  if (!reserva) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  const updated = { ...reserva, ...body, id }
  saveReserva(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  deleteReserva(id)
  return NextResponse.json({ ok: true })
}
