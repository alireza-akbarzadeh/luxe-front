import type { CalendarDayEvent } from '@/domains/store-calendar/types/store-calendar.types';
import type { DtoListCalendarEventsResponse } from '@/services/-admin-calendar-events-get.schemas';
import type { DtoStoreHolidayListResponse } from '@/services/-admin-calendar-holidays-get.schemas';
import type { DtoListStoreWorkingSchedulesResponse } from '@/services/-admin-calendar-schedules-get.schemas';
import type { DtoListStoresStatusTodayResponse } from '@/services/-admin-calendar-stores-status-today-get.schemas';
import type { DtoListUpcomingEventsResponse } from '@/services/-admin-calendar-upcoming-events-get.schemas';

/** Normalizes `/admin/calendar/events` rows and keys them by ISO date. */
export function getCalendarEventsByDate(
  data: DtoListCalendarEventsResponse | undefined
): Map<string, CalendarDayEvent> {
  const map = new Map<string, CalendarDayEvent>();
  for (const event of data?.data ?? []) {
    if (!event.date) continue;
    map.set(event.date, {
      date: event.date,
      dayType: event.day_type,
      badges: event.badges ?? [],
      holidayIds: event.holiday_ids ?? [],
      offDayIds: event.off_day_ids ?? []
    });
  }
  return map;
}

export function getUpcomingEventsFromResponse(data: DtoListUpcomingEventsResponse | undefined) {
  return data?.data ?? [];
}

export function getStoresStatusFromResponse(data: DtoListStoresStatusTodayResponse | undefined) {
  return data?.data ?? [];
}

export function getSchedulesFromResponse(data: DtoListStoreWorkingSchedulesResponse | undefined) {
  return data?.data ?? [];
}

export function getHolidaysFromListResponse(data: DtoStoreHolidayListResponse | undefined) {
  return data?.data?.holidays ?? [];
}

export function getHolidaysTotalFromListResponse(data: DtoStoreHolidayListResponse | undefined) {
  return data?.data?.total;
}
