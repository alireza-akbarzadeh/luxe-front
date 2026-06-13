import { IconArrowsSort, IconColumns, IconDownload } from '@tabler/icons-react';

import { useTableContext } from '@/components/table/table-context';
import { exportToCSV } from '@/components/table/table-utils';
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

export function ColumnVisibilityDropdown<TData>() {
  const { table } = useTableContext<TData>();
  const columns = table.getAllColumns().filter((col) => col.getCanHide());

  if (columns.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='outline' size='icon' className='size-8 rounded-lg'>
                <IconColumns className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent side='top'>Show/hide columns</TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
            {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SortingDropdown<TData>() {
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

export function ExportButton<TData>() {
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

export function BulkActionsBar<TData>() {
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
