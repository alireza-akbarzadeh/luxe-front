import fs from 'node:fs';
import path from 'node:path';

import { expect,test as setup } from '@playwright/test';

import { hasIntegrationCredentials, testEnv } from '../config/env';
import { LoginPage } from '../pages/login.page';

setup('authenticate test user', async ({ page }) => {
  setup.skip(
    !testEnv.integrationEnabled || !hasIntegrationCredentials(),
    'Set E2E_INTEGRATION=1, E2E_USER_EMAIL, E2E_USER_PASSWORD'
  );

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(testEnv.credentials.email, testEnv.credentials.password);

  await expect(page).toHaveURL(/\/account/, { timeout: 15_000 });

  fs.mkdirSync(path.dirname(testEnv.authStoragePath), { recursive: true });
  await page.context().storageState({ path: testEnv.authStoragePath });
});
