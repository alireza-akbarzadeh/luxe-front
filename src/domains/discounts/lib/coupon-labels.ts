import type { ModelsCouponApplicationType } from '@/services/-admin-coupons-get.schemas';

const APPLICATION_LABELS: Record<ModelsCouponApplicationType, string> = {
  code: 'Coupon code',
  automatic: 'Automatic',
  bogo: 'BOGO'
};

/** Human-readable label for promotion application type. */
export function formatApplicationTypeLabel(
  applicationType?: ModelsCouponApplicationType | string
): string {
  if (!applicationType) return 'Coupon code';
  return APPLICATION_LABELS[applicationType as ModelsCouponApplicationType] ?? applicationType;
}
