import { expect, test } from '~/__tests__/fixtures/test.fixture';
import { createUser } from '~/__tests__/utils/factories/user.factory';

const TEST_USER = createUser();

test.describe('Login flow', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('login with valid credentials', async ({ loginPage, page }) => {
    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await expect(page).toHaveURL(/\/account/);
    await expect(loginPage.toastSuccess()).toContainText('Welcome back');
  });

  test('invalid credentials error', async ({ loginPage }) => {
    await loginPage.login(TEST_USER.email, 'wrongPassword');

    await expect(loginPage.toastError()).toContainText(/Invalid credentials/i);
    await expect(loginPage.passwordError()).toContainText('Invalid credentials');
  });

  test('validation errors when fields empty', async ({ loginPage }) => {
    await loginPage.submitBtn.click();

    await expect(loginPage.emailError()).toContainText(/required/i);
    await expect(loginPage.passwordError()).toContainText(/required/i);
  });

  test('server error handling', async ({ page, loginPage }) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Internal server error'
        })
      });
    });

    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await expect(loginPage.toastError()).toContainText('An unexpected error occurred');
  });

  test('loading state on submit', async ({ page, loginPage }) => {
    await page.route('**/auth/login', async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.continue();
    });

    await loginPage.login(TEST_USER.email, TEST_USER.password);

    await expect(loginPage.submitBtn).toBeDisabled();
    await expect(loginPage.submitBtn).toContainText(/loading|signing in/i);
  });
});
