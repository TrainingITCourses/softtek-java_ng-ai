import { EstadoLanzamiento } from './lanzamiento.model';

const TRANSICIONES: Record<EstadoLanzamiento, EstadoLanzamiento[]> = {
  Programado: ['Confirmado', 'Suspendido', 'Cancelado'],
  Confirmado: ['Completado', 'Suspendido', 'Cancelado'],
  Completado: [],
  Suspendido: ['Programado', 'Confirmado', 'Cancelado'],
  Cancelado: [],
};

export function obtenerTransicionesPermitidas(estado: EstadoLanzamiento): EstadoLanzamiento[] {
  return TRANSICIONES[estado];
}

export function requiereMotivo(estado: EstadoLanzamiento): boolean {
  return estado === 'Suspendido' || estado === 'Cancelado';
}
