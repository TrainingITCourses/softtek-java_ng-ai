import { esRolOperaciones, obtenerRolActual, ROL_OPERACIONES } from './rol-operaciones';

describe('rol-operaciones', () => {
  afterEach(() => {
    localStorage.removeItem('astrobookings.rol');
  });

  it('obtenerRolActual usa OPERACIONES por defecto', () => {
    expect(obtenerRolActual()).toBe(ROL_OPERACIONES);
  });

  it('obtenerRolActual normaliza el rol en mayusculas', () => {
    localStorage.setItem('astrobookings.rol', 'comercial');
    expect(obtenerRolActual()).toBe('COMERCIAL');
  });

  it('esRolOperaciones devuelve true solo para OPERACIONES', () => {
    expect(esRolOperaciones('OPERACIONES')).toBe(true);
    expect(esRolOperaciones('operaciones')).toBe(true);
    expect(esRolOperaciones('COMERCIAL')).toBe(false);
  });
});
