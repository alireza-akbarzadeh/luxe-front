import { customInstance } from '@/lib/api/api-client';

export interface VendorPricingSuggestion {
  product_id?: number;
  name?: string;
  current_price?: number;
  suggested_price?: number;
  action?: string;
  margin_pct?: number;
  units_sold?: number;
  revenue?: number;
  rationale?: string;
}

export interface VendorAiPricingAssistantResponse {
  data?: {
    ai_enabled?: boolean;
    period_days?: number;
    summary?: string;
    highlights?: string[];
    recommendations?: string[];
    warnings?: string[];
    suggestions?: VendorPricingSuggestion[];
    sources?: string[];
  };
}

/** AI-powered pricing recommendations for the active vendor store. */
export async function getVendorStoreAiPricingAssistant(storeId: number, days = 30) {
  return customInstance<VendorAiPricingAssistantResponse>({
    url: `/vendor/stores/${storeId}/ai/pricing-assistant`,
    method: 'GET',
    params: { days }
  });
}
