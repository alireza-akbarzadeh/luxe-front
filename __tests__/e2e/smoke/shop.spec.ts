import { expect, test } from '@playwright/test';

import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';
import { createProduct } from '~/__tests__/utils/factories/product.factory';

test.describe('Shop @smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page);
  });

  test('shop page renders heading and product grid', async ({ page }) => {
    await page.goto('/shop');

    await expect(page.getByRole('heading', { name: 'Shop All' })).toBeVisible();
    await expect(page.getByText(/explore our complete collection/i)).toBeVisible();

    await expect(page.locator('article').first()).toBeVisible({ timeout: 15_000 });
  });

  test('shop page links to product detail', async ({ page }) => {
    const product = createProduct();

    await page.goto('/shop');
    await expect(page.getByRole('heading', { name: 'Shop All' })).toBeVisible();

    const productLink = page.locator(`a[href="/product/${product.slug}"]`).first();
    await expect(productLink).toBeVisible({ timeout: 15_000 });
    await productLink.click();

    await expect(page).toHaveURL(new RegExp(`/product/${product.slug}$`));
    await expect(page.getByRole('heading', { level: 1, name: product.name })).toBeVisible({
      timeout: 15_000
    });
  });
});
