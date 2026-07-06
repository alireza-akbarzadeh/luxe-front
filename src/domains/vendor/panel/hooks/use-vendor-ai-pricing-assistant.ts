import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStoreAiPricingAssistant } from '@/lib/api/vendor-ai-pricing-assistant';

/** Loads AI (or rule-based fallback) pricing suggestions for the active store. */
export function useVendorAiPricingAssistantQuery(days = 30) {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-ai-pricing-assistant', activeStoreId, days],
    queryFn: () => getVendorStoreAiPricingAssistant(activeStoreId, days),
    enabled: activeStoreId > 0,
    staleTime: 5 * 60 * 1000
  });
}
