'use client';

import type { Row } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';
import { TableLoading } from './table-loading';

interface TableMobileListProps<TData> {
  isLoading?: boolean;
  renderCard: (row: Row<TData>) => ReactNode;
  onCardClick?: (row: Row<TData>) => void;
  emptyMessage?: string;
  className?: string;
}

/**
 * Card-based list for admin tables on mobile/tablet — same TanStack rows as Table.Grid.
 */
export function TableMobileList<TData>({
  isLoading,
  renderCard,
  onCardClick,
  emptyMessage = 'No results found',
  className
}: TableMobileListProps<TData>) {
  const { table } = useTableContext<TData>();
  const rows = table.getRowModel().rows;

  if (isLoading) {
    return (
      <div className={cn('border-border/40 bg-card/20 border-x p-3', className)}>
        <TableLoading columnsCount={1} rowsCount={6} />
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <Flex
        align='center'
        justify='center'
        className={cn(
          'border-border/40 bg-card/20 text-muted-foreground border-x px-4 py-16 italic',
          className
        )}
      >
        <Text variant='muted' className='text-sm'>
          {emptyMessage}
        </Text>
      </Flex>
    );
  }

  return (
    <div
      className={cn(
        'border-border/40 bg-card/20 divide-border/40 divide-y border-x backdrop-blur-2xl',
        className
      )}
    >
      {rows.map((row) => (
        <div
          key={row.id}
          role={onCardClick ? 'button' : undefined}
          tabIndex={onCardClick ? 0 : undefined}
          className={cn(onCardClick && 'active:bg-primary/5 cursor-pointer transition-colors')}
          onClick={
            onCardClick
              ? (event) => {
                  const target = event.target as HTMLElement;
                  if (
                    target.closest('button, input, a, [role="checkbox"], [data-slot="checkbox"]')
                  ) {
                    return;
                  }
                  onCardClick(row);
                }
              : undefined
          }
          onKeyDown={
            onCardClick
              ? (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onCardClick(row);
                  }
                }
              : undefined
          }
        >
          {renderCard(row)}
        </div>
      ))}
    </div>
  );
}
