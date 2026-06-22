export const REVIEW_STATUS_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' }
] as const;

export type ReviewStatusFilter = (typeof REVIEW_STATUS_TABS)[number]['value'];
