import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStoreAiCustomerSegments } from '@/lib/api/vendor-ai-customer-segments';

/** Loads AI (or rule-based fallback) customer segments for the active store. */
export function useVendorAiCustomerSegmentsQuery(days = 365) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-ai-customer-segments', activeStoreId, days],
    queryFn: () => getVendorStoreAiCustomerSegments(activeStoreId, days),
    enabled: activeStoreId > 0,
    staleTime: 5 * 60 * 1000
  });
}
