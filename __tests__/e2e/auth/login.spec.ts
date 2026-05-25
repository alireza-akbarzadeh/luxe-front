import { expect, test } from '~/__tests__/fixtures/test.fixture';
import { createUser } from '~/__tests__/utils/factories/user.factory';
import { testEnv } from '~/__tests__/config/env';
import { skipUnlessIntegration } from '~/__tests__/helpers/integration';

const invalidUser = createUser();

test.describe('Login @auth', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('shows validation errors when fields are empty @smoke', async ({ loginPage }) => {
    await test.step('submit empty form', async () => {
      await loginPage.submitBtn.click();
    });

    await test.step('assert field errors', async () => {
      await expect(loginPage.emailError()).toContainText(/required/i);
      await expect(loginPage.passwordError()).toContainText(/required/i);
    });
  });

  test('shows validation error for invalid email format', async ({ loginPage }) => {
    await loginPage.login('not-an-email', 'Test123!');

    await expect(loginPage.emailError()).toBeVisible();
  });

  test('login with valid credentials @integration', async ({ loginPage, page }) => {
    skipUnlessIntegration();

    await loginPage.login(testEnv.credentials.email, testEnv.credentials.password);

    await expect(page).toHaveURL(/\/account/);
    await expect(loginPage.toastSuccess()).toContainText(/welcome back/i);
  });

  test('invalid credentials show error @integration', async ({ loginPage }) => {
    skipUnlessIntegration();

    await loginPage.login(invalidUser.email, 'wrong-password-xyz');

    await expect(loginPage.toastError()).toContainText(/invalid credentials/i);
    await expect(loginPage.passwordError()).toContainText(/invalid credentials/i);
  });
});
