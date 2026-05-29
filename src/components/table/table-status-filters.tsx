import { IconCheck, IconChevronDown, IconRotateClockwise } from '@tabler/icons-react';
import React from 'react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { cn } from '@/lib/utils';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useTableContext } from './table-context';
import type { StatusFiltersProps } from './table-types';

export const TableStatusFilters = ({ columnId, options, title = 'Status' }: StatusFiltersProps) => {
  const { table } = useTableContext();
  const column = table.getColumn(columnId);
  const currentValue = (column?.getFilterValue() as string) ?? '';
  const [open, setOpen] = React.useState(false);

  const activeOption = options.find((opt) => (opt.value ?? opt.label) === currentValue);

  return (
    <div className='flex w-full items-center gap-2 md:w-auto'>
      <span className='text-muted-foreground mr-1 hidden text-[10px] font-black tracking-[0.2em] uppercase sm:inline'>
        {title}:
      </span>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className={cn(
              'border-border/40 h-10 w-full justify-between rounded-xl bg-[#0d1117] text-[11px] font-bold tracking-wider uppercase transition-all md:w-50',
              currentValue
                ? 'text-primary border-primary/30'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div className='flex items-center gap-2 truncate'>
              {activeOption ? (
                <>
                  <activeOption.icon className={cn('size-3.5', activeOption.color)} />
                  <span>{activeOption.label}</span>
                </>
              ) : (
                <span>Select {title}</span>
              )}
            </div>
            <IconChevronDown className='ml-2 size-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='border-border/40 w-50 bg-[#0d1117] p-0 shadow-2xl' align='start'>
          <Command className='bg-transparent'>
            <CommandInput placeholder={`Filter ${title}...`} className='h-9 text-xs' />
            <CommandList>
              <CommandEmpty className='text-muted-foreground py-2 text-center text-[10px] uppercase'>
                No results
              </CommandEmpty>
              <CommandGroup>
                {options.map((s) => {
                  const filterValue = s.value ?? s.label;
                  const isActive = currentValue === filterValue;
                  const Icon = s.icon;

                  return (
                    <CommandItem
                      key={s.label}
                      onSelect={() => {
                        column?.setFilterValue(isActive ? '' : filterValue);
                        setOpen(false);
                      }}
                      className='flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase'
                    >
                      <Icon className={cn('size-3.5', s.color)} />
                      <span className='flex-1'>{s.label}</span>
                      {isActive && <IconCheck className='text-primary size-3' />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
            {currentValue && (
              <div className='border-border/10 border-t p-1'>
                <Button
                  variant='ghost'
                  onClick={() => {
                    column?.setFilterValue('');
                    setOpen(false);
                  }}
                  className='text-destructive hover:text-destructive/80 h-8 w-full text-[10px] font-bold uppercase'
                >
                  <IconRotateClockwise className='mr-2 size-3' />
                  Reset Filter
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
