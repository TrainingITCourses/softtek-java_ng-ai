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
  activo: boolean;
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
