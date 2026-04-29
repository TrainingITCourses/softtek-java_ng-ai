import { APIRequestContext, expect, test } from '@playwright/test';

const COHETES_URL = '/api/cohetes';
const LANZAMIENTOS_URL = '/api/lanzamientos';

const RESERVA_VALIDA = {
  nombre: 'Ana García',
  email: 'ana@example.com',
  telefono: '+34600000001',
};

const FECHA_FUTURA = '2030-12-01T10:00:00+00:00';

async function crearCohete(
  request: APIRequestContext,
  nombre: string,
  capacidad = 5,
): Promise<string> {
  const resp = await request.post(COHETES_URL, {
    data: { nombre, capacidad, rango: 'Luna' },
  });
  expect(resp.status()).toBe(201);
  return (await resp.json()).id as string;
}

async function crearLanzamiento(
  request: APIRequestContext,
  coheteId: string,
): Promise<string> {
  const resp = await request.post(LANZAMIENTOS_URL, {
    data: { coheteId, fecha: FECHA_FUTURA, precio: 1000 },
  });
  expect(resp.status()).toBe(201);
  return (await resp.json()).id as string;
}

function sufijo(): string {
  return `${Date.now().toString(36).slice(-5)}${Math.floor(Math.random() * 36).toString(36)}`;
}

test.describe('POST /api/lanzamientos/:id/reservas — creación de reservas', () => {
  test('CA1 — crear reserva en lanzamiento Programado devuelve 201 con reserva activa', async ({
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });

    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.activa).toBe(true);
    expect(body.plazas).toBe(1);
    expect(body.lanzamientoId).toBe(lanzamientoId);

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA2 — crear reserva en lanzamiento Confirmado devuelve 201', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/state`, {
      data: { estado: 'Confirmado', motivo: null },
    });

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });

    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.activa).toBe(true);

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA3 — rechaza reserva en lanzamiento Suspendido con 409 conflict', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/state`, {
      data: { estado: 'Suspendido', motivo: 'Motivo de prueba' },
    });

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });

    expect(resp.status()).toBe(409);
    const body = await resp.json();
    expect(body.error).toBe('conflict');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA3 — rechaza reserva en lanzamiento Cancelado con 409 conflict', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/state`, {
      data: { estado: 'Cancelado', motivo: 'Motivo de prueba' },
    });

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });

    expect(resp.status()).toBe(409);
    const body = await resp.json();
    expect(body.error).toBe('conflict');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA4 — rechaza reserva cuando no hay plazas disponibles con 409 conflict', async ({
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`, 1);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    // Ocupar la única plaza
    const primera = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });
    expect(primera.status()).toBe(201);

    // Intentar otra reserva sin plazas
    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { ...RESERVA_VALIDA, nombre: 'Otro Pasajero' },
    });

    expect(resp.status()).toBe(409);
    const body = await resp.json();
    expect(body.error).toBe('conflict');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA5 — rechaza reserva con nombre vacío con 400 validation_failed', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { nombre: '', email: 'ana@example.com', telefono: '+34600000001' },
    });

    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toBe('validation_failed');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA5 — rechaza reserva con email inválido con 400 validation_failed', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { nombre: 'Ana García', email: 'no-es-un-email', telefono: '+34600000001' },
    });

    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toBe('validation_failed');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA5 — rechaza reserva con teléfono demasiado corto con 400 validation_failed', async ({
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { nombre: 'Ana García', email: 'ana@example.com', telefono: '123' },
    });

    expect(resp.status()).toBe(400);
    const body = await resp.json();
    expect(body.error).toBe('validation_failed');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA6 — crear reserva descuenta exactamente una plaza disponible', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const antes = await (await request.get(`${LANZAMIENTOS_URL}/${lanzamientoId}`)).json();
    const plazasAntes: number = antes.plazasDisponibles;

    await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });

    const despues = await (await request.get(`${LANZAMIENTOS_URL}/${lanzamientoId}`)).json();

    expect(despues.plazasDisponibles).toBe(plazasAntes - 1);

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA7 — permite múltiples reservas con el mismo email en el mismo lanzamiento', async ({
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const resp1 = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });
    const resp2 = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { ...RESERVA_VALIDA, nombre: 'Otro Pasajero' },
    });

    expect(resp1.status()).toBe(201);
    expect(resp2.status()).toBe(201);

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA8 — la reserva creada queda en estado activo', async ({ request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    const resp = await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: RESERVA_VALIDA,
    });

    expect(resp.status()).toBe(201);
    const body = await resp.json();
    expect(body.activa).toBe(true);

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });
});
