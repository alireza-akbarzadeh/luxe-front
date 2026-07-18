'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarLegend } from '@/domains/store-calendar/sections/calendar-legend';
import { CalendarListView } from '@/domains/store-calendar/sections/calendar-list-view';
import { CalendarMonthView } from '@/domains/store-calendar/sections/calendar-month-view';
import { CalendarWeekView } from '@/domains/store-calendar/sections/calendar-week-view';
import { useStoreCalendarStore } from '@/domains/store-calendar/stores/store-calendar-store';
import type { CalendarDayEvent, CalendarQuickAction, CalendarViewMode } from '@/domains/store-calendar/types/store-calendar.types';

interface CalendarMonthGridProps {
  year: number;
  month: number;
  eventsByDate: Map<string, CalendarDayEvent>;
  onAction: (date: string, action: CalendarQuickAction) => void;
}

/** Month/Week/List tab switcher with legend, delegating rendering to the per-view components. */
export function CalendarMonthGrid({ year, month, eventsByDate, onAction }: CalendarMonthGridProps) {
  const viewMode = useStoreCalendarStore((state) => state.viewMode);
  const setViewMode = useStoreCalendarStore((state) => state.setViewMode);
  const selectedDate = useStoreCalendarStore((state) => state.selectedDate);
  const openDrawer = useStoreCalendarStore((state) => state.openDrawer);

  const handleSelect = (date: string) => openDrawer(date);

  return (
    <Card>
      <CardHeader>
        <Flex direction='row' align='center' justify='between' wrap='wrap' spacing={3}>
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as CalendarViewMode)}>
            <TabsList>
              <TabsTrigger value='month'>Month</TabsTrigger>
              <TabsTrigger value='week'>Week</TabsTrigger>
              <TabsTrigger value='list'>List</TabsTrigger>
            </TabsList>
          </Tabs>
          <CalendarLegend />
        </Flex>
      </CardHeader>
      <CardContent>
        {viewMode === 'month' && (
          <CalendarMonthView
            year={year}
            month={month}
            selectedDate={selectedDate}
            eventsByDate={eventsByDate}
            onSelect={handleSelect}
            onAction={onAction}
          />
        )}
        {viewMode === 'week' && (
          <CalendarWeekView
            year={year}
            month={month}
            selectedDate={selectedDate}
            eventsByDate={eventsByDate}
            onSelect={handleSelect}
            onAction={onAction}
          />
        )}
        {viewMode === 'list' && (
          <CalendarListView eventsByDate={eventsByDate} selectedDate={selectedDate} onSelect={handleSelect} />
        )}
      </CardContent>
    </Card>
  );
}
