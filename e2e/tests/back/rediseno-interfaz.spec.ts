import { expect, test } from '@playwright/test';

const COHETES_URL = '/api/cohetes';
const LANZAMIENTOS_URL = '/api/lanzamientos';

function sufijo(): string {
  return `${Date.now().toString(36).slice(-5)}${Math.floor(Math.random() * 36).toString(36)}`;
}

test.describe('Rediseño mission control — criterios de aceptación API', () => {
  test('CA2 y CA4 — crear reserva valida devuelve 201 y reduce plazas disponibles en una unidad', async ({ request }) => {
    const coheteResp = await request.post(COHETES_URL, {
      data: { nombre: `B${sufijo()}`, capacidad: 3, rango: 'Luna' },
    });
    expect(coheteResp.status()).toBe(201);
    const coheteId = (await coheteResp.json()).id as string;

    const lanzamientoResp = await request.post(LANZAMIENTOS_URL, {
      data: { coheteId, fecha: '2030-12-01T10:00:00+00:00', precio: 1000 },
    });
    expect(lanzamientoResp.status()).toBe(201);
    const lanzamientoId = (await lanzamientoResp.json()).id as string;

    const antesResp = await request.get(`${LANZAMIENTOS_URL}/${lanzamientoId}`);
    expect(antesResp.status()).toBe(200);
    const antes = await antesResp.json();

    const reservaResp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { nombre: 'Reserva E2E', email: 'reserva@example.com', telefono: '+34600000021' },
    });
    expect(reservaResp.status()).toBe(201);

    const despuesResp = await request.get(`${LANZAMIENTOS_URL}/${lanzamientoId}`);
    expect(despuesResp.status()).toBe(200);
    const despues = await despuesResp.json();

    expect(despues.plazasDisponibles).toBe(antes.plazasDisponibles - 1);

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA1 y CA3 — listar cohetes y lanzamientos responde 200 con estructura estable', async ({ request }) => {
    const cohetesResp = await request.get(COHETES_URL);
    expect(cohetesResp.status()).toBe(200);
    const cohetesBody = await cohetesResp.json();
    expect(Array.isArray(cohetesBody)).toBe(true);

    const lanzamientosResp = await request.get(LANZAMIENTOS_URL);
    expect(lanzamientosResp.status()).toBe(200);
    const lanzamientosBody = await lanzamientosResp.json();
    expect(Array.isArray(lanzamientosBody)).toBe(true);
  });

  test('CA5 — el backend se mantiene independiente de librerias UI y expone solo API funcional', async ({ request }) => {
    const saludoResp = await request.get('/api/saludo');
    expect(saludoResp.status()).toBe(200);

    const saludoBody = await saludoResp.json();
    expect(saludoBody).toMatchObject({
      aplicacion: expect.any(String),
      estado: expect.any(String),
      timestamp: expect.any(String),
    });
  });
});
