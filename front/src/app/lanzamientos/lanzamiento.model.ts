export type EstadoLanzamiento =
  | 'Programado'
  | 'Confirmado'
  | 'Completado'
  | 'Suspendido'
  | 'Cancelado';

export const ESTADOS_LANZAMIENTO: EstadoLanzamiento[] = [
  'Programado',
  'Confirmado',
  'Completado',
  'Suspendido',
  'Cancelado',
];

export interface Lanzamiento {
  id: string;
  coheteId: string;
  fecha: string;
  precio: number;
  estado: EstadoLanzamiento;
  motivo: string | null;
  capacidadTotal: number;
  plazasDisponibles: number;
  activo: boolean;
}

export interface Reserva {
  id: string;
  lanzamientoId: string;
  nombre: string;
  email: string;
  telefono: string;
  plazas: number;
  activa: boolean;
}

export interface ReservaPeticion {
  nombre: string;
  email: string;
  telefono: string;
}

export interface LanzamientoPeticion {
  coheteId: string;
  fecha: string;
  precio: number;
}

export interface CambioEstadoLanzamientoPeticion {
  estado: EstadoLanzamiento;
  motivo?: string;
}

export interface ErrorApi {
  code: string;
  error: string;
  message: string;
}
