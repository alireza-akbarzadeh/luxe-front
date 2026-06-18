import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { ReturnStatusFilter } from '@/domains/returns-admin/returns.schema';

const STATUS_VALUES = [
  'all',
  'requested',
  'approved',
  'item_received',
  'refund_processing',
  'refunded',
  'rejected',
  'closed'
] as const;

export function useReturnsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<ReturnStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );

  return { status, setStatus };
}
