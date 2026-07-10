import { parseAsStringEnum, useQueryState } from 'nuqs';

import type { VendorStatusFilter } from '@/domains/vendors-admin/schemas/vendors.schema';
import { VENDOR_STATUS_TABS } from '@/domains/vendors-admin/schemas/vendors.schema';

const STATUS_VALUES = VENDOR_STATUS_TABS.map((tab) => tab.value);

/** URL-synced status filter for the admin vendors table. */
export function useVendorsQueryState() {
  const [status, setStatus] = useQueryState(
    'status',
    parseAsStringEnum<VendorStatusFilter>([...STATUS_VALUES]).withDefault('all')
  );

  return { status, setStatus };
}
