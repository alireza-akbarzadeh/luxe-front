/** Calendar view modes for the dashboard grid. */
export type CalendarViewMode = 'month' | 'week' | 'list';

/**
 * Day classification returned by the backend `day_type` field.
 * Unknown/missing values fall back to a neutral style in `calendar-day-styles.ts`.
 */
export type CalendarDayType =
  | 'working'
  | 'weekend'
  | 'holiday'
  | 'vendor_closed'
  | 'special_working'
  | 'special'
  | 'maintenance';

export interface CalendarDayEvent {
  date: string;
  dayType: string | undefined;
  badges: string[];
  holidayIds: number[];
  offDayIds: number[];
}

/** Quick actions available from the day context menu / drawer. */
export type CalendarQuickAction =
  | 'add-holiday'
  | 'vendor-closed'
  | 'special-working'
  | 'maintenance'
  | 'view-details';
