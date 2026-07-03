import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoAiSearchIntentResponse } from '@/services/-ai-search-intent-post.schemas';
import type { DtoAiVisualSearchResponse } from '@/services/-ai-visual-search-post.schemas';
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
  if (
    draft.priceRange[0] > SEARCH_DEFAULT_PRICE_MIN ||
    draft.priceRange[1] < SEARCH_DEFAULT_PRICE_MAX
  ) {
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
  return priceRange[0] > SEARCH_DEFAULT_PRICE_MIN || priceRange[1] < SEARCH_DEFAULT_PRICE_MAX;
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

export function mapApiSortToClient(
  sort?: string
): import('./hooks/useSearchParams').SortBy | undefined {
  switch (sort) {
    case 'price_asc':
      return 'price-asc';
    case 'price_desc':
      return 'price-desc';
    case 'rating_desc':
      return 'rating';
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

/** Build /search URL with intent-derived filters for cross-page navigation. */
export function buildIntentSearchUrl(
  intent: DtoAiSearchIntentResponse,
  originalQuery: string
): string {
  const params = new URLSearchParams();
  const keyword = intent.search_query?.trim() || originalQuery.trim();
  params.set('q', keyword);

  if (intent.min_price && intent.min_price > 0) {
    params.set('priceMin', String(Math.floor(intent.min_price)));
  }
  if (intent.max_price && intent.max_price > 0) {
    params.set('priceMax', String(Math.ceil(intent.max_price)));
  }
  if (intent.min_rating && intent.min_rating > 0) {
    params.set('minRating', String(Math.floor(intent.min_rating)));
  }
  if (intent.in_stock) params.set('inStock', 'true');
  if (intent.on_sale) params.set('onSale', 'true');
  if (intent.is_new) params.set('isNew', 'true');
  if (intent.is_digital) params.set('isDigital', 'true');

  const sortBy = mapApiSortToClient(intent.sort);
  if (sortBy && sortBy !== 'relevance') {
    params.set('sortBy', sortBy);
  }

  return `/search?${params.toString()}`;
}

/** Build /search URL with visual-search derived filters for cross-page navigation. */
export function buildVisualSearchUrl(result: DtoAiVisualSearchResponse): string {
  const params = new URLSearchParams();
  const keyword = result.search_query?.trim() ?? '';
  if (keyword) {
    params.set('q', keyword);
  }

  if (result.min_price && result.min_price > 0) {
    params.set('priceMin', String(Math.floor(result.min_price)));
  }
  if (result.max_price && result.max_price > 0) {
    params.set('priceMax', String(Math.ceil(result.max_price)));
  }
  if (result.min_rating && result.min_rating > 0) {
    params.set('minRating', String(Math.floor(result.min_rating)));
  }

  const sortBy = mapApiSortToClient(result.sort);
  if (sortBy && sortBy !== 'relevance') {
    params.set('sortBy', sortBy);
  }

  return `/search?${params.toString()}`;
}

export function getSuggestionImage(suggestion: DtoSuggestionItem): string | undefined {
  if (suggestion.image && suggestion.image.length > 0) return suggestion.image;
  return undefined;
}
