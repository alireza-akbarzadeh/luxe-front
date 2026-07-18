import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { buildWeekStrip, monthToDate, toISODate } from '@/domains/store-calendar/lib/calendar-format';
import { CalendarDayCell } from '@/domains/store-calendar/sections/calendar-day-cell';
import type { CalendarDayEvent, CalendarQuickAction } from '@/domains/store-calendar/types/store-calendar.types';

interface CalendarWeekViewProps {
  year: number;
  month: number;
  selectedDate: string;
  eventsByDate: Map<string, CalendarDayEvent>;
  onSelect: (date: string) => void;
  onAction: (date: string, action: CalendarQuickAction) => void;
}

/** 7-day strip for the week containing the currently selected date. */
export function CalendarWeekView({
  year,
  month,
  selectedDate,
  eventsByDate,
  onSelect,
  onAction
}: CalendarWeekViewProps) {
  const anchor = selectedDate ? new Date(`${selectedDate}T00:00:00`) : monthToDate(year, month);
  const days = buildWeekStrip(anchor);

  return (
    <Grid cols={7} gap={2} role='grid' aria-label='Week calendar'>
      {days.map((date) => {
        const iso = toISODate(date);
        return (
          <GridItem key={iso} role='gridcell'>
            <CalendarDayCell
              date={date}
              event={eventsByDate.get(iso)}
              isSelected={iso === selectedDate}
              compact={false}
              onSelect={onSelect}
              onAction={onAction}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
}
