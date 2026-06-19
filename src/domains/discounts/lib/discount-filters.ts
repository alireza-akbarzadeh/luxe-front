import type { DtoCouponListResponse } from '@/services/-admin-coupons-get.schemas';

export const COUPON_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Expired', value: 'expired' },
  { label: 'Exhausted', value: 'exhausted' }
] as const;

export type CouponStatusFilter = (typeof COUPON_STATUS_TABS)[number]['value'];

export function getCouponsFromListResponse(data: DtoCouponListResponse | undefined) {
  return data?.data?.coupons ?? [];
}

export function getCouponsTotalFromListResponse(data: DtoCouponListResponse | undefined) {
  return data?.data?.total ?? 0;
}
