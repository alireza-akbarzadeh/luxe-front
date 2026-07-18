import { format } from 'date-fns';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { getDayTypeStyle } from '@/domains/store-calendar/lib/calendar-day-styles';
import { toISODate } from '@/domains/store-calendar/lib/calendar-format';
import { CalendarDayContextMenu } from '@/domains/store-calendar/sections/calendar-day-context-menu';
import type { CalendarDayEvent, CalendarQuickAction } from '@/domains/store-calendar/types/store-calendar.types';
import { cn } from '@/lib/utils';

interface CalendarDayCellProps {
  date: Date;
  event: CalendarDayEvent | undefined;
  isSelected: boolean;
  isCurrentMonth?: boolean;
  compact?: boolean;
  onSelect: (date: string) => void;
  onAction: (date: string, action: CalendarQuickAction) => void;
}

/** Single day cell used by the month grid and week strip — click selects, right-click opens quick actions. */
export function CalendarDayCell({
  date,
  event,
  isSelected,
  isCurrentMonth = true,
  compact = true,
  onSelect,
  onAction
}: CalendarDayCellProps) {
  const iso = toISODate(date);
  const isToday = iso === toISODate(new Date());
  const style = getDayTypeStyle(event?.dayType);
  const holidayCount = event?.holidayIds.length ?? 0;

  const ariaLabel = [
    format(date, 'EEEE, MMMM d, yyyy'),
    style.label,
    holidayCount > 0 ? `${holidayCount} holiday${holidayCount > 1 ? 's' : ''}` : undefined
  ]
    .filter(Boolean)
    .join(' — ');

  return (
    <CalendarDayContextMenu date={iso} onAction={onAction}>
      <button
        aria-label={ariaLabel}
        aria-pressed={isSelected}
        className={cn(
          'group relative flex w-full flex-col rounded-lg border p-2 text-left transition-colors',
          'hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          compact ? 'h-20 sm:h-24' : 'h-28 sm:h-32',
          isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border bg-card',
          !isCurrentMonth && 'opacity-40'
        )}
        type='button'
        onClick={() => onSelect(iso)}
      >
        <Flex align='center' className='w-full' direction='row' justify='between'>
          <Typography.Text
            className={cn('text-sm', isToday ? 'font-semibold text-primary' : 'font-medium text-foreground')}
          >
            {format(date, 'd')}
          </Typography.Text>
          {isToday && <span aria-hidden className='size-1.5 rounded-full bg-primary' />}
        </Flex>

        {event?.dayType ? (
          <Flex align='center' className='mt-auto' direction='row' spacing={1}>
            <span aria-hidden className={cn('size-1.5 rounded-full', style.dot)} />
            <Typography.Muted className='truncate text-[11px]'>{style.label}</Typography.Muted>
            {holidayCount > 1 && (
              <Typography.Muted className='text-[11px]'>+{holidayCount - 1}</Typography.Muted>
            )}
          </Flex>
        ) : null}
      </button>
    </CalendarDayContextMenu>
  );
}
