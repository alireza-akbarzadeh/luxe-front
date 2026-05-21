import type { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async logout() {
    await this.page.getByTestId('logout-button').click();
  }
}
