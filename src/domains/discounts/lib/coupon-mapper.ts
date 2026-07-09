import type { CouponFormValues } from '@/domains/discounts/discount.schema';
import { couponCustomerSegmentAny } from '@/domains/discounts/discount.schema';
import type { ModelsCoupon } from '@/services/-coupons-{id}-get.schemas';
import type { DtoCouponConditionsRequest } from '@/services/-coupons-post.schemas';

/** Normalizes API date strings for DatePicker fields. */
function toDateFieldValue(value?: string): string {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

function parseConditionsFromApi(raw: unknown): CouponFormValues['conditions'] {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return {
      first_order_only: false,
      min_item_quantity: undefined,
      customer_segment: couponCustomerSegmentAny,
      category_ids: '',
      product_ids: ''
    };
  }

  const conditions = raw as DtoCouponConditionsRequest;
  return {
    first_order_only: conditions.first_order_only ?? false,
    min_item_quantity: conditions.min_item_quantity,
    customer_segment: conditions.customer_segment ?? couponCustomerSegmentAny,
    category_ids: conditions.category_ids?.join(', ') ?? '',
    product_ids: conditions.product_ids?.join(', ') ?? ''
  };
}

/** Maps a coupon API record into admin form values for edit mode. */
export function mapCouponToFormValues(coupon: ModelsCoupon): CouponFormValues {
  const discountType = coupon.discount_type === 'fixed' ? 'fixed' : 'percentage';
  const applicationType =
    coupon.application_type === 'automatic' || coupon.application_type === 'bogo'
      ? coupon.application_type
      : 'code';

  return {
    code: coupon.code ?? '',
    application_type: applicationType,
    discount_type: discountType,
    discount_value: coupon.discount_value ?? 0,
    description: coupon.description ?? '',
    start_date: toDateFieldValue(coupon.start_date),
    end_date: toDateFieldValue(coupon.end_date),
    minimum_order_amount: coupon.minimum_order_amount ?? 0,
    max_discount_amount: coupon.max_discount_amount ?? undefined,
    usage_limit: coupon.usage_limit && coupon.usage_limit > 0 ? coupon.usage_limit : undefined,
    is_active: coupon.is_active ?? false,
    conditions: parseConditionsFromApi(coupon.conditions),
    bogo_buy_quantity: coupon.bogo_buy_quantity ?? 1,
    bogo_get_quantity: coupon.bogo_get_quantity ?? 1,
    bogo_get_discount_percent: coupon.bogo_get_discount_percent ?? 100
  };
}
