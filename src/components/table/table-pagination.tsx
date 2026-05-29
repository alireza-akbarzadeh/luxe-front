import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight
} from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { useTableContext } from './table-context';

export function TablePagination<TData>() {
  const { table } = useTableContext<TData>();

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();

  // Calculate visible page numbers with smart ellipsis
  const getPageNumbers = () => {
    const maxVisible = 7;
    if (pageCount <= maxVisible) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(0);

    if (pageIndex <= 3) {
      // Near start
      for (let i = 1; i < Math.min(5, pageCount - 1); i++) {
        pages.push(i);
      }
      if (pageCount > 5) pages.push('ellipsis-end');
    } else if (pageIndex >= pageCount - 4) {
      // Near end
      pages.push('ellipsis-start');
      for (let i = Math.max(1, pageCount - 5); i < pageCount - 1; i++) {
        pages.push(i);
      }
    } else {
      // Middle
      pages.push('ellipsis-start');
      for (let i = pageIndex - 1; i <= pageIndex + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis-end');
    }

    // Always show last page
    if (pageCount > 1) {
      pages.push(pageCount - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className='flex w-full flex-col items-center justify-between gap-4 px-2 py-3 sm:flex-row'>
      {/* Left Side: Page Size Selector & Info */}
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground text-xs whitespace-nowrap'>Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-17.5 text-xs'>
              <SelectValue placeholder={String(pageSize)} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 25, 50, 100, 250, 500].map((size) => (
                <SelectItem key={size} value={String(size)} className='text-xs'>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='text-muted-foreground hidden text-xs md:block'>
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, rowCount)} of{' '}
          {rowCount} rows
        </div>
      </div>

      {/* Right Side: Navigation */}
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground mr-2 text-xs font-medium'>
          Page {pageIndex + 1} of {pageCount}
        </span>

        <div className='flex items-center gap-1'>
          {/* First Page */}
          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background hidden size-8 rounded-lg transition-colors sm:flex'
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft className='size-4' />
          </Button>

          {/* Previous Page */}
          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background size-8 rounded-lg transition-colors'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className='size-4' />
          </Button>

          {/* Page Numbers */}
          <div className='hidden items-center gap-1 sm:flex'>
            {pageNumbers.map((pageNum) => {
              if (typeof pageNum === 'string') {
                return (
                  <span key={`ellipsis-${pageNum}`} className='text-muted-foreground px-2'>
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageIndex === pageNum ? 'default' : 'ghost'}
                  size='sm'
                  className={cn(
                    'size-8 rounded-lg text-xs font-bold transition-all',
                    pageIndex === pageNum
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'hover:bg-muted'
                  )}
                  onClick={() => table.setPageIndex(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          {/* Next Page */}
          <Button
            variant='outline'
            size='icon'
            className='border-border/40 bg-card/40 hover:bg-background size-8 rounded-lg transition-colors'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className='size-4' />
          </Button>

          {/* Last Page */}
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
