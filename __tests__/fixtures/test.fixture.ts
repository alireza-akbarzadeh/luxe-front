import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { AccountPage } from '../pages/account.page';

type Pages = {
  loginPage: LoginPage;
  accountPage: AccountPage;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  }
});

export { expect } from '@playwright/test';
