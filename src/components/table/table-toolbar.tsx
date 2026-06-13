// table-toolbar.tsx
import { IconDatabase, IconPlus, IconRefresh } from '@tabler/icons-react';

import { useTableContext } from '@/components/table/table-context';
import { TableSearch } from '@/components/table/table-search';
import type { TableToolbarProps } from '@/components/table/table-types';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  BulkActionsBar,
  ColumnVisibilityDropdown,
  ExportButton,
  SortingDropdown
} from '~/src/components/table/table-actions';

export function TableToolbar<TData>(props: TableToolbarProps) {
  const {
    showSearch = true,
    searchPlaceholder,
    globalFilter,
    isLoading,
    children,
    showRefresh,
    onRefresh,
    showCreate,
    onCreate,
    showClear,
    onClearFilter,
    showColumnVisibility = true,
    showSorting = true,
    showExport = true,
    showBulkActions = true
  } = props;

  const { table } = useTableContext<TData>();
  const filteredCount = table.getFilteredRowModel().rows.length;

  return (
    <div className='border-border/40 bg-card/40 flex flex-wrap items-center gap-3 rounded-t-xl border border-b-0 p-3 backdrop-blur-2xl'>
      {showSearch && (
        <div className='flex min-w-50 flex-1 items-center gap-2'>
          <TableSearch placeholder={searchPlaceholder ?? 'Search by name or slug'} />
          {globalFilter && showClear && onClearFilter && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onClearFilter}
              className='text-muted-foreground hover:text-foreground h-8 px-2 text-xs'
            >
              Clear
            </Button>
          )}
        </div>
      )}

      <div className='flex flex-wrap items-center gap-2'>
        {showRefresh && onRefresh && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='outline'
                  size='icon'
                  disabled={isLoading}
                  onClick={onRefresh}
                  className='border-border/40 bg-card/40 hover:bg-background size-8 rounded-lg transition-colors'
                >
                  <IconRefresh className={cn('size-4', isLoading && 'animate-spin')} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>Refresh data</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {showCreate && onCreate && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onCreate}
                  variant='outline'
                  size='icon'
                  className='border-border/40 bg-card/40 hover:bg-background size-8 rounded-lg transition-colors'
                >
                  <IconPlus className='size-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent side='top'>Create new</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        {showColumnVisibility && <ColumnVisibilityDropdown<TData> />}
        {showSorting && <SortingDropdown<TData> />}
        {showExport && <ExportButton<TData> />}

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='border-border/40 bg-card/40 hover:bg-background relative inline-flex size-8 items-center justify-center rounded-lg transition-colors'
              >
                <IconDatabase className='size-4' />
                <span className='bg-primary text-primary-foreground absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold'>
                  {filteredCount}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>Total rows after filters</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {children}
      </div>

      {showBulkActions && <BulkActionsBar<TData> />}
    </div>
  );
}
