import {
  format,
  formatDistance,
  formatDistanceToNow,
  formatRelative,
  isToday,
  isYesterday,
  isThisWeek,
  isPast,
  isFuture,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameYear
} from 'date-fns';

// -------------------------------
// 1. Formatting (already provided)
// -------------------------------
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'PPP',
  EUROPEAN: 'dd/MM/yyyy',
  ISO: 'yyyy-MM-dd',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  TIME_ONLY: 'h:mm a',
  MONTH_YEAR: 'MMMM yyyy'
} as const;

export function formatDate(
  date: Date | string | number | null | undefined,
  formatStr: string = DATE_FORMATS.SHORT
): string {
  if (!date) return '';
  try {
    return format(new Date(date), formatStr);
  } catch {
    return '';
  }
}

// -------------------------------
// 2. Relative time (human friendly)
// -------------------------------
/**
 * Returns a human‑readable relative time from now (e.g., "2 days ago", "in 3 hours").
 * @param date - past or future date
 * @param addSuffix - include "ago" or "in" (default true)
 */
export function timeFromNow(date: Date | string | number, addSuffix: boolean = true): string {
  return formatDistanceToNow(new Date(date), { addSuffix });
}

/**
 * Returns relative time between two dates (e.g., "3 days", "2 hours").
 * @param date - first date
 * @param baseDate - second date (default now)
 * @param includeSeconds - show seconds if less than a minute
 */
export function timeBetween(
  date: Date | string | number,
  baseDate: Date | string | number = new Date(),
  includeSeconds: boolean = false
): string {
  return formatDistance(new Date(date), new Date(baseDate), { includeSeconds });
}

// -------------------------------
// 3. Date checks (boolean)
// -------------------------------
export function isDateToday(date: Date | string | number): boolean {
  return isToday(new Date(date));
}

export function isDateYesterday(date: Date | string | number): boolean {
  return isYesterday(new Date(date));
}

export function isDateThisWeek(date: Date | string | number): boolean {
  return isThisWeek(new Date(date));
}

export function isDatePast(date: Date | string | number): boolean {
  return isPast(new Date(date));
}

export function isDateFuture(date: Date | string | number): boolean {
  return isFuture(new Date(date));
}

// -------------------------------
// 4. Comparisons
// -------------------------------
export function isSameDayDate(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return isSameDay(new Date(date1), new Date(date2));
}

export function isSameWeekDate(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return isSameWeek(new Date(date1), new Date(date2));
}

export function isSameMonthDate(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return isSameMonth(new Date(date1), new Date(date2));
}

export function isSameYearDate(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return isSameYear(new Date(date1), new Date(date2));
}

// -------------------------------
// 5. Differences (raw numbers)
// -------------------------------
export function daysDifference(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  return differenceInDays(new Date(date1), new Date(date2));
}

export function hoursDifference(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  return differenceInHours(new Date(date1), new Date(date2));
}

export function minutesDifference(
  date1: Date | string | number,
  date2: Date | string | number
): number {
  return differenceInMinutes(new Date(date1), new Date(date2));
}

// -------------------------------
// 6. Smart relative display (e.g., "Today", "Yesterday", "This week", then full date)
// -------------------------------
/**
 * Returns a smart relative label:
 * - "Today", "Yesterday" if within 2 days
 * - "This week" + weekday name if within current week
 * - otherwise formatted date (DATE_FORMATS.SHORT)
 */
export function getSmartRelativeDate(
  date: Date | string | number,
  fallbackFormat: string = DATE_FORMATS.SHORT
): string {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  if (isThisWeek(d)) return `This week, ${format(d, 'EEEE')}`;
  return formatDate(d, fallbackFormat);
}

// -------------------------------
// 7. Format relative (like "last Tuesday", "tomorrow at 5pm")
// -------------------------------
/**
 * Uses date-fns formatRelative for a more conversational relative string.
 * Example: "last Tuesday at 2:30 PM", "tomorrow at 12:00 AM".
 */
export function formatRelativeDate(
  date: Date | string | number,
  baseDate: Date | string | number = new Date()
): string {
  return formatRelative(new Date(date), new Date(baseDate));
}
