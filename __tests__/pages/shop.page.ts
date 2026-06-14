import type { Locator, Page } from '@playwright/test';

import { BasePage } from './base.page';

export class ShopPage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Shop All' });
  }

  override async goto() {
    await super.goto('/shop');
  }

  productCards() {
    return this.page.locator('article').filter({ has: this.page.getByRole('link') });
  }
}
