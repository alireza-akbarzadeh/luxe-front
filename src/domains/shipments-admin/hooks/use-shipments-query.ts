import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { ShipmentStatusFilter } from '@/domains/shipments-admin/shipments.schema';

const STATUS_VALUES = [
  'all',
  'pending',
  'processing',
  'shipped',
  'delivered',
  'returned'
] as const;

export function useShipmentsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<ShipmentStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );

  return { status, setStatus };
}
