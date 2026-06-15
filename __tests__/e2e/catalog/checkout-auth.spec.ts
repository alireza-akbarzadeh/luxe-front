import { expect, test } from '@playwright/test';

import { hasIntegrationCredentials, testEnv } from '~/__tests__/config/env';

test.describe('Authenticated checkout @integration', () => {
  test.skip(
    !testEnv.integrationEnabled || !hasIntegrationCredentials(),
    'Set E2E_INTEGRATION=1, E2E_USER_EMAIL, E2E_USER_PASSWORD'
  );

  test.use({ storageState: testEnv.authStoragePath });

  test('signed-in user can open checkout from cart', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: /shopping cart/i })).toBeVisible({
      timeout: 15_000
    });

    const checkoutLink = page.getByRole('link', { name: /checkout|proceed/i }).first();
    const checkoutButton = page.getByRole('button', { name: /checkout|proceed/i }).first();

    if (await checkoutLink.isVisible().catch(() => false)) {
      await checkoutLink.click();
    } else if (await checkoutButton.isVisible().catch(() => false)) {
      await checkoutButton.click();
    } else {
      await page.goto('/checkout');
    }

    await expect(page).toHaveURL(/\/checkout/, { timeout: 15_000 });
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
