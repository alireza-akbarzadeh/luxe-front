import type { Locator,Page } from '@playwright/test';

import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.submitBtn = page.getByTestId('login-submit');
  }

  override async goto() {
    await super.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitBtn.click();
  }

  toastSuccess() {
    return this.page.locator('[data-sonner-toast][data-type="success"]');
  }

  toastError() {
    return this.page.locator('[data-sonner-toast][data-type="error"]');
  }

  passwordError() {
    return this.page.getByTestId('password-error');
  }

  emailError() {
    return this.page.getByTestId('email-error');
  }
}
