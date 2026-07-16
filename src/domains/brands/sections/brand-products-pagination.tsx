'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

interface BrandProductsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Simple numbered pagination for brand product grids. */
export function BrandProductsPagination({
  page,
  totalPages,
  onPageChange
}: BrandProductsPaginationProps) {
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
        aria-label='Previous page'
      >
        <IconChevronLeft className='h-4 w-4' />
      </Button>
      {Array.from({ length: visibleCount }).map((_, i) => {
        const pageNum = i + 1;
        return (
          <Button
            key={pageNum}
            type='button'
            size='icon'
            variant={page === pageNum ? 'default' : 'outline'}
            className='rounded-full'
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
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
        aria-label='Next page'
      >
        <IconChevronRight className='h-4 w-4' />
      </Button>
    </Flex>
  );
}
