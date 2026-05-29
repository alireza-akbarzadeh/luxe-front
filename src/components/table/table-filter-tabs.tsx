import { IconChevronDown } from '@tabler/icons-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

// --- Types ---
export interface StatusOption {
  label: string;
  value?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const TableFilterTabs = ({ columnId, options }: { columnId: string; options: string[] }) => {
  const { table } = useTableContext();
  const column = table.getColumn(columnId);
  const currentValue = (column?.getFilterValue() as string) ?? '';
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'border-border/40 bg-card/40 h-11 w-full justify-between rounded-2xl px-4 text-[11px] font-black tracking-widest uppercase md:w-44',
            currentValue && 'border-primary/40 bg-primary/5 text-primary'
          )}
        >
          <span className='truncate'>{currentValue || 'All Categories'}</span>
          <IconChevronDown
            className={cn('size-4 opacity-50 transition-transform', open && 'rotate-180')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        className='border-border/40 w-[--radix-popover-trigger-width] rounded-2xl bg-[#0d1117]/95 p-1.5 backdrop-blur-xl'
      >
        {options.map((opt) => (
          <Button
            key={opt}
            variant='ghost'
            size='sm'
            onClick={() => {
              column?.setFilterValue(opt === 'All' ? '' : opt);
              setOpen(false);
            }}
            className={cn(
              'h-9 w-full justify-start rounded-xl px-3 text-[10px] font-bold uppercase',
              (opt === 'All' ? currentValue === '' : currentValue === opt)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground'
            )}
          >
            {opt}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
};
