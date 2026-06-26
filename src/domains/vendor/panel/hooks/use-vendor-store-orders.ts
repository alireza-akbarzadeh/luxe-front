import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import {
  getVendorStoreOrderStats,
  listVendorStoreOrders,
  type VendorOrdersListParams,
  type VendorOrdersListResponse,
  type VendorOrderStatsResponse
} from '@/lib/api/vendor-orders';

/** TanStack Query hook for paginated vendor store orders (active store from panel store). */
export function useVendorStoreOrdersQuery(params: VendorOrdersListParams) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-store-orders', activeStoreId, params],
    queryFn: () => listVendorStoreOrders(activeStoreId, params),
    enabled: activeStoreId > 0
  });
}

/** Order KPI counts for the vendor orders page header cards. */
export function useVendorStoreOrderStatsQuery() {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-store-order-stats', activeStoreId],
    queryFn: () => getVendorStoreOrderStats(activeStoreId),
    enabled: activeStoreId > 0
  });
}

export type { VendorOrdersListParams, VendorOrdersListResponse, VendorOrderStatsResponse };
