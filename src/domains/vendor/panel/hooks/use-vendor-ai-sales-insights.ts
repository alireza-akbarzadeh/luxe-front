import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStoreAiSalesInsights } from '@/lib/api/vendor-ai-sales-insights';

/** Loads AI (or rule-based fallback) vendor sales insights for the active store. */
export function useVendorAiSalesInsightsQuery(days = 30) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-ai-sales-insights', activeStoreId, days],
    queryFn: () => getVendorStoreAiSalesInsights(activeStoreId, days),
    enabled: activeStoreId > 0,
    staleTime: 5 * 60 * 1000
  });
}
