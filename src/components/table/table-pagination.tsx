import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight
} from '@tabler/icons-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // make sure you have this
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

interface TablePaginationProps {
  /** Show "Rows per page" selector (default true) */
  showPageSize?: boolean;
  /** Show total row count (default true) */
  showTotalRows?: boolean;
  /** Show jump to page input (default false – advanced) */
  showJumpToPage?: boolean;
  /** Available page size options */
  pageSizeOptions?: number[];
}

export function TablePagination<TData>({
  showPageSize = true,
  showTotalRows = true,
  showJumpToPage = false,
  pageSizeOptions = [10, 25, 50, 100, 250, 500]
}: TablePaginationProps) {
  const { table } = useTableContext<TData>();
  const [jumpPage, setJumpPage] = React.useState('');

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();

  // Smart page numbers with ellipsis
  const getPageNumbers = () => {
    const maxVisible = 5; // show max 5 numbers before ellipsis
    if (pageCount <= maxVisible) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const pages: (number | string)[] = [];
    pages.push(0);

    let start = Math.max(1, pageIndex - 1);
    let end = Math.min(pageCount - 2, pageIndex + 1);

    if (pageIndex <= 2) {
      start = 1;
      end = 3;
    } else if (pageIndex >= pageCount - 3) {
      start = pageCount - 4;
      end = pageCount - 2;
    }

    if (start > 1) pages.push('ellipsis-start');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < pageCount - 2) pages.push('ellipsis-end');

    if (pageCount > 1) pages.push(pageCount - 1);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Handle jump to page
  const handleJump = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      let page = parseInt(jumpPage, 10) - 1;
      if (isNaN(page)) page = 0;
      page = Math.min(Math.max(page, 0), pageCount - 1);
      table.setPageIndex(page);
      setJumpPage('');
    }
  };

  return (
    <div className='border-border/40 bg-card/40 flex w-full flex-col items-center justify-between gap-4 rounded-b-xl border border-t-0 px-4 py-3 backdrop-blur-2xl sm:flex-row'>
      {/* Left side: Page size + row info */}
      <div className='flex flex-wrap items-center gap-4'>
        {showPageSize && (
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-xs whitespace-nowrap'>Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => table.setPageSize(Number(value))}
            >
              <SelectTrigger className='border-border/40 bg-card/40 h-8 w-17.5 text-xs'>
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side='top'>
                {pageSizeOptions.map((size) => (
                  <SelectItem key={size} value={String(size)} className='text-xs'>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showTotalRows && (
          <div className='text-muted-foreground hidden text-xs md:block'>
            Showing{' '}
            <span className='text-foreground font-medium'>
              {rowCount === 0 ? 0 : pageIndex * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className='text-foreground font-medium'>
              {Math.min((pageIndex + 1) * pageSize, rowCount)}
            </span>{' '}
            of <span className='text-foreground font-medium'>{rowCount}</span> rows
          </div>
        )}
      </div>

      {/* Right side: Navigation + jump to page */}
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-xs font-medium'>
            Page {pageIndex + 1} of {Math.max(pageCount, 1)}
          </span>

          {showJumpToPage && (
            <div className='flex items-center gap-1'>
              <Input
                type='number'
                placeholder='Go to'
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                onKeyDown={handleJump}
                className='border-border/40 bg-card/40 h-8 w-16 text-xs'
                min={1}
                max={pageCount}
              />
            </div>
          )}
        </div>

        <div className='flex items-center gap-1'>
          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background hidden size-8 rounded-lg transition-colors sm:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className='size-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background size-8 rounded-lg transition-colors'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className='size-4' />
          </Button>

          <div className='hidden items-center gap-1 sm:flex'>
            {pageNumbers.map((pageNum) => {
              if (typeof pageNum === 'string') {
                return (
                  <span key={pageNum} className='text-muted-foreground px-1 text-xs'>
                    ···
                  </span>
                );
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageIndex === pageNum ? 'default' : 'outline'}
                  size='sm'
                  className={cn(
                    'size-8 rounded-lg text-xs font-bold transition-all',
                    pageIndex === pageNum
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border-border/40 bg-card/40 hover:bg-background'
                  )}
                  onClick={() => table.setPageIndex(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background size-8 rounded-lg transition-colors'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className='size-4' />
          </Button>

          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background hidden size-8 rounded-lg transition-colors sm:flex'
            onClick={() => table.setPageIndex(pageCount - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight className='size-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
