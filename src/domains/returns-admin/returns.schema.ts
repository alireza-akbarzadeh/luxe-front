export const RETURN_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Requested', value: 'requested' },
  { label: 'Approved', value: 'approved' },
  { label: 'Item received', value: 'item_received' },
  { label: 'Refund processing', value: 'refund_processing' },
  { label: 'Refunded', value: 'refunded' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Closed', value: 'closed' }
] as const;

export type ReturnStatusFilter = (typeof RETURN_STATUS_TABS)[number]['value'];

/** Statuses counted in the "needs action" KPI (open pipeline). */
export const RETURN_ACTION_STATUSES = ['requested', 'approved', 'item_received', 'refund_processing'] as const;
