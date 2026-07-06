import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStoreAiInventoryForecast } from '@/lib/api/vendor-ai-inventory-forecast';

/** Loads AI (or rule-based fallback) inventory forecasts for the active store. */
export function useVendorAiInventoryForecastQuery(days = 30) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-ai-inventory-forecast', activeStoreId, days],
    queryFn: () => getVendorStoreAiInventoryForecast(activeStoreId, days),
    enabled: activeStoreId > 0,
    staleTime: 5 * 60 * 1000
  });
}
