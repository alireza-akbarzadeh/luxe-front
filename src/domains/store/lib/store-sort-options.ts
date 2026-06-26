import type { SortBy } from '@/domains/store/hooks/useStoreFilter';

export const STORE_DETAIL_SORT_OPTIONS: {
  value: SortBy;
  labelKey: 'featured' | 'newest' | 'priceAsc' | 'priceDesc' | 'rating';
}[] = [
  { value: 'featured', labelKey: 'featured' },
  { value: 'newest', labelKey: 'newest' },
  { value: 'price-asc', labelKey: 'priceAsc' },
  { value: 'price-desc', labelKey: 'priceDesc' },
  { value: 'rating', labelKey: 'rating' }
];
