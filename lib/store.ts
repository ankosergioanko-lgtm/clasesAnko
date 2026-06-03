import fs from "fs"
import path from "path"
import { Clase, Reserva } from "./types"

const DATA_DIR = path.join(process.cwd(), "data")
const CLASES_FILE = path.join(DATA_DIR, "clases.json")
const RESERVAS_FILE = path.join(DATA_DIR, "reservas.json")

function readJSON<T>(file: string, fallback: T): T {
  try {
    if (!fs.existsSync(file)) return fallback
    return JSON.parse(fs.readFileSync(file, "utf-8")) as T
  } catch {
    return fallback
  }
}

function writeJSON(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf-8")
}

export function getClases(): Clase[] {
  return readJSON<Clase[]>(CLASES_FILE, [])
}

export function getClase(id: string): Clase | undefined {
  return getClases().find((c) => c.id === id)
}

export function saveClase(clase: Clase): void {
  const clases = getClases()
  const idx = clases.findIndex((c) => c.id === clase.id)
  if (idx >= 0) clases[idx] = clase
  else clases.push(clase)
  writeJSON(CLASES_FILE, clases)
}

export function deleteClase(id: string): void {
  writeJSON(CLASES_FILE, getClases().filter((c) => c.id !== id))
}

export function getReservas(): Reserva[] {
  return readJSON<Reserva[]>(RESERVAS_FILE, [])
}

export function getReservasByClase(claseId: string): Reserva[] {
  return getReservas().filter((r) => r.claseId === claseId)
}

export function getReserva(id: string): Reserva | undefined {
  return getReservas().find((r) => r.id === id)
}

export function saveReserva(reserva: Reserva): void {
  const reservas = getReservas()
  const idx = reservas.findIndex((r) => r.id === reserva.id)
  if (idx >= 0) reservas[idx] = reserva
  else reservas.push(reserva)
  writeJSON(RESERVAS_FILE, reservas)
}

export function deleteReserva(id: string): void {
  writeJSON(RESERVAS_FILE, getReservas().filter((r) => r.id !== id))
}

export function updateReservaPagado(stripeSessionId: string, pagado: boolean): void {
  const reservas = getReservas()
  const idx = reservas.findIndex((r) => r.stripeSessionId === stripeSessionId)
  if (idx >= 0) {
    reservas[idx].pagado = pagado
    reservas[idx].estado = pagado ? "confirmado" : reservas[idx].estado
    writeJSON(RESERVAS_FILE, reservas)
  }
}
