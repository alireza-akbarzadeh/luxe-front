import { expect, test } from '@playwright/test';

import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';
import { assertNoRscStorm, countRscRequests } from '~/__tests__/helpers/network';
import { createProduct } from '~/__tests__/utils/factories/product.factory';

test.describe('Product detail @smoke', () => {
  const product = createProduct();

  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page, { product });
  });

  test('product page renders gallery, price, and add to cart', async ({ page }) => {
    await page.goto(`/product/${product.id}`);

    await expect(page.getByRole('heading', { level: 1, name: product.name })).toBeVisible({
      timeout: 15_000
    });

    await expect(page.getByRole('button', { name: 'Photos' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Video' })).toBeVisible();
    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Description' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Reviews' })).toBeVisible();
  });

  test('product page does not enter an RSC refetch loop', async ({ page }) => {
    const requests = await countRscRequests(page, async () => {
      await page.goto(`/product/${product.id}`);
      await expect(page.getByRole('heading', { level: 1, name: product.name })).toBeVisible({
        timeout: 15_000
      });
      await page.waitForTimeout(1_500);
    });

    assertNoRscStorm(requests);
  });

  test('product gallery opens fullscreen lightbox', async ({ page }) => {
    await page.goto(`/product/${product.id}`);

    await expect(page.getByRole('heading', { level: 1, name: product.name })).toBeVisible({
      timeout: 15_000
    });

    await page.getByRole('button', { name: 'Open fullscreen gallery' }).click();

    await expect(page.getByRole('button', { name: 'Close gallery' })).toBeVisible();
    await expect(page.getByText(/image 1 of/i)).toBeVisible();
  });

  test('guest add to cart opens cart sheet with sign-in prompt', async ({ page }) => {
    await page.goto(`/product/${product.id}`);

    await expect(page.getByRole('button', { name: /add to cart/i })).toBeVisible({
      timeout: 15_000
    });

    await page.getByRole('button', { name: /add to cart/i }).click();

    await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
    await expect(page.getByText(/sign in to view your cart/i)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });
});
