import { expect, test } from '@playwright/test';

const COHETES_URL = '/api/cohetes';

const COHETE_VALIDO = { nombre: 'Apolo', capacidad: 1, rango: 'Luna' };

test.describe('POST /api/cohetes — validación de capacidad', () => {
  test('rechaza capacidad 100 con 400 y mensaje de error', async ({ request }) => {
    const respuesta = await request.post(COHETES_URL, {
      data: { ...COHETE_VALIDO, capacidad: 100 },
    });

    expect(respuesta.status()).toBe(400);

    const cuerpo = await respuesta.json();
    expect(cuerpo.code).toBe('400');
    expect(cuerpo.error).toBe('validation_failed');
    expect(cuerpo.message).toContain('capacidad');
  });

  test('rechaza capacidad 0 con 400', async ({ request }) => {
    const respuesta = await request.post(COHETES_URL, {
      data: { ...COHETE_VALIDO, capacidad: 0 },
    });

    expect(respuesta.status()).toBe(400);
  });

  test('acepta capacidad 9 (valor máximo válido)', async ({ request }) => {
    const nombre = `C${Math.floor(Math.random() * 9000 + 1000)}`; // 5 chars, dentro del límite [3..10]
    const respuesta = await request.post(COHETES_URL, {
      data: { ...COHETE_VALIDO, nombre, capacidad: 9 },
    });

    expect(respuesta.status()).toBe(201);

    // Limpieza: eliminar el cohete creado
    const { id } = await respuesta.json();
    await request.delete(`${COHETES_URL}/${id}`);
  });
});
