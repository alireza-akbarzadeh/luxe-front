import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import * as React from 'react';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useMediaDevices } from '@/hooks/useMediaDevices';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

export const TableFilterTabs = ({ columnId, options }: { columnId: string; options: string[] }) => {
  const { table } = useTableContext();
  const { isMobile } = useMediaDevices();
  const column = table.getColumn(columnId);

  // 1. SAFELY RESOLVE VALUE: Handle both array structures and plain string configurations
  const rawValue = column?.getFilterValue();
  const currentValue = Array.isArray(rawValue)
    ? ((rawValue[0] as string) ?? '')
    : ((rawValue as string) ?? '');

  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const normalizedValue = currentValue ? String(currentValue).toLowerCase() : '';

  const handleSelect = (opt: string) => {
    const isAll = opt === 'All';
    const targetValue = isAll ? '' : opt;
    const isActive = currentValue === targetValue;

    // Keep array structure intact for your multi-select / advanced filters setup
    if (isActive || isAll) {
      column?.setFilterValue([]);
    } else {
      column?.setFilterValue([targetValue]);
    }
    setOpen(false);
  };

  // JSX Block Content matching the command parameters safely with search tracking
  const filterContent = (
    <Command value={normalizedValue} className='bg-background text-popover-foreground'>
      <CommandInput
        placeholder='Search category...'
        className='h-9 text-xs'
        value={searchValue}
        onValueChange={setSearchValue}
      />
      <CommandList className='custom-scrollbar max-h-75 overflow-y-auto p-1'>
        <CommandEmpty className='text-muted-foreground py-2 text-center text-[10px] uppercase'>
          No categories found
        </CommandEmpty>
        <CommandGroup>
          {options.map((opt) => {
            const isAll = opt === 'All';
            const isActive = isAll ? currentValue === '' : currentValue === opt;

            return (
              <CommandItem
                key={opt}
                value={opt.toLowerCase()}
                onSelect={() => handleSelect(opt)}
                className='data-[selected="true"]:bg-accent data-[selected="true"]:text-accent-foreground flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-[10px] font-bold uppercase'
              >
                <span className={isActive ? 'text-primary' : 'text-muted-foreground'}>{opt}</span>
                {isActive && <IconCheck className='text-primary size-3' />}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  const TriggerButton = (
    <Button
      variant='outline'
      className={cn(
        'border-border/60 bg-background h-11 w-full justify-between rounded-2xl px-4 text-[11px] font-black tracking-widest uppercase transition-all md:w-44',
        currentValue && 'border-primary/40 bg-primary/5 text-primary'
      )}
    >
      <span className='truncate'>{currentValue || 'All Categories'}</span>
      <IconChevronDown
        className={cn('size-4 opacity-50 transition-transform', open && 'rotate-180')}
      />
    </Button>
  );

  // State clean-up handler for closure properties
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setSearchValue(''); // Reset local input filter text when overlay drops
  };

  if (isMobile) {
    return (
      <div className='flex w-full items-center gap-2'>
        <Drawer open={open} onOpenChange={handleOpenChange}>
          <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
          <DrawerContent className='bg-background border-border/40 max-h-[85vh] p-0'>
            <DrawerHeader className='border-border/10 border-b px-4 pt-4 pb-2 text-left'>
              <DrawerTitle className='text-muted-foreground text-xs font-black tracking-widest uppercase'>
                Categories
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
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>{TriggerButton}</PopoverTrigger>
        <PopoverContent
          align='start'
          className='border-border/60 w-44 overflow-hidden rounded-2xl p-0 shadow-2xl backdrop-blur-xl'
        >
          {filterContent}
        </PopoverContent>
      </Popover>
    </div>
  );
};
