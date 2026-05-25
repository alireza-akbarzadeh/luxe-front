import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  override async goto(path = '/account') {
    await super.goto(path);
  }

  async logout() {
    await this.page.getByTestId('logout-button').click();
  }
}
