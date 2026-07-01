import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoSuggestionItem } from '~/src/services/-search-suggestions-get.schemas';

import type { SearchParams } from './hooks/useSearchParams';

export const SEARCH_DEFAULT_PRICE_MIN = 0;
export const SEARCH_DEFAULT_PRICE_MAX = 1000;
export const SEARCH_PRICE_STEP = 1;

/** Client-side filter draft — applied to URL only when the mobile sheet is submitted. */
export interface SearchFilterDraft {
  categories: string[];
  stores: string[];
  priceRange: [number, number];
  minRating: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
  isDigital: boolean;
}

export function createEmptySearchFilterDraft(): SearchFilterDraft {
  return {
    categories: [],
    stores: [],
    priceRange: [SEARCH_DEFAULT_PRICE_MIN, SEARCH_DEFAULT_PRICE_MAX],
    minRating: 0,
    inStock: false,
    onSale: false,
    isNew: false,
    isDigital: false
  };
}

export function createSearchFilterDraftFromParams(
  params: Pick<
    SearchParams,
    | 'categories'
    | 'stores'
    | 'priceRange'
    | 'minRating'
    | 'inStock'
    | 'onSale'
    | 'isNew'
    | 'isDigital'
  >
): SearchFilterDraft {
  return {
    categories: [...params.categories],
    stores: [...params.stores],
    priceRange: [params.priceRange[0], params.priceRange[1]],
    minRating: params.minRating,
    inStock: params.inStock,
    onSale: params.onSale,
    isNew: params.isNew,
    isDigital: params.isDigital
  };
}

export function hasActiveSearchFilterDraft(draft: SearchFilterDraft): boolean {
  return (
    draft.categories.length > 0 ||
    draft.stores.length > 0 ||
    draft.priceRange[0] > SEARCH_DEFAULT_PRICE_MIN ||
    draft.priceRange[1] < SEARCH_DEFAULT_PRICE_MAX ||
    draft.minRating > 0 ||
    draft.inStock ||
    draft.onSale ||
    draft.isNew ||
    draft.isDigital
  );
}

export function countSearchFilterDraft(draft: SearchFilterDraft): number {
  let count = 0;
  if (draft.categories.length > 0) count += draft.categories.length;
  if (draft.stores.length > 0) count += draft.stores.length;
  if (draft.priceRange[0] > SEARCH_DEFAULT_PRICE_MIN || draft.priceRange[1] < SEARCH_DEFAULT_PRICE_MAX) {
    count++;
  }
  if (draft.minRating > 0) count++;
  if (draft.inStock) count++;
  if (draft.onSale) count++;
  if (draft.isNew) count++;
  if (draft.isDigital) count++;
  return count;
}

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

type SearchQueryInput = Pick<
  SearchParams,
  | 'query'
  | 'page'
  | 'perPage'
  | 'categories'
  | 'stores'
  | 'sortBy'
  | 'priceRange'
  | 'minRating'
  | 'inStock'
  | 'onSale'
  | 'isNew'
  | 'isDigital'
>;

export function buildSearchQueryParams(
  searchParams: SearchQueryInput,
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
  return first ?? IMAGE_FALLBACK;
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
