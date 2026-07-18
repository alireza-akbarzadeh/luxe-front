import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek
} from 'date-fns';

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

/** Formats a Date as the `yyyy-MM-dd` key used by calendar API params and lookups. */
export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Builds a Date from a `year`/`month` (1-12) pair, defaulting to the 1st. */
export function monthToDate(year: number, month: number): Date {
  return new Date(year, month - 1, 1);
}

export function monthLabel(year: number, month: number): string {
  return format(monthToDate(year, month), 'MMMM yyyy');
}

/** Returns the previous/next `{ year, month }` pair, wrapping across year boundaries. */
export function shiftMonth(year: number, month: number, delta: number) {
  const shifted = addMonths(monthToDate(year, month), delta);
  return { year: shifted.getFullYear(), month: shifted.getMonth() + 1 };
}

/** Full weeks (Sun–Sat) covering the given month, for a 7-column grid. */
export function buildMonthGrid(year: number, month: number): Date[][] {
  const monthStart = startOfMonth(monthToDate(year, month));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
}

/** 7-day strip (Sun–Sat) for the week containing `date`. */
export function buildWeekStrip(date: Date): Date[] {
  return eachDayOfInterval({ start: startOfWeek(date), end: endOfWeek(date) });
}

export function shiftWeek(date: Date, delta: number): Date {
  return addWeeks(date, delta);
}
