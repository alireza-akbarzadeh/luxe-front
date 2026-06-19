import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { CouponStatusFilter } from '@/domains/discounts/lib/discount-filters';
import { COUPON_STATUS_TABS } from '@/domains/discounts/lib/discount-filters';

const STATUS_VALUES = COUPON_STATUS_TABS.map((tab) => tab.value);

export function useDiscountsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<CouponStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );

  return { status, setStatus };
}
