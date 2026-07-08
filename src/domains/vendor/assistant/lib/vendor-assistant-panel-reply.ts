import { getVendorStoreAiCustomerSegments } from '@/lib/api/vendor-ai-customer-segments';
import { getVendorStoreAiDashboard } from '@/lib/api/vendor-ai-dashboard';
import { getVendorStoreAiInventoryForecast } from '@/lib/api/vendor-ai-inventory-forecast';
import { getVendorStoreAiPricingAssistant } from '@/lib/api/vendor-ai-pricing-assistant';
import { getVendorStoreAiSalesInsights } from '@/lib/api/vendor-ai-sales-insights';

import { formatInsightReply } from './format-vendor-ai-insight';

const PANEL_DAYS = 30;

function matchesIntent(text: string, keywords: string[]) {
  const lower = text.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

/** Routes vendor panel questions to the best existing store AI insight endpoint. */
export async function fetchVendorPanelInsight(storeId: number, text: string) {
  if (matchesIntent(text, ['pricing', 'price', 'margin', 'discount', 'fee'])) {
    const response = await getVendorStoreAiPricingAssistant(storeId, PANEL_DAYS);
    const data = response.data;
    return formatInsightReply({
      summary: data?.summary,
      highlights: data?.highlights,
      recommendations: data?.recommendations,
      warnings: data?.warnings
    });
  }

  if (matchesIntent(text, ['inventory', 'stock', 'forecast', 'replenish', 'reorder'])) {
    const response = await getVendorStoreAiInventoryForecast(storeId, PANEL_DAYS);
    const data = response.data;
    return formatInsightReply({
      summary: data?.summary,
      priorities: data?.priorities,
      recommendations: data?.recommendations,
      alerts: data?.alerts
    });
  }

  if (matchesIntent(text, ['sales', 'revenue', 'orders', 'trending', 'performance'])) {
    const response = await getVendorStoreAiSalesInsights(storeId, PANEL_DAYS);
    const data = response.data;
    return formatInsightReply({
      summary: data?.summary,
      highlights: data?.highlights,
      recommendations: data?.recommendations
    });
  }

  if (matchesIntent(text, ['customer', 'segment', 'retention', 'loyal', 'buyer'])) {
    const response = await getVendorStoreAiCustomerSegments(storeId, 365);
    const data = response.data;
    return formatInsightReply({
      summary: data?.summary,
      highlights: data?.highlights,
      recommendations: data?.recommendations ?? data?.campaign_ideas
    });
  }

  const response = await getVendorStoreAiDashboard(storeId);
  const data = response.data;
  return formatInsightReply({
    summary: data?.summary,
    priorities: data?.priorities,
    opportunities: data?.opportunities,
    alerts: data?.alerts
  });
}
