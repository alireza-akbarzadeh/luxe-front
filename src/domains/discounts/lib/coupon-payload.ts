import type { CouponFormValues } from '@/domains/discounts/discount.schema';
import { couponCustomerSegmentAny } from '@/domains/discounts/discount.schema';
import type {
  DtoCouponConditionsRequest,
  DtoCreateCouponRequest
} from '@/services/-coupons-post.schemas';

function parseIdList(value?: string | string[]): number[] | undefined {
  if (!value) return undefined;

  const parts = Array.isArray(value)
    ? value
    : value
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);

  const ids = parts.map((part) => Number(part)).filter((id) => Number.isFinite(id) && id > 0);

  return ids.length > 0 ? ids : undefined;
}

function buildConditionsPayload(
  conditions: CouponFormValues['conditions']
): DtoCouponConditionsRequest | undefined {
  const payload: DtoCouponConditionsRequest = {
    first_order_only: conditions.first_order_only || undefined,
    min_item_quantity: conditions.min_item_quantity,
    customer_segment:
      conditions.customer_segment && conditions.customer_segment !== couponCustomerSegmentAny
        ? conditions.customer_segment
        : undefined,
    category_ids: parseIdList(conditions.category_ids),
    product_ids: parseIdList(conditions.product_ids),
    user_ids: parseIdList(conditions.user_ids)
  };

  const hasRules =
    payload.first_order_only ||
    payload.min_item_quantity ||
    payload.customer_segment ||
    (payload.category_ids?.length ?? 0) > 0 ||
    (payload.product_ids?.length ?? 0) > 0 ||
    (payload.user_ids?.length ?? 0) > 0;

  return hasRules ? payload : undefined;
}

/** Maps admin form values to create/update coupon API payload. */
export function mapCouponFormToPayload(value: CouponFormValues): DtoCreateCouponRequest {
  const payload: DtoCreateCouponRequest = {
    application_type: value.application_type,
    discount_type: value.discount_type,
    discount_value: Number(value.discount_value),
    description: value.description || undefined,
    start_date: value.start_date || '',
    end_date: value.end_date || '',
    minimum_order_amount: value.minimum_order_amount
      ? Number(value.minimum_order_amount)
      : undefined,
    max_discount_amount: value.max_discount_amount ? Number(value.max_discount_amount) : undefined,
    usage_limit: value.usage_limit ? Number(value.usage_limit) : undefined,
    is_active: value.is_active,
    conditions: buildConditionsPayload(value.conditions)
  };

  if (value.application_type === 'code') {
    payload.code = value.code.toUpperCase();
  } else if (value.code.trim()) {
    payload.code = value.code.toUpperCase();
  }

  if (value.application_type === 'bogo') {
    payload.bogo_buy_quantity = value.bogo_buy_quantity ?? 1;
    payload.bogo_get_quantity = value.bogo_get_quantity ?? 1;
    payload.bogo_get_discount_percent = value.bogo_get_discount_percent ?? 100;
    payload.discount_type = 'percentage';
    payload.discount_value = value.bogo_get_discount_percent ?? 100;
  }

  return payload;
}
