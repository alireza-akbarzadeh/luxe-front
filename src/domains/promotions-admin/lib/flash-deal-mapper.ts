import type { FlashDealFormValues } from '@/domains/promotions-admin/schemas/promotions.schema';
import type { ModelsFlashDeal } from '@/services/-admin-flash-deals-get.schemas';
import type { DtoCreateFlashDealRequest } from '@/services/-admin-flash-deals-post.schemas';

function toDateFieldValue(value?: string): string {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

export function mapFlashDealToFormValues(deal: ModelsFlashDeal): FlashDealFormValues {
  return {
    product_id: deal.product_id ?? 0,
    title: deal.title ?? '',
    starts_at: toDateFieldValue(deal.starts_at),
    ends_at: toDateFieldValue(deal.ends_at),
    quantity_limit: deal.quantity_limit ?? undefined,
    sort_order: deal.sort_order ?? 0,
    status: deal.status === 'active' || deal.status === 'ended' ? deal.status : 'draft'
  };
}

export function mapFlashDealFormToPayload(value: FlashDealFormValues): DtoCreateFlashDealRequest {
  return {
    product_id: value.product_id,
    title: value.title || undefined,
    starts_at: value.starts_at || undefined,
    ends_at: value.ends_at,
    quantity_limit: value.quantity_limit,
    sort_order: value.sort_order,
    status: value.status
  };
}
