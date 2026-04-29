export const ROL_OPERACIONES = 'OPERACIONES';
const STORAGE_ROL_KEY = 'astrobookings.rol';

export function obtenerRolActual(): string {
  try {
    const rol = globalThis.localStorage?.getItem(STORAGE_ROL_KEY)?.trim().toUpperCase();
    return rol || ROL_OPERACIONES;
  } catch {
    return ROL_OPERACIONES;
  }
}

export function esRolOperaciones(rol: string | null | undefined): boolean {
  return (rol ?? '').trim().toUpperCase() === ROL_OPERACIONES;
}
