import type { DtoProductWithLike } from '@/services/-products-get.schemas';
import type { DtoProductResponse, GetSearchParams } from '@/services/-search-get.schemas';

import { SHOP_PAGE_SIZE, type SortBy } from '../useProductFilters';

export interface ShopSearchFilterInput {
  searchQuery: string;
  page: number;
  categoryId: number;
  brandId?: number;
  priceMin: number;
  priceMax: number;
  minRating: number;
  maxRating: number;
  minReviews: number;
  maxReviews: number;
  showOnlyNew: boolean;
  showOnlySale: boolean;
  isDigital: boolean;
  inStock?: boolean;
  sortBy: SortBy;
  limit?: number;
}

const mapSortToSearchApi = (sort: SortBy): string | undefined => {
  switch (sort) {
    case 'newest':
      return 'newest';
    case 'price-asc':
      return 'price_asc';
    case 'price-desc':
      return 'price_desc';
    case 'rating':
      return 'rating_desc';
    case 'popular':
    case 'best-selling':
      return 'popular';
    default:
      return undefined;
  }
};

export function buildShopSearchParams(input: ShopSearchFilterInput): GetSearchParams {
  const query = input.searchQuery.trim();
  const limit = input.limit ?? SHOP_PAGE_SIZE;

  return {
    q: query || undefined,
    limit,
    offset: (input.page - 1) * limit,
    category_id: input.categoryId > 0 ? input.categoryId : undefined,
    min_price: input.priceMin > 0 ? input.priceMin : undefined,
    max_price: input.priceMax < 500 ? input.priceMax : undefined,
    min_rating: input.minRating > 0 ? input.minRating : undefined,
    is_digital: input.isDigital || undefined,
    is_new: input.showOnlyNew || undefined,
    on_sale: input.showOnlySale || undefined,
    in_stock: input.inStock || undefined,
    sort: mapSortToSearchApi(input.sortBy)
  };
}

export function toProductWithLike(product: DtoProductResponse): DtoProductWithLike {
  return { ...product, is_liked: false };
}

export function applyShopClientFilters(
  products: DtoProductWithLike[],
  input: Pick<ShopSearchFilterInput, 'maxRating' | 'minReviews' | 'maxReviews' | 'brandId'>
): DtoProductWithLike[] {
  let result = products;
  if (input.maxRating < 5) {
    result = result.filter((p) => (p.rating ?? 0) <= input.maxRating);
  }
  if (input.minReviews > 0) {
    result = result.filter((p) => (p.reviews_count ?? 0) >= input.minReviews);
  }
  if (input.maxReviews < 1000) {
    result = result.filter((p) => (p.reviews_count ?? 0) <= input.maxReviews);
  }
  if (input.brandId && input.brandId > 0) {
    result = result.filter((p) => p.brand_id === input.brandId);
  }
  return result;
}

export function isPopularSort(sortBy: SortBy) {
  return sortBy === 'popular' || sortBy === 'best-selling';
}

export function shouldUseSearchApi(
  searchQuery: string,
  sortBy: SortBy,
  options?: { inStock?: boolean }
) {
  return searchQuery.trim().length > 0 || isPopularSort(sortBy) || Boolean(options?.inStock);
}
