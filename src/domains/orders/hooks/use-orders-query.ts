import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from 'nuqs';

import type {
  OrderStatusFilter,
  PaymentStatusFilter,
  ShipmentStatusFilter
} from '@/domains/orders/orders.schema';
import { PAYMENT_STATUS_FILTERS, SHIPMENT_STATUS_FILTERS } from '@/domains/orders/orders.schema';

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

const PAYMENT_VALUES = PAYMENT_STATUS_FILTERS.map((option) => option.value);
const SHIPMENT_VALUES = SHIPMENT_STATUS_FILTERS.map((option) => option.value);

export function useOrdersQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<OrderStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );
  const [paymentStatus, setPaymentStatus] = useQueryState(
    'payment',
    parseAsStringEnum<PaymentStatusFilter>([...PAYMENT_VALUES]).withDefault('all')
  );
  const [shipmentStatus, setShipmentStatus] = useQueryState(
    'shipment',
    parseAsStringEnum<ShipmentStatusFilter>([...SHIPMENT_VALUES]).withDefault('all')
  );
  const [tag, setTag] = useQueryState('tag', parseAsString.withDefault(''));
  const [fromDate, setFromDate] = useQueryState('from', parseAsString.withDefault(''));
  const [toDate, setToDate] = useQueryState('to', parseAsString.withDefault(''));
  const [minAmount, setMinAmount] = useQueryState('min', parseAsInteger);
  const [maxAmount, setMaxAmount] = useQueryState('max', parseAsInteger);

  const hasActiveFilters = Boolean(
    status !== 'all' ||
    paymentStatus !== 'all' ||
    shipmentStatus !== 'all' ||
    tag.trim() ||
    fromDate ||
    toDate ||
    minAmount != null ||
    maxAmount != null
  );

  const resetFilters = async () => {
    await setStatus('all');
    await setPaymentStatus('all');
    await setShipmentStatus('all');
    await setTag('');
    await setFromDate('');
    await setToDate('');
    await setMinAmount(null);
    await setMaxAmount(null);
  };

  return {
    status,
    setStatus,
    paymentStatus,
    setPaymentStatus,
    shipmentStatus,
    setShipmentStatus,
    tag,
    setTag,
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
