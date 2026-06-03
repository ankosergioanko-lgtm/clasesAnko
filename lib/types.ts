export interface Gasto {
  nombre: string
  monto: number
}

export interface Clase {
  id: string
  nombre: string
  fecha: string        // "2026-06-02"
  hora: string         // "20:00"
  lugar: string
  precio: number
  capacidad: number
  activa: boolean
  gastos: Gasto[]
  createdAt: string
}

export interface Reserva {
  id: string
  claseId: string
  nombre: string
  apellido: string
  email: string
  monto: number
  estado: "invitado" | "confirmado"
  pagado: boolean
  stripeSessionId?: string
  createdAt: string
}

export type VistaGaleria = "galeria" | "calendario"
export type TabAdmin = "asistentes" | "dinero"
