import { expect, test } from '~/__tests__/fixtures/test.fixture';
import { RegisterPage } from '~/__tests__/pages/register.page';
import { createRegisterUser } from '~/__tests__/utils/factories/user.factory';

test.describe('Register Flow', () => {
  test('user can register successfully', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = createRegisterUser();

    await registerPage.goto();
    await registerPage.register(user);

    await expect(page).toHaveURL('/account');
  });

  test('shows validation errors for empty form', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();
    await registerPage.submit().click();

    await expect(page.getByTestId('firstName-error')).toBeVisible();
    await expect(page.getByTestId('email-error')).toBeVisible();
    await expect(page.getByTestId('password-error')).toBeVisible();
  });

  test('shows error when email already exists', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const user = createRegisterUser();

    // First successful registration
    await registerPage.goto();
    await registerPage.register(user);
    await expect(page).toHaveURL('/account');

    // Second attempt — same email
    await page.goto('/register');
    await registerPage.register(user);

    await expect(page.getByTestId('email-error')).toBeVisible();
  });
});
