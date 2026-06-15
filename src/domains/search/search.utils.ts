import type { DtoSuggestionItem } from '~/src/services/-search-suggestions-get.schemas';

import type { SearchParams } from './hooks/useSearchParams';

export const SEARCH_DEFAULT_PRICE_MIN = 0;
export const SEARCH_DEFAULT_PRICE_MAX = 1000;
export const SEARCH_PRICE_STEP = 1;

export function isSearchPriceFilterActive(priceRange: [number, number]): boolean {
  return (
    priceRange[0] > SEARCH_DEFAULT_PRICE_MIN || priceRange[1] < SEARCH_DEFAULT_PRICE_MAX
  );
}

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
): import('~/src/services/-search-get.schemas').GetSearchParams {
  const storeId = parseStoreId(searchParams.stores[0]);

  return {
    q: searchParams.query,
    limit: searchParams.perPage,
    offset: (searchParams.page - 1) * searchParams.perPage,
    min_price:
      searchParams.priceRange[0] > SEARCH_DEFAULT_PRICE_MIN
        ? searchParams.priceRange[0]
        : undefined,
    max_price:
      searchParams.priceRange[1] < SEARCH_DEFAULT_PRICE_MAX
        ? searchParams.priceRange[1]
        : undefined,
    min_rating: searchParams.minRating > 0 ? searchParams.minRating : undefined,
    is_digital: searchParams.isDigital || undefined,
    is_new: searchParams.isNew || undefined,
    in_stock: searchParams.inStock || undefined,
    on_sale: searchParams.onSale || undefined,
    sort: mapSortToAPI(searchParams.sortBy),
    category_slug: category?.slug,
    category_id: category?.id,
    store_id: storeId
  };
}

/** Safe product image for search result cards — avoids empty Next.js `src`. */
export function getSearchProductImage(images?: Array<string | null> | null): string {
  const first = images?.find((image) => typeof image === 'string' && image.length > 0);
  return first ?? '/placeholder.png';
}

/** Human-readable pagination range, e.g. 1–12 of 240. */
export function getSearchResultRange(page: number, perPage: number, total: number) {
  if (total <= 0) {
    return { from: 0, to: 0, total: 0 };
  }

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  return { from, to, total };
}

export function groupSuggestionsByType(suggestions: DtoSuggestionItem[]) {
  return {
    products: suggestions.filter((item) => item.type === 'product'),
    stores: suggestions.filter((item) => item.type === 'store'),
    categories: suggestions.filter((item) => item.type === 'category')
  };
}

export function getSuggestionImage(suggestion: DtoSuggestionItem): string | undefined {
  if (suggestion.image && suggestion.image.length > 0) return suggestion.image;
  return undefined;
}
