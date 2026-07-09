import { parseAsInteger, parseAsStringEnum, useQueryState } from 'nuqs';

import { GetProductsStatus } from '@/services/-products-get.schemas';

const STATUS_VALUES = [
  'all',
  GetProductsStatus.active,
  GetProductsStatus.draft,
  GetProductsStatus.archived
] as const;

export type ProductsStatusFilter = (typeof STATUS_VALUES)[number];

export function useProductsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<ProductsStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );
  const [minPrice, setMinPrice] = useQueryState('min_price', parseAsInteger);
  const [maxPrice, setMaxPrice] = useQueryState('max_price', parseAsInteger);
  const [categoryId, setCategoryId] = useQueryState('category_id', parseAsInteger);
  const [brandId, setBrandId] = useQueryState('brand_id', parseAsInteger);
  const [isDigital, setIsDigital] = useQueryState(
    'digital',
    parseAsStringEnum(['all', 'yes', 'no'] as const).withDefault('all')
  );

  const hasActiveFilters = Boolean(
    status !== 'all' ||
    minPrice != null ||
    maxPrice != null ||
    categoryId != null ||
    brandId != null ||
    isDigital !== 'all'
  );

  const resetFilters = async () => {
    await setStatus('all');
    await setMinPrice(null);
    await setMaxPrice(null);
    await setCategoryId(null);
    await setBrandId(null);
    await setIsDigital('all');
  };

  return {
    status,
    setStatus,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    categoryId,
    setCategoryId,
    brandId,
    setBrandId,
    isDigital,
    setIsDigital,
    hasActiveFilters,
    resetFilters
  };
}
