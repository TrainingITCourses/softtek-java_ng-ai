import { expect, test } from '@playwright/test';

test.describe('Cohetes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cohetes');
  });

  test('muestra el botón para añadir cohete', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Añadir cohete' })).toBeVisible();
  });

  test('el botón crear está deshabilitado con formulario vacío', async ({ page }) => {
    await page.getByRole('button', { name: 'Añadir cohete' }).click();

    await expect(page.getByRole('button', { name: 'Crear' })).toBeDisabled();
  });

  test('cancelar cierra el formulario', async ({ page }) => {
    await page.getByRole('button', { name: 'Añadir cohete' }).click();
    await page.getByRole('button', { name: 'Cancelar' }).click();

    await expect(page.getByRole('heading', { name: 'Nuevo cohete' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Añadir cohete' })).toBeVisible();
  });

  test('no permite crear cohete con capacidad 100', async ({ page }) => {
    await page.getByRole('button', { name: 'Añadir cohete' }).click();

    await page.getByRole('textbox', { name: 'Nombre' }).fill('Apolo');
    await page.getByRole('spinbutton', { name: 'Capacidad' }).fill('100');
    await page.getByLabel('Rango').selectOption('Luna');

    await expect(page.getByRole('button', { name: 'Crear' })).toBeDisabled();
  });

  test('puede crear un cohete nuevo', async ({ page }) => {
    await page.getByRole('button', { name: 'Añadir cohete' }).click();

    await page.getByRole('textbox', { name: 'Nombre' }).fill('Apolo');
    await page.getByLabel('Rango').selectOption('Luna');

    const btnCrear = page.getByRole('button', { name: 'Crear' });
    await expect(btnCrear).toBeEnabled();
    await btnCrear.click();

    await expect(page.getByRole('status')).toHaveText('Cohete creado');
    await expect(page.getByRole('cell', { name: 'Apolo' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Luna' })).toBeVisible();
  });
});
