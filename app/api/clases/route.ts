import { NextRequest, NextResponse } from "next/server"
import { getClases, saveClase } from "@/lib/store"
import { Clase } from "@/lib/types"
import { randomUUID } from "crypto"

export async function GET() {
  return NextResponse.json(getClases())
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const clase: Clase = {
    id: randomUUID(),
    nombre: body.nombre,
    fecha: body.fecha,
    hora: body.hora,
    lugar: body.lugar,
    precio: Number(body.precio),
    capacidad: Number(body.capacidad) || 20,
    activa: true,
    gastos: body.gastos ?? [{ nombre: "Sala", monto: 0 }, { nombre: "Videógrafo", monto: 0 }],
    createdAt: new Date().toISOString(),
  }
  saveClase(clase)
  return NextResponse.json(clase, { status: 201 })
}
