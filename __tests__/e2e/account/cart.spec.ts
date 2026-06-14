import { mockCatalogApi } from '~/__tests__/helpers/catalog-api-mock';
import { skipUnlessIntegration } from '~/__tests__/helpers/integration';
import { expect, test } from '~/__tests__/fixtures/test.fixture';

test.describe('Authenticated cart @integration', () => {
  test.beforeEach(async ({ page }) => {
    await mockCatalogApi(page, { cartStatus: 200 });
  });

  test('signed-in user can open cart sheet from navbar @integration', async ({ page }) => {
    skipUnlessIntegration();

    await page.goto('/shop');
    await page.getByRole('button', { name: /open cart/i }).click();

    await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();
  });
});
