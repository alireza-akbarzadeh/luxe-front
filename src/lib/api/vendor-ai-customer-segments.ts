import { customInstance } from '@/lib/api/api-client';

export interface VendorCustomerSegmentSummary {
  segment?: string;
  label?: string;
  count?: number;
  total_spend?: number;
}

export interface VendorCustomerSegmentMember {
  user_id?: number;
  name?: string;
  email?: string;
  order_count?: number;
  total_spend?: number;
  avg_order_value?: number;
  last_order_at?: string;
  segment?: string;
}

export interface VendorAiCustomerSegmentsResponse {
  data?: {
    ai_enabled?: boolean;
    period_days?: number;
    summary?: string;
    highlights?: string[];
    recommendations?: string[];
    campaign_ideas?: string[];
    segments?: VendorCustomerSegmentSummary[];
    customers?: VendorCustomerSegmentMember[];
    sources?: string[];
  };
}

/** AI-powered customer segmentation for the active vendor store. */
export async function getVendorStoreAiCustomerSegments(storeId: number, days = 365) {
  return customInstance<VendorAiCustomerSegmentsResponse>({
    url: `/vendor/stores/${storeId}/ai/customer-segments`,
    method: 'GET',
    params: { days }
  });
}
