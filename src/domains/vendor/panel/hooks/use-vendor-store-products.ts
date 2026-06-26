import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import {
  getVendorStoreProductStats,
  listVendorStoreProducts,
  type VendorProductsListParams,
  type VendorProductsListResponse,
  type VendorProductStatsResponse
} from '@/lib/api/vendor-products';

/** TanStack Query hook for paginated vendor store products (active store from panel store). */
export function useVendorStoreProductsQuery(params: VendorProductsListParams) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-store-products', activeStoreId, params],
    queryFn: () => listVendorStoreProducts(activeStoreId, params),
    enabled: activeStoreId > 0
  });
}

/** Product KPI counts for the vendor products page header. */
export function useVendorStoreProductStatsQuery() {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-store-product-stats', activeStoreId],
    queryFn: () => getVendorStoreProductStats(activeStoreId),
    enabled: activeStoreId > 0
  });
}

export type { VendorProductsListParams, VendorProductsListResponse, VendorProductStatsResponse };
