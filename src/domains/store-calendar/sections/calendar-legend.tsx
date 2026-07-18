import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { CALENDAR_LEGEND } from '@/domains/store-calendar/lib/calendar-day-styles';
import { cn } from '@/lib/utils';

/** Color legend for the day-type badges shown across month/week/list views. */
export function CalendarLegend() {
  return (
    <Flex direction='row' wrap='wrap' align='center' spacing={4} className='py-1'>
      {CALENDAR_LEGEND.map((style) => (
        <Flex key={style.key} direction='row' align='center' spacing={2}>
          <span className={cn('size-2.5 rounded-full', style.dot)} aria-hidden />
          <Typography.Muted className='text-xs'>{style.label}</Typography.Muted>
        </Flex>
      ))}
    </Flex>
  );
}
