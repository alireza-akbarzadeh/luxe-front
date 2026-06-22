import type { DtoProductWithLike, GetProductsSort } from '@/services/-products-get.schemas';
import type { DtoProductResponse } from '@/services/-search-get.schemas';
import type { GetSearchParams } from '@/services/-search-get.schemas';

import { SHOP_PAGE_SIZE } from '../useProductFilters';

type SortBy = 'featured' | 'newest' | 'price-asc' | 'price-desc' | 'rating';

export interface ShopSearchFilterInput {
  searchQuery: string;
  page: number;
  categoryId: number;
  priceMin: number;
  priceMax: number;
  minRating: number;
  maxRating: number;
  minReviews: number;
  maxReviews: number;
  showOnlyNew: boolean;
  showOnlySale: boolean;
  isDigital: boolean;
  sortBy: SortBy;
  limit?: number;
}

const mapSortToSearchApi = (sort: SortBy): GetProductsSort | undefined => {
  switch (sort) {
    case 'newest':
      return 'newest';
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    default:
      return undefined;
  }
};

/** Maps shop URL filters to GET /search — FTS + i18n search_document. */
export function buildShopSearchParams(input: ShopSearchFilterInput): GetSearchParams {
  const query = input.searchQuery.trim();
  const limit = input.limit ?? SHOP_PAGE_SIZE;

  return {
    q: query,
    limit,
    offset: (input.page - 1) * limit,
    category_id: input.categoryId > 0 ? input.categoryId : undefined,
    min_price: input.priceMin > 0 ? input.priceMin : undefined,
    max_price: input.priceMax < 500 ? input.priceMax : undefined,
    min_rating: input.minRating > 0 ? input.minRating : undefined,
    is_digital: input.isDigital || undefined,
    is_new: input.showOnlyNew || undefined,
    on_sale: input.showOnlySale || undefined,
    sort: mapSortToSearchApi(input.sortBy)
  };
}

export function toProductWithLike(product: DtoProductResponse): DtoProductWithLike {
  return {
    ...product,
    is_liked: false
  };
}

/** Filters the search API does not support (rating max, review counts). */
export function applyShopClientFilters(
  products: DtoProductWithLike[],
  input: Pick<ShopSearchFilterInput, 'maxRating' | 'minReviews' | 'maxReviews'>
): DtoProductWithLike[] {
  let result = products;

  if (input.maxRating < 5) {
    result = result.filter((product) => (product.rating ?? 0) <= input.maxRating);
  }
  if (input.minReviews > 0) {
    result = result.filter((product) => (product.reviews_count ?? 0) >= input.minReviews);
  }
  if (input.maxReviews < 1000) {
    result = result.filter((product) => (product.reviews_count ?? 0) <= input.maxReviews);
  }

  return result;
}
