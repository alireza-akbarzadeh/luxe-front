import { IconCalendar } from '@tabler/icons-react';
import { format } from 'date-fns';
import { type ComponentPropsWithRef,useEffect, useState } from 'react';
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
  // Determine if we're in controlled mode
  const isControlled = calendar?.selected !== undefined;
  // Internal state for uncontrolled mode
  const [internalDate, setInternalDate] = useState<Date | undefined>(
    calendar?.defaultSelected ?? new Date()
  );

  // Sync internal state when defaultSelected changes (uncontrolled)
  useEffect(() => {
    if (!isControlled && calendar?.defaultSelected) {
      setInternalDate(calendar.defaultSelected);
    }
  }, [isControlled, calendar?.defaultSelected]);

  // The actual date to display
  const date = isControlled ? calendar.selected : internalDate;

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;

    if (isControlled) {
      // Controlled mode: just call onSelect
      calendar.onSelect?.(selectedDate);
    } else {
      // Uncontrolled mode: update internal state and call onSelect if provided
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
            'w-full justify-start gap-2 text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
          {...props}
        >
          <IconCalendar className='size-4' />
          <span>{date ? format(date, 'PPP') : 'Pick a date'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={handleDateSelect}
          autoFocus
          {...calendar}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
