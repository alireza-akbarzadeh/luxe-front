import type { GetSearchParams } from '~/src/services/-search-get.schemas';

import type { SearchParams } from './hooks/useSearchParams';

type CategoryLookup = {
  id?: number;
  slug?: string;
};

export function mapSortToAPI(sortBy: string): string | undefined {
  switch (sortBy) {
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    case 'newest':
      return 'newest';
    case 'popular':
      return 'popular';
    default:
      return undefined;
  }
}

function parseStoreId(storeId: string | undefined): number | undefined {
  if (!storeId) return undefined;
  const parsed = Number(storeId);
  return Number.isNaN(parsed) ? undefined : parsed;
}

export function buildSearchQueryParams(
  searchParams: SearchParams,
  category?: CategoryLookup
): GetSearchParams {
  const storeId = parseStoreId(searchParams.stores[0]);

  return {
    q: searchParams.query,
    limit: searchParams.perPage,
    offset: (searchParams.page - 1) * searchParams.perPage,
    min_price: searchParams.priceRange[0] > 0 ? searchParams.priceRange[0] : undefined,
    max_price: searchParams.priceRange[1] < 1000 ? searchParams.priceRange[1] : undefined,
    min_rating: searchParams.minRating > 0 ? searchParams.minRating : undefined,
    is_digital: searchParams.isDigital || undefined,
    is_new: searchParams.isNew || undefined,
    in_stock: searchParams.inStock || undefined,
    on_sale: searchParams.onSale || undefined,
    sort: mapSortToAPI(searchParams.sortBy),
    category_slug: category?.slug,
    category_id: category?.id,
    store_id: storeId
  } as GetSearchParams;
}
