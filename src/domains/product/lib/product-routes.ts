/** Canonical storefront path for a product detail page. Prefer slug over numeric id. */
export function getProductPath(product?: {
  slug?: string | null;
  id?: number | string | null;
}): string {
  if (product?.slug) return `/product/${product.slug}`;
  if (product?.id != null) return `/product/${product.id}`;
  return '/shop';
}

export const NUMERIC_PRODUCT_ID = /^\d+$/;
