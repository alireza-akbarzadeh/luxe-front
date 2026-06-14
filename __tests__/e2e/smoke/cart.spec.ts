import { expect, test } from '@playwright/test';

import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';

test.describe('Cart sheet @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page);
  });

  test('navbar cart button opens the cart sheet for guests', async ({ page }) => {
    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: 'Shop All' })).toBeVisible();

    await page.getByRole('button', { name: /open cart/i }).click();

    await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
    await expect(page.getByText(/sign in to view your cart/i)).toBeVisible();
  });

  test('cart sheet can be closed', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /open cart/i }).click();
    await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();

    const sheet = page.getByRole('dialog');
    await sheet.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('heading', { name: /your cart/i })).toBeHidden();
  });
});
