import { obtenerTransicionesPermitidas, requiereMotivo } from './lanzamiento-transiciones';

describe('lanzamiento-transiciones', () => {
  it('Programado permite Confirmado, Suspendido y Cancelado', () => {
    expect(obtenerTransicionesPermitidas('Programado')).toEqual([
      'Confirmado',
      'Suspendido',
      'Cancelado',
    ]);
  });

  it('Confirmado permite Completado, Suspendido y Cancelado', () => {
    expect(obtenerTransicionesPermitidas('Confirmado')).toEqual([
      'Completado',
      'Suspendido',
      'Cancelado',
    ]);
  });

  it('Completado no permite transiciones', () => {
    expect(obtenerTransicionesPermitidas('Completado')).toEqual([]);
  });

  it('Suspendido permite volver a Programado o Confirmado, o cancelar', () => {
    expect(obtenerTransicionesPermitidas('Suspendido')).toEqual([
      'Programado',
      'Confirmado',
      'Cancelado',
    ]);
  });

  it('Cancelado no permite transiciones', () => {
    expect(obtenerTransicionesPermitidas('Cancelado')).toEqual([]);
  });

  it('requiere motivo para Suspendido y Cancelado', () => {
    expect(requiereMotivo('Suspendido')).toBe(true);
    expect(requiereMotivo('Cancelado')).toBe(true);
    expect(requiereMotivo('Programado')).toBe(false);
  });
});
