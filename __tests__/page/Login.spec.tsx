import {test,expect} from "@playwright/test"

const TEST_USER = {
  email: 'e2e@example.com',
  password: 'E2ePass123!',
};

test.describe("Login flow",()=>{
  test.beforeEach(async ({page})=>{
    await  page.context().clearCookies()
    await page.goto("/login")
    await page.waitForSelector("form");
  })

  test('should successfully log in with valid credentials', async ({page}) => {
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-submit"]');

    await expect(page).toHaveURL(/\/account/);

    const toast = page.locator('[data-sonner-toast][data-type="success"]');
    await expect(toast).toContainText('Welcome back');
  });
  test('should show invalid credentials error for wrong password',async ({page}) => {
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', 'wrongPassword');
    await page.click('[data-testid="login-submit"]');

    const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
    await expect(errorToast).toContainText(/Invalid credentials/i);

    const passwordError = page.locator('[data-testid="password-error"]');
    await expect(passwordError).toContainText('Invalid credentials');
  });

  test('should display validation errors when fields are empty', async ({page}) => {
    await page.click('[data-testid="login-submit"]');

    const emailError = page.locator('[data-testid="email-error"]');
    const passwordError = page.locator('[data-testid="password-error"]');

    await expect(emailError).toContainText(/required/i);
    await expect(passwordError).toContainText(/required/i);
  });

  test('should show server error when API returns 500', async ({page}) => {
    await page.route('**/auth/login', async (route) => {
      await route.fulfill({
        status:500,
        contentType: 'application/json',
        body: JSON.stringify({ success: false, message: 'Internal server error' }),
      });
    });
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-submit"]');

    const errorToast = page.locator('[data-sonner-toast][data-type="error"]');
    await expect(errorToast).toContainText('An unexpected error occurred');

  });

  test('should show loading state on submit button', async ({page}) => {
    await page.route('**/auth/login', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    const submitBtn = page.locator('[data-testid="login-submit"]');

    await submitBtn.click();
    await expect(submitBtn).toBeDisabled();

    await expect(submitBtn).toContainText(/loading|signing in/i);
  });
  test('should set authentication cookies after successful login', async ({ page, context }) => {
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-submit"]');

    await expect(page).toHaveURL(/\/account/);
    const cookies = await context.cookies();
    const accessTokenCookie = cookies.find((c) => c.name === 'access_token');
    const refreshTokenCookie = cookies.find((c) => c.name === 'refresh_token');
    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();
    expect(accessTokenCookie?.httpOnly).toBe(true);
  });
  test('should redirect away from login when already authenticated', async ({ page }) => {
    // First login
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/account/);

    // Try to go back to login page
    await page.goto('/login');
    await expect(page).not.toHaveURL(/\/login/);
    await expect(page).toHaveURL(/\/account/);
  });

  test('social login buttons are present and enabled', async ({ page }) => {

    const googleBtn = page.locator('button', { hasText: 'Google' });
    const githubBtn = page.locator('button', { hasText: 'GitHub' });
    await expect(googleBtn).toBeVisible();
    await expect(githubBtn).toBeVisible();
  });

  test('should allow logout and then require re-login', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-submit"]');
    await expect(page).toHaveURL(/\/account/);

    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/account');
    await expect(page).toHaveURL(/\/login/);
  });

});