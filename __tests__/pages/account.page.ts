import { BasePage } from './base.page';

export class AccountPage extends BasePage {
  override async goto(path = '/account') {
    await super.goto(path);
  }

  async logout() {
    await this.page.getByTestId('logout-button').click();
  }
}
