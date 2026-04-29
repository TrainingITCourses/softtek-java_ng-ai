import { expect, test } from '@playwright/test';

test.describe('Rediseño mission control — criterios de aceptación UI', () => {
  test('CA1 — la navegacion principal es visible y consistente en cohetes y lanzamientos', async ({ page }) => {
    await page.goto('/cohetes');

    const nav = page.getByRole('navigation', { name: 'Navegacion principal' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Cohetes' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Lanzamientos' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Reservas' })).toBeVisible();

    await nav.getByRole('link', { name: 'Lanzamientos' }).click();

    await expect(page).toHaveURL(/\/lanzamientos/);
    await expect(page.getByRole('heading', { name: 'Lanzamientos' })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Navegacion principal' })).toBeVisible();
  });

  test('CA2 — el flujo de reserva muestra feedback claro al completar una reserva', async ({ page, request }) => {
    const sufijo = `${Date.now().toString(36).slice(-5)}${Math.floor(Math.random() * 36).toString(36)}`;

    const crearCohete = await request.post('/api/cohetes', {
      data: { nombre: `M${sufijo}`, capacidad: 5, rango: 'Luna' },
    });
    expect(crearCohete.status()).toBe(201);
    const coheteId = (await crearCohete.json()).id as string;

    const crearLanzamiento = await request.post('/api/lanzamientos', {
      data: { coheteId, fecha: '2030-12-01T10:00:00+00:00', precio: 1000 },
    });
    expect(crearLanzamiento.status()).toBe(201);

    await page.goto('/lanzamientos');

    const fila = page.getByRole('row').filter({ has: page.getByRole('cell', { name: coheteId }) });
    await fila.getByRole('button', { name: 'Detalle' }).click();

    const detalle = page.getByRole('region', { name: 'Detalle de lanzamiento' });
    await detalle.getByRole('button', { name: 'Crear reserva' }).click();

    await page.getByLabel('Nombre').fill('Validacion UX');
    await page.getByLabel('Email').fill('ux@example.com');
    await page.getByLabel('Teléfono').fill('+34600000015');
    await page.getByRole('button', { name: 'Crear reserva' }).last().click();

    await expect(page.getByRole('status')).toContainText('Reserva creada correctamente');

    await request.delete(`/api/cohetes/${coheteId}`);
  });

  test('CA3 — el lenguaje visual comparte estructura en cohetes y lanzamientos', async ({ page }) => {
    await page.goto('/cohetes');
    await expect(page.getByRole('heading', { name: 'Cohetes' })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Listado de cohetes' })).toBeVisible();

    await page.getByRole('link', { name: 'Lanzamientos' }).click();
    await expect(page.getByRole('heading', { name: 'Lanzamientos' })).toBeVisible();
    await expect(page.getByRole('table', { name: 'Listado de lanzamientos' })).toBeVisible();
  });

  test('CA4 — la interfaz mantiene estabilidad en viewport movil sin desborde horizontal', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/lanzamientos');

    await expect(page.getByRole('navigation', { name: 'Navegacion principal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lanzamientos' })).toBeVisible();

    const sinDesborde = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    expect(sinDesborde).toBe(true);
  });

  test('CA5 — no depende de librerias UI externas en el runtime del shell', async ({ page }) => {
    await page.goto('/cohetes');

    const recursos = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll('script[src]')].map((n) => n.getAttribute('src') ?? '');
      const estilos = [...document.querySelectorAll('link[rel="stylesheet"]')].map((n) => n.getAttribute('href') ?? '');
      return [...scripts, ...estilos].join(' ');
    });

    expect(recursos.toLowerCase()).not.toContain('bootstrap');
    expect(recursos.toLowerCase()).not.toContain('material');
    expect(recursos.toLowerCase()).not.toContain('primeng');
  });
});
