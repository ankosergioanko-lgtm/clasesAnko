import { NextRequest, NextResponse } from "next/server"
import { getClase, saveClase, deleteClase } from "@/lib/store"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const clase = getClase(id)
  if (!clase) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(clase)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const clase = getClase(id)
  if (!clase) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  const updated = { ...clase, ...body, id }
  saveClase(updated)
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  deleteClase(id)
  return NextResponse.json({ ok: true })
}
