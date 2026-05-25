import type { Locator, Page } from '@playwright/test';
import type { RegisterUser } from '~/__tests__/utils/factories/user.factory';

import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly acceptTerms: Locator;
  readonly acceptMarketing: Locator;
  readonly submitBtn: Locator;
  readonly errorBox: Locator;

  constructor(page: Page) {
    super(page);
    this.firstName = page.getByTestId('firstName-input');
    this.lastName = page.getByTestId('lastName-input');
    this.email = page.getByTestId('email-input');
    this.phone = page.getByTestId('phone-input');
    this.password = page.getByTestId('password-input');
    this.confirmPassword = page.getByTestId('confirmPassword-input');
    this.acceptTerms = page.getByTestId('acceptTerms-checkbox');
    this.acceptMarketing = page.getByTestId('acceptMarketing-checkbox');
    this.submitBtn = page.getByTestId('register-submit');
    this.errorBox = page.getByTestId('register-error');
  }

  override async goto() {
    await super.goto('/register');
  }

  fieldError(name: string) {
    return this.page.getByTestId(`${name}-error`);
  }

  async fillForm(user: RegisterUser) {
    await this.firstName.fill(user.firstName);
    await this.lastName.fill(user.lastName);
    await this.email.fill(user.email);
    await this.phone.fill(user.phone);
    await this.password.fill(user.password);
    await this.confirmPassword.fill(user.confirmPassword);

    if (user.acceptTerms) await this.acceptTerms.check();
    if (user.acceptMarketing) await this.acceptMarketing.check();
  }

  async register(user: RegisterUser) {
    await this.fillForm(user);
    await this.submitBtn.click();
  }
}
