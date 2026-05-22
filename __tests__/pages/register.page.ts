import type { Page } from '@playwright/test';
import type { RegisterUser } from '~/__tests__/utils/factories/user.factory';

export class RegisterPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/register');
  }

  firstName = () => this.page.getByTestId('firstName-input');
  lastName = () => this.page.getByTestId('lastName-input');
  email = () => this.page.getByTestId('email-input');
  phone = () => this.page.getByTestId('phone-input');
  password = () => this.page.getByTestId('password-input');
  confirmPassword = () => this.page.getByTestId('confirmPassword-input');

  acceptTerms = () => this.page.getByTestId('acceptTerms-checkbox');
  acceptMarketing = () => this.page.getByTestId('acceptMarketing-checkbox');

  submit = () => this.page.getByTestId('register-submit');
  errorBox = () => this.page.getByTestId('register-error');

  async fillForm(user: RegisterUser) {
    await this.firstName().fill(user.firstName);
    await this.lastName().fill(user.lastName);
    await this.email().fill(user.email);
    await this.phone().fill(user.phone);
    await this.password().fill(user.password);
    await this.confirmPassword().fill(user.confirmPassword);

    if (user.acceptTerms) await this.acceptTerms().check();
    if (user.acceptMarketing) await this.acceptMarketing().check();
  }

  async register(user: RegisterUser) {
    await this.fillForm(user);
    await this.submit().click();
  }
}
