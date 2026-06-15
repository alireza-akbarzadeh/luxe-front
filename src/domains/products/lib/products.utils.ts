import type { DtoProductWithLike, GetProductsParams } from '@/services/-products-get.schemas';

export type ProductsCatalogParams = Omit<GetProductsParams, 'limit' | 'offset'>;

/** Remove empty values so SSR/client query keys and API params stay identical. */
export function normalizeProductsCatalogParams(
  params: ProductsCatalogParams = {}
): ProductsCatalogParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false;
      if (typeof value === 'number' && Number.isNaN(value)) return false;
      return true;
    })
  ) as ProductsCatalogParams;
}

/** Strip pagination fields and normalize filter params for infinite query. */
export function toProductsCatalogParams(apiParams: GetProductsParams): ProductsCatalogParams {
  const { limit: _limit, offset: _offset, ...catalogParams } = apiParams;
  return normalizeProductsCatalogParams(catalogParams);
}

export function filterSaleProducts(products: DtoProductWithLike[]) {
  return products.filter(
    (product) => product.compare_at_price && product.compare_at_price > (product.price ?? 0)
  );
}

export function flattenInfiniteProducts(
  pages: Array<{ data?: { products?: DtoProductWithLike[] | null } | null } | undefined>
) {
  return pages.flatMap((page) => page?.data?.products ?? []);
}

export function getInfiniteProductsTotal(
  pages: Array<{ data?: { total?: number | null } | null } | undefined> | undefined
) {
  return pages?.[0]?.data?.total ?? 0;
}
