import { customInstance } from '@/lib/api/api-client';

export interface VendorAiDashboardResponse {
  data?: {
    ai_enabled?: boolean;
    summary?: string;
    health_score?: number;
    priorities?: string[];
    opportunities?: string[];
    alerts?: string[];
    sources?: string[];
  };
}

/** AI-powered vendor home briefing for the active store. */
export async function getVendorStoreAiDashboard(storeId: number) {
  return customInstance<VendorAiDashboardResponse>({
    url: `/vendor/stores/${storeId}/ai/dashboard`,
    method: 'GET'
  });
}
