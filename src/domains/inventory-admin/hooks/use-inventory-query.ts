import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { GetAdminInventoryStockStatus } from '@/services/-admin-inventory-get.schemas';

export type InventoryStockStatus = GetAdminInventoryStockStatus;

const STOCK_STATUSES = ['all', 'low', 'out', 'healthy', 'not_tracked'] as const;
const SORT_OPTIONS = ['stock_asc', 'stock_desc', 'name_asc', 'waitlist_desc', 'velocity_desc'] as const;

export type InventorySort = (typeof SORT_OPTIONS)[number];

export function useInventoryQueryState() {
  const [stockStatus, setStockStatus] = useQueryState(
    'status',
    parseAsStringEnum<InventoryStockStatus>([...STOCK_STATUSES]).withDefault('all')
  );
  const [sort, setSort] = useQueryState(
    'sort',
    parseAsStringEnum<InventorySort>([...SORT_OPTIONS]).withDefault('stock_asc')
  );

  return {
    stockStatus,
    setStockStatus,
    sort,
    setSort
  };
}
