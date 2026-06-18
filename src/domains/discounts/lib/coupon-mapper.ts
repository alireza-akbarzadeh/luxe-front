import type { CouponFormValues } from '@/domains/discounts/discount.schema';
import type { ModelsCoupon } from '@/services/-coupons-{id}-get.schemas';

/** Normalizes API date strings for DatePicker fields. */
function toDateFieldValue(value?: string): string {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

/** Maps a coupon API record into admin form values for edit mode. */
export function mapCouponToFormValues(coupon: ModelsCoupon): CouponFormValues {
  const discountType = coupon.discount_type === 'fixed' ? 'fixed' : 'percentage';

  return {
    code: coupon.code ?? '',
    discount_type: discountType,
    discount_value: coupon.discount_value ?? 0,
    description: coupon.description ?? '',
    start_date: toDateFieldValue(coupon.start_date),
    end_date: toDateFieldValue(coupon.end_date),
    minimum_order_amount: coupon.minimum_order_amount ?? 0,
    max_discount_amount: coupon.max_discount_amount ?? undefined,
    usage_limit: coupon.usage_limit && coupon.usage_limit > 0 ? coupon.usage_limit : undefined,
    is_active: coupon.is_active ?? false
  };
}
