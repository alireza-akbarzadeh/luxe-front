import { expect, test } from '~/__tests__/fixtures/test.fixture';
import { skipUnlessIntegration } from '~/__tests__/helpers/integration';

test.describe('Account @auth', () => {
  test('authenticated user can log out @integration', async ({ accountPage, page }) => {
    skipUnlessIntegration();

    await accountPage.goto('/account');
    await accountPage.logout();

    await expect(page).toHaveURL(/\/login/);
  });
});
