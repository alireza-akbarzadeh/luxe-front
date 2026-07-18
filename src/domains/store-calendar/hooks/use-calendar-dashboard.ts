import type { useCalendarFilters } from '@/domains/store-calendar/hooks/use-calendar-filters';
import {
  getCalendarEventsByDate,
  getStoresStatusFromResponse,
  getUpcomingEventsFromResponse
} from '@/domains/store-calendar/lib/calendar-list';
import { useGetAdminCalendarEvents } from '@/services/-admin-calendar-events-get';
import { useGetAdminCalendarStoresStatusToday } from '@/services/-admin-calendar-stores-status-today-get';
import { useGetAdminCalendarSummary } from '@/services/-admin-calendar-summary-get';
import { useGetAdminCalendarUpcomingEvents } from '@/services/-admin-calendar-upcoming-events-get';

/** Wires the calendar dashboard's KPI, event grid, upcoming-events, and store-status queries. */
export function useCalendarDashboard(filters: ReturnType<typeof useCalendarFilters>) {
  const summaryQuery = useGetAdminCalendarSummary();

  const eventsQuery = useGetAdminCalendarEvents({
    year: filters.year,
    month: filters.month,
    store_id: filters.storeId ?? undefined,
    region: filters.region ?? undefined,
    status: filters.status ?? undefined
  });

  const upcomingQuery = useGetAdminCalendarUpcomingEvents({ limit: 6 });
  const storesStatusQuery = useGetAdminCalendarStoresStatusToday();

  return {
    summary: summaryQuery.data?.data,
    isSummaryLoading: summaryQuery.isLoading,
    eventsByDate: getCalendarEventsByDate(eventsQuery.data),
    isEventsLoading: eventsQuery.isLoading,
    isEventsFetching: eventsQuery.isFetching,
    upcomingEvents: getUpcomingEventsFromResponse(upcomingQuery.data),
    isUpcomingLoading: upcomingQuery.isLoading,
    storesStatus: getStoresStatusFromResponse(storesStatusQuery.data),
    isStoresStatusLoading: storesStatusQuery.isLoading
  };
}
