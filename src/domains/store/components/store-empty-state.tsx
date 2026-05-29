'use client';
import { IconBuildingStore, IconSearchOff } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { useStoresFilters } from '~/src/domains/store/hooks/useStoresFilter';

export function EmptyState() {
  const { reset } = useStoresFilters();
  return (
    <div className='border-border bg-card/40 flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-20 text-center'>
      <div className='relative mb-4'>
        <IconBuildingStore className='text-muted-foreground/40 h-12 w-12' />
        <IconSearchOff className='text-muted-foreground/60 absolute -right-2 -bottom-1 h-6 w-6' />
      </div>
      <h3 className='text-lg font-semibold'>No stores match your filters</h3>
      <p className='text-muted-foreground mt-1 max-w-sm text-sm'>
        Try removing a few filters or broadening your search to discover more brands.
      </p>
      <Button onClick={reset} className='mt-6 rounded-full' variant='secondary'>
        Clear all filters
      </Button>
    </div>
  );
}
