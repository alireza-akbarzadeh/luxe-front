import { testEnv } from '~/__tests__/config/env';
import { expect, test } from '~/__tests__/fixtures/test.fixture';
import { skipUnlessIntegration } from '~/__tests__/helpers/integration';

test.describe('Auth refresh rotation @auth @integration', () => {
  test('refresh endpoint rotates tokens without invalidating session', async ({ request, page }) => {
    skipUnlessIntegration();

    const loginResponse = await request.post(`${testEnv.apiURL}/auth/login`, {
      data: {
        email: testEnv.credentials.email,
        password: testEnv.credentials.password
      }
    });

    expect(loginResponse.ok()).toBeTruthy();

    const loginJson = (await loginResponse.json()) as {
      data?: { access_token?: string; refresh_token?: string };
    };

    const firstAccessToken = loginJson.data?.access_token;
    const firstRefreshToken = loginJson.data?.refresh_token;

    expect(firstAccessToken).toBeTruthy();
    expect(firstRefreshToken).toBeTruthy();

    const refreshResponse = await request.post(`${testEnv.apiURL}/auth/refresh`, {
      data: { refresh_token: firstRefreshToken }
    });

    expect(refreshResponse.ok()).toBeTruthy();

    const refreshJson = (await refreshResponse.json()) as {
      data?: { access_token?: string; refresh_token?: string };
    };

    const secondAccessToken = refreshJson.data?.access_token;
    const secondRefreshToken = refreshJson.data?.refresh_token;

    expect(secondAccessToken).toBeTruthy();
    expect(secondRefreshToken).toBeTruthy();
    expect(secondRefreshToken).not.toEqual(firstRefreshToken);

    const sessionsResponse = await request.get(`${testEnv.apiURL}/auth/sessions`, {
      headers: {
        Authorization: `Bearer ${secondAccessToken}`
      }
    });

    expect(sessionsResponse.ok()).toBeTruthy();

    const graceRefreshResponse = await request.post(`${testEnv.apiURL}/auth/refresh`, {
      data: { refresh_token: firstRefreshToken }
    });

    expect(graceRefreshResponse.status()).toBe(401);

    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
  });
});
