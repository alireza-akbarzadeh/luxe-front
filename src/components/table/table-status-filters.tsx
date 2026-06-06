import { IconCheck, IconChevronDown, IconRotateClockwise } from '@tabler/icons-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { useTableContext } from './table-context';
import type { StatusFiltersProps } from './table-types';

export const TableStatusFilters = ({ columnId, options, title = 'Status' }: StatusFiltersProps) => {
  const { table } = useTableContext();
  const { isMobile } = useMediaDevices();
  const column = table.getColumn(columnId);

  // 1. SAFELY RESOLVE VALUE: Handle both string values and array values cleanly
  const rawValue = column?.getFilterValue();
  const currentValue = Array.isArray(rawValue)
    ? ((rawValue[0] as string) ?? '')
    : ((rawValue as string) ?? '');

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const activeOption = options.find((opt) => (opt.value ?? opt.label) === currentValue);

  // 2. Safe string checking now that arrays are parsed out
  const normalizedValue = currentValue ? String(currentValue).toLowerCase() : '';

  const handleSelect = (filterValue: string) => {
    const isActive = currentValue === filterValue;
    // Keep array structure intact for your multi-select filters
    column?.setFilterValue(isActive ? [] : [filterValue]);
    setOpen(false);
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    column?.setFilterValue([]);
    setOpen(false);
  };

  const filterContent = (
    <Command value={normalizedValue} className='bg-background text-popover-foreground'>
      <CommandInput
        placeholder={`Filter ${title}...`}
        className='h-9 text-xs'
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList className='custom-scrollbar max-h-75 overflow-y-auto'>
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
                value={filterValue.toLowerCase()}
                onSelect={() => handleSelect(filterValue)}
                className='data-[selected="true"]:bg-accent data-[selected="true"]:text-accent-foreground flex cursor-pointer items-center gap-2 px-3 py-2 text-[11px] font-bold uppercase'
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
        <div className='border-border/20 bg-muted/20 mt-auto border-t p-1'>
          <Button
            variant='ghost'
            onClick={handleReset}
            className='text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-full rounded-lg text-[10px] font-bold uppercase'
          >
            <IconRotateClockwise className='mr-2 size-3' />
            Reset Filter
          </Button>
        </div>
      )}
    </Command>
  );

  const TriggerButton = (
    <Button
      variant='outline'
      className={cn(
        'border-border/60 bg-background h-10 w-full justify-between rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all md:w-50',
        currentValue
          ? 'text-primary border-primary/40 bg-primary/5'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
  );

  if (isMobile) {
    return (
      <div className='flex w-full items-center gap-2'>
        <Drawer
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) setSearchValue('');
          }}
        >
          <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
          <DrawerContent className='bg-background border-border/40 max-h-[85vh] p-0'>
            <DrawerHeader className='border-border/10 border-b px-4 pt-4 pb-2 text-left'>
              <DrawerTitle className='text-muted-foreground text-xs font-black tracking-widest uppercase'>
                Filter by {title}
              </DrawerTitle>
            </DrawerHeader>
            <div className='p-2 pb-6'>{filterContent}</div>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className='flex w-full items-center gap-2 md:w-auto'>
      <span className='text-muted-foreground mr-1 hidden text-[10px] font-black tracking-[0.2em] uppercase sm:inline'>
        {title}:
      </span>

      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setSearchValue('');
        }}
      >
        <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
        <PopoverContent
          className='border-border/60 w-50 overflow-hidden rounded-xl p-0 shadow-2xl'
          align='start'
        >
          {filterContent}
        </PopoverContent>
      </Popover>
    </div>
  );
};
