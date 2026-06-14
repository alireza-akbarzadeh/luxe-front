import type { Page } from '@playwright/test';

import { mockJsonRoute } from './api-mock';
import {
  createProduct,
  emptyCartResponse,
  navMenusResponse,
  productByIdResponse,
  productsListResponse,
  type ProductMock
} from '../utils/factories/product.factory';

type CatalogMockOptions = {
  product?: ProductMock;
  productId?: number;
  cartStatus?: number;
};

/**
 * Mocks browser-facing catalog/cart/nav API calls so smoke tests run without a live backend.
 * Server Components prefetch is not intercepted — tests wait for client hydration after mocks apply.
 */
export async function mockCatalogApi(page: Page, options: CatalogMockOptions = {}) {
  const product = options.product ?? createProduct({ id: options.productId ?? 7 });
  const productId = String(product.id);

  await mockJsonRoute(page, '**/nav-menus**', { body: navMenusResponse() });

  await mockJsonRoute(page, new RegExp(`/products/${productId}/related`), {
    body: { success: true, data: [] }
  });

  await mockJsonRoute(page, new RegExp(`/products/${productId}(?:\\?|$)`), {
    body: productByIdResponse(product)
  });

  await mockJsonRoute(page, /\/products\?/, {
    body: productsListResponse([product])
  });

  await mockJsonRoute(page, '**/reviews?**', {
    body: { success: true, data: { reviews: [], total: 0 } }
  });

  await mockJsonRoute(page, '**/cart**', {
    status: options.cartStatus ?? 401,
    body:
      options.cartStatus === 200
        ? emptyCartResponse()
        : { success: false, message: 'Unauthorized', code: 401 }
  });
}
