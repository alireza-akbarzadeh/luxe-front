'use client';

import { IconFilter } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import { useUIStore } from '../stores.store';
import { FilterSidebar } from './filter-sidebar';

export function MobileFilterSheet() {
  const open = useUIStore((s) => s.filterDrawerOpen);
  const setOpen = useUIStore((s) => s.setFilterDrawerOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm' className='rounded-full lg:hidden'>
          <IconFilter className='mr-2 h-4 w-4' /> Filters
        </Button>
      </SheetTrigger>
      <SheetContent side='bottom' className='h-[88vh] overflow-y-auto rounded-t-3xl'>
        <SheetHeader>
          <SheetTitle>Filter stores</SheetTitle>
        </SheetHeader>
        <div className='mt-6'>
          <FilterSidebar inSheet />
        </div>
      </SheetContent>
    </Sheet>
  );
}
