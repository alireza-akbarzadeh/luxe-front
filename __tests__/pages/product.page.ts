import type { Locator, Page } from '@playwright/test';

import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly photosTab: Locator;
  readonly videoTab: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
    this.photosTab = page.getByRole('button', { name: 'Photos' });
    this.videoTab = page.getByRole('button', { name: 'Video' });
  }

  override async goto(productId: number | string) {
    await super.goto(`/product/${productId}`);
  }

  title(name: string) {
    return this.page.getByRole('heading', { level: 1, name });
  }

  cartButton() {
    return this.page.getByRole('button', { name: /open cart/i });
  }

  cartSheetTitle() {
    return this.page.getByRole('heading', { name: /your cart/i });
  }

  openFullscreenGallery() {
    return this.page.getByRole('button', { name: 'Open fullscreen gallery' });
  }
}
