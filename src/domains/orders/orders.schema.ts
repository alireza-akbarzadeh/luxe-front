export const ORDER_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Paid', value: 'paid' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Delayed', value: 'delayed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' }
] as const;

export type OrderStatusFilter = (typeof ORDER_STATUS_TABS)[number]['value'];

export const ORDER_BULK_ACTIONS = [
  { label: 'Mark as shipped', status: 'shipped' as const },
  { label: 'Mark as delivered', status: 'delivered' as const },
  { label: 'Cancel orders', status: 'cancelled' as const }
] as const;
