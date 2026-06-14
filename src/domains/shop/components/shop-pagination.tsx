'use client';

import { Button } from '@/components/ui/button';

import { useProductFilters } from '../useProductFilters';

export function ShopPagination({ page, totalPages }: { page: number; totalPages: number }) {
  const { setPage } = useProductFilters();

  if (totalPages <= 1) return null;

  return (
    <nav className='flex items-center justify-center gap-2 pt-8' aria-label='Shop pagination'>
      <Button
        variant='outline'
        size='sm'
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
        className='rounded-full'
      >
        Previous
      </Button>
      <span className='text-muted-foreground text-sm tabular-nums'>
        Page {page} of {totalPages}
      </span>
      <Button
        variant='outline'
        size='sm'
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
        className='rounded-full'
      >
        Next
      </Button>
    </nav>
  );
}
