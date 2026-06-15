import type { StoreFiltersState } from '@/domains/store/filter.schema';
import type { SortKey } from '@/domains/store/store.types';
import type { GetStoresParams } from '@/services/-stores-get.schemas';
import type { DtoStoreResponse } from '@/services/-stores-get.schemas';

export type StoresCatalogParams = Omit<GetStoresParams, 'limit' | 'offset'>;

const SORT_TO_API: Record<SortKey, string> = {
  popular: 'rating',
  top_rated: 'rating',
  most_followed: 'followers',
  recently_joined: 'newest',
  name_asc: 'rating'
};

/** Remove empty values so SSR/client query keys stay identical. */
export function normalizeStoresCatalogParams(
  params: StoresCatalogParams = {}
): StoresCatalogParams {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null || value === '') return false;
      if (typeof value === 'number' && (Number.isNaN(value) || value === 0)) return false;
      return true;
    })
  ) as StoresCatalogParams;
}

/** Map URL filter state to Orval store list params (no pagination). */
export function toStoresCatalogParams(filters: StoreFiltersState): StoresCatalogParams {
  const categorySlug = filters.category[0]
    ? filters.category[0].toLowerCase().replace(/\s+/g, '-')
    : undefined;

  return normalizeStoresCatalogParams({
    search: filters.search || undefined,
    location: filters.location || undefined,
    min_rating: filters.rating > 0 ? filters.rating : undefined,
    category_slug: categorySlug,
    sort_by: SORT_TO_API[filters.sort]
  });
}

export function flattenInfiniteStores(
  pages: Array<{ data?: { stores?: DtoStoreResponse[] | null; total?: number | null } | null } | undefined>
) {
  return pages.flatMap((page) => page?.data?.stores ?? []);
}

export function getInfiniteStoresTotal(
  pages: Array<{ data?: { total?: number | null } | null } | undefined> | undefined
) {
  return pages?.[0]?.data?.total ?? 0;
}
