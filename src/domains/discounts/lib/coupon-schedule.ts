import { DATE_FORMATS, formatDate } from '@/lib/date';

export type CouponScheduleStatus = 'scheduled' | 'active' | 'expired' | 'open';

/** Derives a simple schedule status from coupon start/end dates. */
export function getCouponScheduleStatus(
  startDate?: string,
  endDate?: string,
  now = new Date()
): CouponScheduleStatus {
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  if (start && !Number.isNaN(start.getTime()) && start > now) {
    return 'scheduled';
  }
  if (end && !Number.isNaN(end.getTime()) && end < now) {
    return 'expired';
  }
  if (start || end) {
    return 'active';
  }
  return 'open';
}

/** Short label for admin table schedule column. */
export function formatCouponScheduleLabel(startDate?: string, endDate?: string): string {
  const status = getCouponScheduleStatus(startDate, endDate);
  if (status === 'open') return 'No end date';
  if (status === 'scheduled' && startDate) {
    return `Starts ${formatDate(startDate, DATE_FORMATS.SHORT)}`;
  }
  if (status === 'expired' && endDate) {
    return `Ended ${formatDate(endDate, DATE_FORMATS.SHORT)}`;
  }
  if (startDate && endDate) {
    return `${formatDate(startDate, DATE_FORMATS.SHORT)} → ${formatDate(endDate, DATE_FORMATS.SHORT)}`;
  }
  if (endDate) {
    return `Until ${formatDate(endDate, DATE_FORMATS.SHORT)}`;
  }
  return 'Active now';
}
