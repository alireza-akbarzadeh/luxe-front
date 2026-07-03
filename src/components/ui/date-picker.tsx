import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { type ComponentPropsWithRef, useEffect, useState } from 'react';
import type { PropsBase, PropsSingle } from 'react-day-picker';
import type { Except, Simplify } from 'type-fest';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { Button } from './button';
import { Calendar, type CalendarBaseProps } from './calendar';

type CalendarProps = Simplify<
  Except<PropsBase & PropsSingle, 'mode'> &
    CalendarBaseProps & {
      selected?: Date;
      onSelect?: (date: Date) => void;
      defaultSelected?: Date;
    }
>;

export type DatePickerProps = ComponentPropsWithRef<typeof Button> & {
  calendar?: CalendarProps;
};

function DatePicker({ calendar, className, ...props }: DatePickerProps) {
  const isControlled = calendar?.selected !== undefined;
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    calendar?.defaultSelected ?? new Date()
  );

  useEffect(() => {
    if (!isControlled && calendar?.defaultSelected) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInternalDate(calendar.defaultSelected);
    }
  }, [isControlled, calendar?.defaultSelected]);

  const date = isControlled ? calendar.selected : internalDate;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (isControlled) {
      calendar.onSelect?.(selectedDate);
    } else {
      setInternalDate(selectedDate);
      calendar?.onSelect?.(selectedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'border-border/80 bg-background/90 w-full justify-start gap-2 rounded-xl text-left font-normal shadow-sm transition-colors',
            'hover:border-accent/45 hover:bg-muted/50',
            date && 'text-foreground',
            !date && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <IconCalendar
            className={cn('size-4 shrink-0', date ? 'text-accent' : 'text-muted-foreground')}
          />
          <span>{date ? format(date, 'PPP') : 'Pick a date'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='border-border/80 bg-popover dark:border-border/60 w-auto overflow-hidden rounded-2xl border p-0 shadow-xl dark:shadow-black/40'
      >
        <div
          aria-hidden
          className='via-accent/50 pointer-events-none h-px bg-gradient-to-r from-transparent to-transparent'
        />
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateSelect}
          autoFocus
          className='p-3'
          {...calendar}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
