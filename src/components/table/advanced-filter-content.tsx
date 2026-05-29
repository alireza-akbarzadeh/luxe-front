import {
  IconCalendarCancel,
  IconCreditCard,
  IconRotateClockwise,
  IconUserPlus
} from '@tabler/icons-react';
import type { ColumnFiltersState } from '@tanstack/react-table';
import { format } from 'date-fns';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function AdvancedFilterContent({
  onApply,
  currentFilters
}: {
  onApply: (f: ColumnFiltersState) => void;
  currentFilters: ColumnFiltersState;
}) {
  // Independent states for two different date filters
  const [joinedDate, setJoinedDate] = React.useState<DateRange | undefined>(() => {
    const f = currentFilters.find((f) => f.id === 'joinedAt');
    return f ? (f.value as DateRange) : undefined;
  });

  const [expiryDate, setExpiryDate] = React.useState<DateRange | undefined>(() => {
    const f = currentFilters.find((f) => f.id === 'subscriptionEnd');
    return f ? (f.value as DateRange) : undefined;
  });

  const handleApply = () => {
    const filters: ColumnFiltersState = [
      ...currentFilters.filter((f) => f.id !== 'joinedAt' && f.id !== 'subscriptionEnd')
    ];

    if (joinedDate?.from) filters.push({ id: 'joinedAt', value: joinedDate });
    if (expiryDate?.from) filters.push({ id: 'subscriptionEnd', value: expiryDate });

    onApply(filters);
  };

  return (
    <div className='space-y-8 py-6'>
      {/* JOINED AT FILTER */}
      <div className='space-y-3'>
        <h4 className='text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-widest uppercase'>
          <IconUserPlus className='h-3.5 w-3.5 text-emerald-500' /> Registration Date
        </h4>
        <DatePickerWithRange
          date={joinedDate}
          setDate={setJoinedDate}
          placeholder='Filter by join date...'
        />
      </div>

      {/* EXPIRY FILTER */}
      <div className='space-y-3'>
        <h4 className='text-muted-foreground flex items-center gap-2 text-[10px] font-black tracking-widest uppercase'>
          <IconCreditCard className='text-primary h-3.5 w-3.5' /> Subscription Expiry
        </h4>
        <DatePickerWithRange
          date={expiryDate}
          setDate={setExpiryDate}
          placeholder='Filter by expiry date...'
        />
      </div>

      <div className='border-border/40 flex flex-col gap-2 border-t pt-6'>
        <Button
          onClick={handleApply}
          className='shadow-primary/20 h-12 w-full rounded-2xl text-xs font-black tracking-widest uppercase shadow-lg'
        >
          Sync Filter Set
        </Button>
        <Button
          variant='ghost'
          onClick={() => onApply([])}
          className='text-muted-foreground h-10 rounded-xl text-[10px] font-bold uppercase'
        >
          <IconRotateClockwise className='mr-2 h-3 w-3' /> Reset Both
        </Button>
      </div>
    </div>
  );
}

// Helper component for reusability
function DatePickerWithRange({
  date,
  setDate,
  placeholder
}: {
  date: DateRange | undefined;
  setDate: (d: DateRange | undefined) => void;
  placeholder: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'border-border/40 bg-muted/20 h-12 w-full justify-start rounded-xl text-left font-bold',
            !date && 'text-muted-foreground'
          )}
        >
          <IconCalendarCancel className='mr-2 h-4 w-4 opacity-50' />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, 'LLL dd')} - {format(date.to, 'LLL dd')}
              </>
            ) : (
              format(date.from, 'LLL dd, y')
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='border-border/40 w-auto rounded-2xl p-0' align='start'>
        <Calendar mode='range' selected={date} onSelect={setDate} numberOfMonths={1} />
      </PopoverContent>
    </Popover>
  );
}
