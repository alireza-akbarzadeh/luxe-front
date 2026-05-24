import { request, chromium, type FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const TEST_USER = creatU;

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const AUTH_PATH = path.resolve(__dirname, '../playwright/.auth/user.json');

async function globalSetup(config: FullConfig) {
  console.log(`🌍 Global setup: preparing test user ${TEST_USER.email}`);

  const requestContext = await request.newContext({
    baseURL: API_BASE_URL
  });

  try {
    // Ensure test user exists
    const setupRes = await requestContext.post('/api/test/setup', {
      data: TEST_USER
    });

    if (!setupRes.ok()) {
      throw new Error(`Failed creating test user: ${setupRes.status()} ${await setupRes.text()}`);
    }

    console.log('✅ Test user exists');

    // Launch browser to create storage state
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(`${API_BASE_URL}/login`);

    await page.getByLabel('Email').fill(TEST_USER.email);
    await page.getByLabel('Password').fill(TEST_USER.password);
    await page.getByRole('button', { name: /login/i }).click();

    await page.waitForURL('**/dashboard');

    fs.mkdirSync(path.dirname(AUTH_PATH), { recursive: true });

    await page.context().storageState({ path: AUTH_PATH });

    console.log(`✅ Auth state saved to ${AUTH_PATH}`);

    await browser.close();
  } catch (err) {
    console.error('❌ Global setup failed', err);
    throw err;
  } finally {
    await requestContext.dispose();
  }
}

export default globalSetup;
