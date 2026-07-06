import { customInstance } from '@/lib/api/api-client';

export interface VendorSalesMetrics {
  revenue?: number;
  order_count?: number;
  units_sold?: number;
  avg_order_value?: number;
  revenue_change_pct?: number;
  orders_change_pct?: number;
}

export interface VendorDailySalesPoint {
  date?: string;
  revenue?: number;
  orders?: number;
}

export interface VendorTopProductSales {
  product_id?: number;
  name?: string;
  revenue?: number;
  units?: number;
}

export interface VendorAiSalesInsightsResponse {
  data?: {
    ai_enabled?: boolean;
    period_days?: number;
    summary?: string;
    highlights?: string[];
    recommendations?: string[];
    warnings?: string[];
    metrics?: VendorSalesMetrics;
    daily_series?: VendorDailySalesPoint[];
    top_products?: VendorTopProductSales[];
    sources?: string[];
  };
}

/** AI-powered vendor sales analytics for the active store. */
export async function getVendorStoreAiSalesInsights(storeId: number, days = 30) {
  return customInstance<VendorAiSalesInsightsResponse>({
    url: `/vendor/stores/${storeId}/ai/sales-insights`,
    method: 'GET',
    params: { days }
  });
}
