import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';

import type { OrderStatusFilter } from '@/domains/orders/orders.schema';

const STATUS_VALUES = [
  'all',
  'pending',
  'paid',
  'shipped',
  'delivered',
  'delayed',
  'cancelled',
  'refunded'
] as const;

export function useOrdersQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<OrderStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );
  const [fromDate, setFromDate] = useQueryState('from', parseAsString.withDefault(''));
  const [toDate, setToDate] = useQueryState('to', parseAsString.withDefault(''));
  const [minAmount, setMinAmount] = useQueryState('min', parseAsInteger);
  const [maxAmount, setMaxAmount] = useQueryState('max', parseAsInteger);

  const hasActiveFilters = Boolean(
    status !== 'all' || fromDate || toDate || minAmount != null || maxAmount != null
  );

  const resetFilters = async () => {
    await setStatus('all');
    await setFromDate('');
    await setToDate('');
    await setMinAmount(null);
    await setMaxAmount(null);
  };

  return {
    status,
    setStatus,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    minAmount,
    setMinAmount,
    maxAmount,
    setMaxAmount,
    hasActiveFilters,
    resetFilters
  };
}
