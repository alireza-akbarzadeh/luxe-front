export type CustomerSegment = '' | 'vip' | 'loyal' | 'new' | 'at_risk';

export const CUSTOMER_SEGMENT_OPTIONS: Array<{
  id: CustomerSegment;
  label: string;
  className?: string;
}> = [
  { id: '', label: 'All segments' },
  { id: 'vip', label: 'VIP', className: 'text-amber-600' },
  { id: 'loyal', label: 'Loyal', className: 'text-emerald-600' },
  { id: 'new', label: 'New', className: 'text-sky-600' },
  { id: 'at_risk', label: 'At risk', className: 'text-rose-600' }
];

export function customerSegmentLabel(segment?: string) {
  return CUSTOMER_SEGMENT_OPTIONS.find((option) => option.id === segment)?.label ?? 'Unassigned';
}
