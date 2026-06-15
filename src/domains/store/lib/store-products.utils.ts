import type { SortBy } from '@/domains/store/hooks/useStoreFilter';
import type { StoreEssentialsType } from '@/domains/store/store.utils';
import type {
  DtoProductResponse,
  GetStoresSlugProductsParams
} from '@/services/-stores-{slug}-products-get.schemas';

export type StoreProductsCatalogParams = Omit<GetStoresSlugProductsParams, 'limit' | 'offset'>;

export function normalizeStoreProductsParams(
  params: StoreProductsCatalogParams = {}
): StoreProductsCatalogParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false;
      if (typeof value === 'number' && Number.isNaN(value)) return false;
      return true;
    })
  ) as StoreProductsCatalogParams;
}

interface BuildStoreProductsParamsInput {
  category?: string;
  priceRange: [number, number];
  minRating: number;
  isDigital: boolean;
  showOnlyNew: boolean;
  sortBy: SortBy;
  searchQuery: string;
  store: StoreEssentialsType;
}

/** Build store product filter params (no pagination) for infinite query keys. */
export function toStoreProductsCatalogParams(
  input: BuildStoreProductsParamsInput
): StoreProductsCatalogParams {
  const { category, priceRange, minRating, isDigital, showOnlyNew, sortBy, searchQuery, store } =
    input;

  const categoryId = category
    ? store.categories?.find((c) => c.name === category)?.id
    : undefined;

  const params: StoreProductsCatalogParams = {};

  if (categoryId) params.category_id = categoryId;
  if (priceRange[0] > 0) params.min_price = priceRange[0];
  if (priceRange[1] < 500) params.max_price = priceRange[1];
  if (minRating > 0) params.min_rating = minRating;
  if (isDigital) params.is_digital = true;
  if (showOnlyNew) params.is_new = true;
  if (searchQuery) params.name = searchQuery;

  switch (sortBy) {
    case 'price-asc':
      params.sort = 'price_asc';
      break;
    case 'price-desc':
      params.sort = 'price_desc';
      break;
    case 'rating':
      params.sort = 'rating_desc';
      break;
    case 'newest':
      params.sort = 'newest';
      break;
    default:
      params.sort = 'rating_desc';
  }

  return normalizeStoreProductsParams(params);
}

export function flattenInfiniteStoreProducts(
  pages: Array<{ data?: { products?: DtoProductResponse[] | null } | null } | undefined>
) {
  return pages.flatMap((page) => page?.data?.products ?? []);
}

export function getInfiniteStoreProductsTotal(
  pages: Array<{ data?: { total?: number | null } | null } | undefined> | undefined
) {
  return pages?.[0]?.data?.total ?? 0;
}

export function filterStoreSaleProducts(products: DtoProductResponse[]) {
  return products.filter(
    (product) => product.compare_at_price && product.compare_at_price > (product.price ?? 0)
  );
}
