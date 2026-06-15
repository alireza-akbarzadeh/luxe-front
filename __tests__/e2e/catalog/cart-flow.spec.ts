import { expect, test } from '@playwright/test';

import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';

test.describe('Checkout route guard @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page);
  });

  test('guest checkout redirects to login with callback', async ({ page }) => {
    await page.goto('/checkout');

    await expect(page).toHaveURL(/\/login\?callbackUrl=%2Fcheckout/, { timeout: 15_000 });
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
  });
});
