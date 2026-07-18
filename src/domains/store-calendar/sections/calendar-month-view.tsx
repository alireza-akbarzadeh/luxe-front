import { Grid } from '@/components/ui/grid';
import { GridItem } from '@/components/ui/grid-item';
import { Typography } from '@/components/ui/typography';
import { buildMonthGrid, toISODate,WEEKDAY_LABELS } from '@/domains/store-calendar/lib/calendar-format';
import { CalendarDayCell } from '@/domains/store-calendar/sections/calendar-day-cell';
import type { CalendarDayEvent, CalendarQuickAction } from '@/domains/store-calendar/types/store-calendar.types';

interface CalendarMonthViewProps {
  year: number;
  month: number;
  selectedDate: string;
  eventsByDate: Map<string, CalendarDayEvent>;
  onSelect: (date: string) => void;
  onAction: (date: string, action: CalendarQuickAction) => void;
}

/** 7-column month grid (Sun–Sat) with full leading/trailing weeks from adjacent months. */
export function CalendarMonthView({
  year,
  month,
  selectedDate,
  eventsByDate,
  onSelect,
  onAction
}: CalendarMonthViewProps) {
  const weeks = buildMonthGrid(year, month);

  return (
    <div role='grid' aria-label='Month calendar'>
      <Grid cols={7} gap={1} className='mb-2'>
        {WEEKDAY_LABELS.map((label) => (
          <GridItem key={label} className='text-center'>
            <Typography.Muted className='text-xs font-medium uppercase tracking-wide'>
              {label}
            </Typography.Muted>
          </GridItem>
        ))}
      </Grid>

      <Grid cols={7} gap={1.5} role='rowgroup'>
        {weeks.flatMap((week) =>
          week.map((date) => {
            const iso = toISODate(date);
            return (
              <GridItem key={iso} role='gridcell'>
                <CalendarDayCell
                  date={date}
                  event={eventsByDate.get(iso)}
                  isSelected={iso === selectedDate}
                  isCurrentMonth={date.getMonth() === month - 1}
                  onSelect={onSelect}
                  onAction={onAction}
                />
              </GridItem>
            );
          })
        )}
      </Grid>
    </div>
  );
}
