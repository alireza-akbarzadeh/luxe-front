import { Button } from '@/components/ui/button';
import { useStoresFilters } from '@/domains/store/hooks/useStoresFilter';

export function StorePagination({ page, totalPages }: { page: number; totalPages: number }) {
  const { setFilters } = useStoresFilters();
  return (
    <nav className='flex items-center justify-center gap-2 pt-4' aria-label='Pagination'>
      <Button
        variant='outline'
        size='sm'
        disabled={page <= 1}
        onClick={() => setFilters({ page: page - 1 })}
        className='rounded-full'
      >
        Previous
      </Button>
      <span className='text-muted-foreground text-sm'>
        Page {page} of {totalPages}
      </span>
      <Button
        variant='outline'
        size='sm'
        disabled={page >= totalPages}
        onClick={() => setFilters({ page: page + 1 })}
        className='rounded-full'
      >
        Next
      </Button>
    </nav>
  );
}
