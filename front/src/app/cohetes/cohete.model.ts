export type Rango = 'Tierra' | 'Luna' | 'Marte';

export const RANGOS: Rango[] = ['Tierra', 'Luna', 'Marte'];

export interface Cohete {
  id: string;
  nombre: string;
  capacidad: number;
  rango: Rango;
}

export interface CohetePeticion {
  nombre: string;
  capacidad: number;
  rango: Rango;
}
