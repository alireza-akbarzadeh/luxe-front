import {
  IconAlertTriangle,
  IconArrowsHorizontal,
  IconChevronDown,
  IconClock,
  IconFilter,
  IconUserCheck,
  IconUserMinus,
  IconX
} from '@tabler/icons-react';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type Row,
  useReactTable
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { Table } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { downloadCSV } from '@/lib/utils';
import { AdvancedFilterContent } from '~/src/components/table/advanced-filter-content';
import { useGetUsers } from '~/src/services/-users-get';
import type { GetUsers200DataUsersItem } from '~/src/services/-users-get.schemas';

import { userColumns } from './userColumns';

export function UserManagementTable() {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState({});
  const { push } = useRouter();
  const { data, error, isLoading } = useGetUsers();

  const applySegment = (segment: 'all' | 'new' | 'power' | 'risk') => {
    switch (segment) {
      case 'new':
        setColumnFilters([{ id: 'status', value: ['Pending'] }]);
        break;
      case 'power':
        setColumnFilters([{ id: 'plan', value: 'Premium' }]);
        break;
      case 'risk':
        setColumnFilters([{ id: 'status', value: ['Flagged', 'Suspended'] }]);
        break;
      default:
        setColumnFilters([]);
    }
    toast.success(`Switched to ${segment} segment`);
  };
  const table = useReactTable({
    data: data?.data?.users || [],
    columns: userColumns,
    state: { columnFilters, rowSelection },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    filterFns: {
      multiSelect: (row, columnId, filterValue) => {
        if (
          !filterValue ||
          filterValue === '' ||
          (Array.isArray(filterValue) && filterValue.length === 0)
        )
          return true;
        const rowValue = String(row.getValue(columnId)).toLowerCase();
        if (Array.isArray(filterValue)) {
          return filterValue.some((val) => String(val).toLowerCase() === rowValue);
        }
        return String(filterValue).toLowerCase() === rowValue;
      },
      fuzzy: (row, columnId, value) => {
        const itemValue = String(row.getValue(columnId)).toLowerCase();
        const filterValue = String(value).toLowerCase();
        return filterValue === '' || itemValue.includes(filterValue);
      },
      // NEW: Robust Date Range Filtering
      dateRange: (row, columnId, value) => {
        const rowValue = row.getValue(columnId);
        if (!rowValue || !value) return true;

        const date = new Date(rowValue as string | number | Date);
        const { from, to } = value as DateRange;

        if (from && to) {
          return date >= from && date <= to;
        }
        if (from) {
          return date >= from;
        }
        return true;
      }
    }
  });

  const userStatusOptions = [
    { label: 'Active', icon: IconUserCheck, color: 'text-emerald-500' },
    { label: 'Pending', icon: IconClock, color: 'text-amber-500' },
    { label: 'Suspended', icon: IconUserMinus, color: 'text-destructive' },
    { label: 'Flagged', icon: IconAlertTriangle, color: 'text-orange-500' }
  ];

  const handleDelete = (rows: Row<GetUsers200DataUsersItem>[]) => {
    toast.error(`Suspending ${rows.length} users`);
  };

  const handleDownload = (rows: Row<GetUsers200DataUsersItem>[]) => {
    downloadCSV(rows, 'users-export');
    toast.success('Download Started');
  };

  if (error?.error)
    return (
      <div className='rounded-4xl border-2 border-dashed p-16 text-center'>
        <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-bold tracking-tight uppercase italic'>Sync Error</h3>
        <p className='text-muted-foreground text-sm font-medium'>{error.message}</p>
      </div>
    );

  return (
    <Table.Root table={table}>
      <div className='space-y-0'>
        {/* 1. COMMAND BAR */}
        <div className='bg-muted/5 border-border/40 flex flex-col items-center gap-3 border-b px-6 py-5 md:flex-row'>
          <div className='w-full flex-1 md:w-auto'>
            <Table.Search columnId='name' placeholder='Search identities by name or email...' />
          </div>

          <div className='flex w-full items-center gap-2 md:w-auto'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='border-border/60 hover:bg-background h-10 gap-2 rounded-xl border-dashed text-[10px] font-bold uppercase'
                >
                  <IconFilter className='text-primary h-3.5 w-3.5' />
                  Segment: {columnFilters.length > 0 ? 'Custom' : 'All'}
                  <IconChevronDown className='h-3 w-3 opacity-50' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='border-border/40 w-48 rounded-xl p-1 shadow-2xl'
              >
                <DropdownMenuItem
                  onClick={() => applySegment('all')}
                  className='py-2 text-[10px] font-bold uppercase'
                >
                  All Users
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applySegment('new')}
                  className='py-2 text-[10px] font-bold text-amber-600 uppercase'
                >
                  New Signups
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applySegment('power')}
                  className='text-primary py-2 text-[10px] font-bold uppercase'
                >
                  Power Users
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => applySegment('risk')}
                  className='text-destructive py-2 text-[10px] font-bold uppercase'
                >
                  At Risk
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AppDialog
              component='drawer'
              title='Advanced Parameters'
              description='Filter by Registration Date, Expiry, and Usage metrics.'
              trigger={
                <Button
                  variant='outline'
                  size='sm'
                  className='hover:bg-background h-10 gap-2 rounded-xl text-[10px] font-bold uppercase'
                >
                  <IconArrowsHorizontal className='h-3.5 w-3.5' />
                  Advanced
                  {columnFilters.length > 0 && (
                    <span className='bg-primary text-primary-foreground ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px]'>
                      {columnFilters.length}
                    </span>
                  )}
                </Button>
              }
            >
              <AdvancedFilterContent onApply={setColumnFilters} currentFilters={columnFilters} />
            </AppDialog>

            <div className='bg-border mx-2 hidden h-4 w-px md:block' />

            <Table.FilterTabs columnId='plan' options={['All', 'Premium', 'Standard', 'Free']} />

            {columnFilters.length > 0 && (
              <Button
                variant='ghost'
                onClick={() => setColumnFilters([])}
                className='text-destructive hover:bg-destructive/5 h-10 rounded-xl px-3 text-[10px] font-black uppercase'
              >
                <IconX className='mr-1 h-3.5 w-3.5' /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* 2. SUB-BAR */}
        <div className='bg-background/50 border-border/40 flex items-center justify-between border-b px-6 py-4'>
          <Table.StatusFilters
            columnId='status'
            title='Account Status'
            options={userStatusOptions}
          />

          <div className='flex items-center gap-3'>
            <Table.BulkActions
              onDelete={handleDelete}
              onDownload={handleDownload}
              deleteTitle='Confirm Suspension'
              deleteDescription='This will revoke access for all selected accounts immediately.'
            />
            <div className='bg-primary/10 border-primary/20 text-primary rounded-full border px-4 py-1.5 text-[10px] leading-none font-black tracking-widest uppercase'>
              {table.getFilteredRowModel().rows.length} Results
            </div>
          </div>
        </div>

        {/* 3. TABLE BODY */}
        <div className='p-2'>
          {isLoading ? (
            <Table.Loading columnsCount={8} rowsCount={10} />
          ) : (
            <Table.Body<GetUsers200DataUsersItem>
              onRowDoubleClick={(row) => push(`/dashboard/users/edit/${row.original.id}`)}
              columnsCount={8}
            />
          )}
        </div>

        {/* 4. PAGINATION */}
        <div className='border-border/40 border-t px-6 py-4'>
          <Table.Pagination />
        </div>
      </div>
    </Table.Root>
  );
}
