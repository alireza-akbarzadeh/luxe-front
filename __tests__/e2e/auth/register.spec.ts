import { expect, test } from '~/__tests__/fixtures/test.fixture';
import { skipUnlessIntegration } from '~/__tests__/helpers/integration';
import { createRegisterUser } from '~/__tests__/utils/factories/user.factory';

test.describe('Register @auth', () => {
  test.beforeEach(async ({ registerPage }) => {
    await registerPage.goto();
  });

  test('shows validation errors for empty form @smoke', async ({ registerPage }) => {
    await registerPage.submitBtn.click();

    await expect(registerPage.fieldError('firstName')).toBeVisible();
    await expect(registerPage.fieldError('email')).toBeVisible();
    await expect(registerPage.fieldError('password')).toBeVisible();
  });

  test('user can register successfully @integration', async ({ registerPage, page }) => {
    skipUnlessIntegration();

    const user = createRegisterUser();
    await registerPage.register(user);

    await expect(page).toHaveURL(/\/account/);
  });
});
