import { APIRequestContext, expect, test } from '@playwright/test';

const COHETES_URL = 'http://localhost:8080/api/cohetes';
const LANZAMIENTOS_URL = 'http://localhost:8080/api/lanzamientos';
const FECHA_FUTURA = '2030-12-01T10:00:00+00:00';

function sufijo(): string {
  return `${Date.now().toString(36).slice(-5)}${Math.floor(Math.random() * 36).toString(36)}`;
}

async function crearCohete(request: APIRequestContext, nombre: string, capacidad = 5): Promise<string> {
  const resp = await request.post(COHETES_URL, {
    data: { nombre, capacidad, rango: 'Luna' },
  });
  return (await resp.json()).id as string;
}

async function crearLanzamiento(request: APIRequestContext, coheteId: string): Promise<string> {
  const resp = await request.post(LANZAMIENTOS_URL, {
    data: { coheteId, fecha: FECHA_FUTURA, precio: 1000 },
  });
  return (await resp.json()).id as string;
}

async function cambiarEstado(
  request: APIRequestContext,
  lanzamientoId: string,
  estado: string,
  motivo?: string,
): Promise<void> {
  await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/state`, {
    data: { estado, motivo: motivo ?? null },
  });
}

function filaLanzamiento(page: import('@playwright/test').Page, coheteId: string) {
  return page
    .getByRole('row')
    .filter({ has: page.getByRole('cell', { name: coheteId }) });
}

function textoPlazas(detalle: import('@playwright/test').Locator) {
  return detalle.locator('p').filter({ hasText: 'Plazas disponibles:' });
}

test.describe('Reservas — flujo UI desde detalle de lanzamiento', () => {
  test('CA1 — crear reserva desde lanzamiento Programado muestra confirmación y descuenta plaza', async ({
    page,
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    await crearLanzamiento(request, coheteId);

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();

    const detalle = page.getByRole('region', { name: 'Detalle de lanzamiento' });
    const textoAntes = await textoPlazas(detalle).textContent();
    const plazasAntes = parseInt(textoAntes?.match(/\d+/)?.[0] ?? '0', 10);

    await detalle.getByRole('button', { name: 'Crear reserva' }).click();
    await page.getByLabel('Nombre').fill('Ana García');
    await page.getByLabel('Email').fill('ana@example.com');
    await page.getByLabel('Teléfono').fill('+34600000001');
    await page.getByRole('button', { name: 'Crear reserva' }).last().click();

    await expect(page.getByRole('status')).toContainText('Reserva creada correctamente');
    await expect(textoPlazas(detalle)).toContainText(String(plazasAntes - 1));

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA2 — crear reserva desde lanzamiento Confirmado muestra confirmación', async ({
    page,
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);
    await cambiarEstado(request, lanzamientoId, 'Confirmado');

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();

    const detalle = page.getByRole('region', { name: 'Detalle de lanzamiento' });
    await detalle.getByRole('button', { name: 'Crear reserva' }).click();
    await page.getByLabel('Nombre').fill('Carlos López');
    await page.getByLabel('Email').fill('carlos@example.com');
    await page.getByLabel('Teléfono').fill('600000002');
    await page.getByRole('button', { name: 'Crear reserva' }).last().click();

    await expect(page.getByRole('status')).toContainText('Reserva creada correctamente');

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA3 — botón Crear reserva deshabilitado para lanzamiento en estado no permitido', async ({
    page,
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    const lanzamientoId = await crearLanzamiento(request, coheteId);
    await cambiarEstado(request, lanzamientoId, 'Suspendido', 'Motivo de prueba');

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();

    const botonReserva = page
      .getByRole('region', { name: 'Detalle de lanzamiento' })
      .getByRole('button', { name: 'Crear reserva' });

    await expect(botonReserva).toBeDisabled();

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA4 — botón Crear reserva deshabilitado cuando no hay plazas disponibles', async ({
    page,
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`, 1);
    const lanzamientoId = await crearLanzamiento(request, coheteId);

    // Llenar la única plaza vía API
    await request.post(`${LANZAMIENTOS_URL}/${lanzamientoId}/reservas`, {
      data: { nombre: 'Primer Pasajero', email: 'primero@example.com', telefono: '600000003' },
    });

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();

    const botonReserva = page
      .getByRole('region', { name: 'Detalle de lanzamiento' })
      .getByRole('button', { name: 'Crear reserva' });

    await expect(botonReserva).toBeDisabled();

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA5 — botón enviar deshabilitado con formulario vacío', async ({ page, request }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    await crearLanzamiento(request, coheteId);

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();
    await page
      .getByRole('region', { name: 'Detalle de lanzamiento' })
      .getByRole('button', { name: 'Crear reserva' })
      .click();

    await expect(page.getByRole('button', { name: 'Crear reserva' }).last()).toBeDisabled();

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA5 — alerta de validación al introducir email inválido en formulario', async ({
    page,
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    await crearLanzamiento(request, coheteId);

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();
    await page
      .getByRole('region', { name: 'Detalle de lanzamiento' })
      .getByRole('button', { name: 'Crear reserva' })
      .click();

    await page.getByLabel('Nombre').fill('Ana García');
    await page.getByLabel('Email').fill('correo-invalido');
    await page.getByLabel('Email').blur();

    await expect(page.getByRole('alert').filter({ hasText: /email/i })).toBeVisible();

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });

  test('CA6 — plazas disponibles disminuyen en 1 tras crear reserva exitosa', async ({
    page,
    request,
  }) => {
    const coheteId = await crearCohete(request, `Ce${sufijo()}`);
    await crearLanzamiento(request, coheteId);

    await page.goto('/lanzamientos');
    await filaLanzamiento(page, coheteId).getByRole('button', { name: 'Detalle' }).click();

    const detalle = page.getByRole('region', { name: 'Detalle de lanzamiento' });
    const textoAntes = await textoPlazas(detalle).textContent();
    const plazasAntes = parseInt(textoAntes?.match(/\d+/)?.[0] ?? '0', 10);

    await detalle.getByRole('button', { name: 'Crear reserva' }).click();
    await page.getByLabel('Nombre').fill('Luis Pérez');
    await page.getByLabel('Email').fill('luis@example.com');
    await page.getByLabel('Teléfono').fill('+34700000001');
    await page.getByRole('button', { name: 'Crear reserva' }).last().click();

    await expect(page.getByRole('status')).toContainText('Reserva creada correctamente');
    await expect(textoPlazas(detalle)).toContainText(String(plazasAntes - 1));

    await request.delete(`${COHETES_URL}/${coheteId}`);
  });
});
