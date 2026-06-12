// table-toolbar.tsx
import {
  IconArrowsSort,
  IconColumns,
  IconDatabase,
  IconDownload,
  IconPlus,
  IconRefresh
} from '@tabler/icons-react';

import { useTableContext } from '@/components/table/table-context';
import { TableSearch } from '@/components/table/table-search';
import type { TableToolbarProps } from '@/components/table/table-types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { exportToCSV } from '~/src/components/table/table-utils';

function ColumnVisibilityDropdown<TData>() {
  const { table } = useTableContext<TData>();
  const columns = table.getAllColumns().filter((col) => col.getCanHide());

  if (columns.length === 0) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='icon' className='size-8 rounded-lg'>
                <IconColumns className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-40'>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {typeof column.columnDef.header === 'string'
                    ? column.columnDef.header
                    : column.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side='top'>Show/hide columns</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SortingDropdown<TData>() {
  const { table } = useTableContext<TData>();
  const sorting = table.getState().sorting;

  const handleSortChange = (value: string) => {
    if (value === 'clear') {
      table.setSorting([]);
      return;
    }
    const [id = '', desc] = value.split('-');
    table.setSorting([{ id, desc: desc === 'desc' }]);
  };

  const currentValue = sorting[0] ? `${sorting[0].id}-${sorting[0].desc ? 'desc' : 'asc'}` : '';

  return (
    <Select value={currentValue} onValueChange={handleSortChange}>
      <SelectTrigger className='border-border/40 bg-card/40 h-8 w-auto gap-1 px-2 text-xs'>
        <IconArrowsSort className='size-3.5' />
        <SelectValue placeholder='Sort by' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='clear'>Clear sort</SelectItem>
        <SelectItem value='name-asc'>Name (A→Z)</SelectItem>
        <SelectItem value='name-desc'>Name (Z→A)</SelectItem>
        <SelectItem value='created_at-desc'>Newest first</SelectItem>
        <SelectItem value='level-asc'>Level (low→high)</SelectItem>
        <SelectItem value='level-desc'>Level (high→low)</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ExportButton<TData>() {
  const { table } = useTableContext<TData>();
  const filteredRows = table.getFilteredRowModel().rows;

  const handleExport = () => {
    const visibleColumns = table
      .getVisibleLeafColumns()
      .filter((col) => col.id !== 'select' && col.id !== 'expander')
      .map((col) => ({
        id: col.id,
        header: typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id
      }));
    const rowData = filteredRows.map((row) => row.original);
    exportToCSV(rowData, visibleColumns);
  };

  if (filteredRows.length === 0) return null;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={handleExport}
            className='size-8 rounded-lg'
          >
            <IconDownload className='size-4' />
          </Button>
        </TooltipTrigger>
        <TooltipContent side='top'>Export filtered rows to CSV</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function BulkActionsBar<TData>() {
  const { table } = useTableContext<TData>();
  const selectedRows = table.getSelectedRowModel().rows;

  if (selectedRows.length === 0) return null;

  return (
    <div className='bg-primary/10 flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm'>
      <span className='font-medium'>{selectedRows.length} selected</span>
      <Button
        variant='destructive'
        size='sm'
        className='h-7 px-2 text-xs'
        onClick={() => {
          console.log(
            'Bulk delete',
            selectedRows.map((r) => r.original)
          );
          table.resetRowSelection();
        }}
      >
        Delete
      </Button>
      <Button
        variant='outline'
        size='sm'
        className='h-7 px-2 text-xs'
        onClick={() => table.resetRowSelection()}
      >
        Clear
      </Button>
    </div>
  );
}

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
