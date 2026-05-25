import { test } from '@playwright/test';

import { hasIntegrationCredentials, testEnv } from '../config/env';

export function skipUnlessIntegration(
  message = 'Set E2E_INTEGRATION=1, E2E_USER_EMAIL, and E2E_USER_PASSWORD'
): void {
  test.skip(!testEnv.integrationEnabled || !hasIntegrationCredentials(), message);
}
