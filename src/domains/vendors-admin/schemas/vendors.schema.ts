export const VENDOR_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Active', value: 'active' },
  { label: 'Suspended', value: 'suspended' }
] as const;

export type VendorStatusFilter = (typeof VENDOR_STATUS_TABS)[number]['value'];
