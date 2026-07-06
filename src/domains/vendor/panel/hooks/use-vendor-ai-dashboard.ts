import { useQuery } from '@tanstack/react-query';

import { useVendorPanelStore } from '@/domains/vendor/panel/stores/vendor-panel-store';
import { getVendorStoreAiDashboard } from '@/lib/api/vendor-ai-dashboard';

/** Loads AI (or rule-based fallback) vendor dashboard insights for the active store. */
export function useVendorAiDashboardQuery() {
  const activeStoreId = useVendorPanelStore((s) => s.activeStoreId);

  return useQuery({
    queryKey: ['vendor-ai-dashboard', activeStoreId],
    queryFn: () => getVendorStoreAiDashboard(activeStoreId),
    enabled: activeStoreId > 0,
    staleTime: 5 * 60 * 1000
  });
}
