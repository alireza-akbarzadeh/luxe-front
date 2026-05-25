import fs from 'node:fs';
import path from 'node:path';

import { defineConfig, devices } from '@playwright/test';

import { testEnv } from './__tests__/config/env';

/** Load `.env.test.local` without adding a dotenv dependency. */
function loadTestEnvFile(fileName: string) {
  const filePath = path.resolve(fileName);
  if (!fs.existsSync(filePath)) return;

  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadTestEnvFile('.env.test.local');

const chromeDevice = testEnv.useSystemChrome
  ? { ...devices['Desktop Chrome'], channel: 'chrome' as const }
  : { ...devices['Desktop Chrome'] };

/**
 * @see https://playwright.dev/docs/test-configuration
 *
 * Scripts:
 *   pnpm test              — all e2e (smoke + auth UI; integration skipped without env)
 *   pnpm test:smoke        — fast smoke only
 *   pnpm test:integration  — requires E2E_INTEGRATION + credentials
 *   pnpm test:install      — download browsers (mirror fallbacks in scripts/playwright-install.mjs)
 */
export default defineConfig({
  testDir: '__tests__/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: testEnv.isCI,
  retries: testEnv.isCI ? 2 : 0,
  workers: testEnv.isCI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: testEnv.isCI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  outputDir: '__tests_results__',
  globalSetup: undefined,

  use: {
    baseURL: testEnv.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
    locale: 'en-US',
    timezoneId: 'UTC',
    testIdAttribute: 'data-testid'
  },

  projects: [
    {
      name: 'setup',
      testDir: '__tests__/setup',
      testMatch: '**/*.setup.ts'
    },
    {
      name: 'chromium',
      testIgnore: '**/account/**',
      use: chromeDevice
    },
    {
      name: 'authenticated',
      testDir: '__tests__/e2e/account',
      dependencies: ['setup'],
      use: {
        ...chromeDevice,
        storageState: testEnv.authStoragePath
      }
    }
  ],

  webServer: {
    command: 'pnpm run dev',
    url: testEnv.baseURL,
    reuseExistingServer: !testEnv.isCI,
    timeout: 120_000
  }
});
