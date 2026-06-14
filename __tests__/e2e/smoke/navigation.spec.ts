import config from '@/_config';
import { expect, test } from '@playwright/test';

import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';

test.describe('Core navigation @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page);
  });

  test('home page loads with hero and navbar', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(config.metadata.title);
    await expect(page.getByRole('link', { name: 'LUXE' })).toBeVisible();
    await expect(page.getByRole('link', { name: /shop new arrivals/i })).toBeVisible();
  });

  test('login page is reachable from navbar flow', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
  });

  test('shop and product routes respond without server error', async ({ page }) => {
    const productId = 7;

    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: 'Shop All' })).toBeVisible();

    await page.goto(`/product/${productId}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 15_000 });
  });
});
