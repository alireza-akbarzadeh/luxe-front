'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

interface CollectionProductsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Simple pagination for collection result grids. */
export function CollectionProductsPagination({
  page,
  totalPages,
  onPageChange
}: CollectionProductsPaginationProps) {
  if (totalPages <= 1) return null;

  const visibleCount = Math.min(totalPages, 5);

  return (
    <Flex direction='row' align='center' justify='center' gap={2} className='pt-2'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='rounded-full'
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <IconChevronLeft className='h-4 w-4' />
      </Button>
      {Array.from({ length: visibleCount }).map((_, index) => {
        const pageNumber = index + 1;
        return (
          <Button
            key={pageNumber}
            type='button'
            size='icon'
            variant={page === pageNumber ? 'default' : 'outline'}
            className='rounded-full'
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        );
      })}
      {totalPages > 5 ? (
        <Typography.Muted className='px-1 text-xs'>…{totalPages}</Typography.Muted>
      ) : null}
      <Button
        type='button'
        variant='outline'
        size='icon'
        className='rounded-full'
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <IconChevronRight className='h-4 w-4' />
      </Button>
    </Flex>
  );
}
