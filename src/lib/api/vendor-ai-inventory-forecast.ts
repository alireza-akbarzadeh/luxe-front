import { customInstance } from '@/lib/api/api-client';

export interface VendorInventoryForecastItem {
  product_id?: number;
  name?: string;
  stock?: number;
  units_sold?: number;
  daily_velocity?: number;
  days_until_stockout?: number;
  suggested_reorder_qty?: number;
  urgency?: string;
}

export interface VendorAiInventoryForecastResponse {
  data?: {
    ai_enabled?: boolean;
    period_days?: number;
    summary?: string;
    priorities?: string[];
    recommendations?: string[];
    alerts?: string[];
    low_stock_count?: number;
    critical_count?: number;
    warning_count?: number;
    forecasts?: VendorInventoryForecastItem[];
    sources?: string[];
  };
}

/** AI-powered inventory forecast for the active vendor store. */
export async function getVendorStoreAiInventoryForecast(storeId: number, days = 30) {
  return customInstance<VendorAiInventoryForecastResponse>({
    url: `/vendor/stores/${storeId}/ai/inventory-forecast`,
    method: 'GET',
    params: { days }
  });
}
