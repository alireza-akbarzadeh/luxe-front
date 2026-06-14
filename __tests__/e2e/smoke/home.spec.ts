import { expect, test } from '@playwright/test';

import config from '@/_config';
import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';
import { testEnv } from '~/__tests__/config/env';

test.describe('Smoke @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page);
  });

  test('home page loads with correct title', async ({ page }) => {
    await page.goto(testEnv.baseURL);

    await expect(page).toHaveTitle(config.metadata.title);
    await expect(page.getByRole('link', { name: 'LUXE' })).toBeVisible();
  });
});
