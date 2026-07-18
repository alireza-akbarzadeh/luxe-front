import { useQueryClient } from '@tanstack/react-query';

import { getGetAdminCalendarDayDateQueryKey } from '@/services/-admin-calendar-day-{date}-get';
import { getGetAdminCalendarEventsQueryKey } from '@/services/-admin-calendar-events-get';
import { getGetAdminCalendarHolidaysQueryKey } from '@/services/-admin-calendar-holidays-get';
import { getGetAdminCalendarStoresStatusTodayQueryKey } from '@/services/-admin-calendar-stores-status-today-get';
import { getGetAdminCalendarSummaryQueryKey } from '@/services/-admin-calendar-summary-get';
import { getGetAdminCalendarUpcomingEventsQueryKey } from '@/services/-admin-calendar-upcoming-events-get';

/** Invalidates every calendar query affected by a holiday/off-day/schedule mutation. */
export function useInvalidateCalendar() {
  const queryClient = useQueryClient();

  return (date?: string) => {
    void queryClient.invalidateQueries({ queryKey: getGetAdminCalendarSummaryQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminCalendarEventsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminCalendarHolidaysQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminCalendarUpcomingEventsQueryKey() });
    void queryClient.invalidateQueries({ queryKey: getGetAdminCalendarStoresStatusTodayQueryKey() });
    if (date) {
      void queryClient.invalidateQueries({ queryKey: getGetAdminCalendarDayDateQueryKey(date) });
    }
  };
}
