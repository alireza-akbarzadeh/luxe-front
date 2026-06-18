export const SHIPMENT_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Returned', value: 'returned' }
] as const;

export type ShipmentStatusFilter = (typeof SHIPMENT_STATUS_TABS)[number]['value'];

/** Statuses counted in the "in transit" KPI pipeline. */
export const SHIPMENT_IN_TRANSIT_STATUSES = ['processing', 'shipped'] as const;
