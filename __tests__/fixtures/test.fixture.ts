import { test as base } from '@playwright/test';

import { AccountPage } from '../pages/account.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { RegisterPage } from '../pages/register.page';
import { ShopPage } from '../pages/shop.page';

type PageFixtures = {
  loginPage: LoginPage;
  registerPage: RegisterPage;
  accountPage: AccountPage;
  shopPage: ShopPage;
  productPage: ProductPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },

  accountPage: async ({ page }, use) => {
    await use(new AccountPage(page));
  },

  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  }
});

export { expect } from '@playwright/test';
