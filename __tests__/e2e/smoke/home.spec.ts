import { expect, test } from '@playwright/test';

import config from '@/_config';
import { testEnv } from '~/__tests__/config/env';

test.describe('Smoke @smoke', () => {
  test('home page loads with correct title', async ({ page }) => {
    await page.goto(testEnv.baseURL);

    await expect(page).toHaveTitle(config.metadata.title);
  });
});
