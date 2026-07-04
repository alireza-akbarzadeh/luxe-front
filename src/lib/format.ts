import type { ModelsCoupon } from '@/services/-coupons-validate-post.schemas';

export const formatCurrency = (amount: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

export const fmtChartDigit = (n: number) =>
  `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;

export function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '…' : str;
}

export function formatDiscountLabel(coupon: ModelsCoupon) {
  if (coupon.discount_type === 'percentage') {
    return `${coupon.discount_value}% off`;
  }
  return `$${coupon.discount_value} off`;
}
