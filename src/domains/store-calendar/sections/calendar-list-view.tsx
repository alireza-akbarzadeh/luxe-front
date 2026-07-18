import { format } from 'date-fns';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { getDayTypeStyle } from '@/domains/store-calendar/lib/calendar-day-styles';
import type { CalendarDayEvent } from '@/domains/store-calendar/types/store-calendar.types';
import { cn } from '@/lib/utils';

interface CalendarListViewProps {
  eventsByDate: Map<string, CalendarDayEvent>;
  selectedDate: string;
  onSelect: (date: string) => void;
}

/** Flat list of the month's day-type events, sorted chronologically. */
export function CalendarListView({ eventsByDate, selectedDate, onSelect }: CalendarListViewProps) {
  const entries = Array.from(eventsByDate.values())
    .filter((event) => event.dayType && event.dayType !== 'working')
    .sort((a, b) => a.date.localeCompare(b.date));

  if (entries.length === 0) {
    return (
      <Flex align='center' justify='center' className='h-40 rounded-lg border border-dashed'>
        <Typography.Muted>No special days or holidays this month</Typography.Muted>
      </Flex>
    );
  }

  return (
    <Flex direction='column' spacing={2}>
      {entries.map((event) => {
        const style = getDayTypeStyle(event.dayType);
        const date = new Date(`${event.date}T00:00:00`);
        return (
          <button
            key={event.date}
            type='button'
            onClick={() => onSelect(event.date)}
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors',
              'hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
              event.date === selectedDate ? 'border-primary bg-primary/5' : 'border-border bg-card'
            )}
          >
            <Flex direction='row' align='center' spacing={3}>
              <span aria-hidden className={cn('size-2.5 rounded-full', style.dot)} />
              <Flex direction='column'>
                <Typography.Text className='text-sm font-medium'>
                  {format(date, 'EEEE, MMM d')}
                </Typography.Text>
                <Typography.Muted className='text-xs'>{style.label}</Typography.Muted>
              </Flex>
            </Flex>
            {event.holidayIds.length > 0 && (
              <Typography.Muted className='text-xs'>
                {event.holidayIds.length} holiday{event.holidayIds.length > 1 ? 's' : ''}
              </Typography.Muted>
            )}
          </button>
        );
      })}
    </Flex>
  );
}
