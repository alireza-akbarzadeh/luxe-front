'use client';

import {
  IconAlertTriangle,
  IconArrowsHorizontal,
  IconChevronDown,
  IconFilter,
  IconTrash,
  IconUserCheck,
  IconUserMinus
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { AdvancedFilterContent } from '@/components/table/advanced-filter-content';
import { Table, useTableState } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useGetUsers } from '@/services/-users-get';
import type { GetUsers200DataUsersItem, GetUsersRole } from '@/services/-users-get.schemas';

import { userColumns } from '../components/userColumns';

export function UserManagementTable() {
  const { push } = useRouter();
  const tableState = useTableState({ initialPageSize: 20 });
  const deferredFilter = React.useDeferredValue(tableState.globalFilter);

  // Derive server-side filter params from columnFilters
  // API only supports: is_active (boolean) and role (exact match)
  const isActiveFilter = tableState.columnFilters.find((f) => f.id === 'status')?.value as
    | boolean
    | undefined;
  const roleFilter = tableState.columnFilters.find((f) => f.id === 'role')?.value as
    | GetUsersRole
    | undefined;

  const { data, error, isLoading, isFetching, refetch } = useGetUsers({
    limit: tableState.pagination.pageSize,
    offset: tableState.pagination.pageIndex * tableState.pagination.pageSize,
    email: deferredFilter || undefined,
    first_name: deferredFilter || undefined,
    last_name: deferredFilter || undefined,
    is_active: isActiveFilter,
    role: roleFilter
  });

  const users = React.useMemo(() => data?.data?.users ?? [], [data?.data?.users]);
  const total = data?.data?.total ?? 0;

  const selectedUsers = React.useMemo(() => {
    const selectedIds = Object.keys(tableState.rowSelection).filter(
      (id) => tableState.rowSelection[id]
    );
    return users.filter((user) => selectedIds.includes(String(user.id)));
  }, [tableState.rowSelection, users]);

  // Segments mapped to is_active (the only status-like field the API supports)
  const applySegment = (segment: 'all' | 'active' | 'inactive' | 'admins') => {
    switch (segment) {
      case 'active':
        tableState.setColumnFilters([{ id: 'status', value: true }]);
        break;
      case 'inactive':
        tableState.setColumnFilters([{ id: 'status', value: false }]);
        break;
      case 'admins':
        tableState.setColumnFilters([{ id: 'role', value: 'admin' }]);
        break;
      default:
        tableState.setColumnFilters([]);
    }
    tableState.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    toast.success(`Switched to ${segment} segment`);
  };

  const userStatusOptions = [
    { label: 'Active', value: true, icon: IconUserCheck, color: 'text-emerald-500' },
    { label: 'Inactive', value: false, icon: IconUserMinus, color: 'text-slate-400' }
  ];

  const handleDelete = () => {
    toast.error(`Suspending ${selectedUsers[0]?.id} users`);
    // API call would go here
  };

  if (error?.error) {
    return (
      <div className='rounded-4xl border-2 border-dashed p-16 text-center'>
        <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-bold tracking-tight uppercase italic'>Sync Error</h3>
        <p className='text-muted-foreground text-sm font-medium'>{error.message}</p>
      </div>
    );
  }

  return (
    <Table.Root<GetUsers200DataUsersItem>
      data={users}
      columns={userColumns}
      pagination={tableState.pagination}
      onPaginationChange={tableState.setPagination}
      globalFilter={tableState.globalFilter}
      onGlobalFilterChange={tableState.setGlobalFilter}
      sorting={tableState.sorting}
      onSortingChange={tableState.setSorting}
      columnFilters={tableState.columnFilters}
      onColumnFiltersChange={tableState.setColumnFilters}
      rowSelection={tableState.rowSelection}
      onRowSelectionChange={tableState.setRowSelection}
      manualPagination
      pageCount={Math.ceil(total / tableState.pagination.pageSize)}
      rowCount={total}
      manualFiltering
      enableRowSelection
    >
      <Table.Toolbar
        searchPlaceholder='Search by name or email...'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showCreate
        onCreate={() => push('/dashboard/users/create')}
        showClear
        onClearFilter={() => {
          tableState.setGlobalFilter('');
          tableState.setColumnFilters([]);
        }}
        showColumnVisibility
        showSorting
        showExport
        showBulkActions
        globalFilter={tableState.globalFilter}
      >
        <Button variant='outline' className='border-none' onClick={handleDelete}>
          <IconTrash className='size-5' />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              size='sm'
              className='border-border/60 hover:bg-background h-10 gap-2 rounded-xl border-dashed text-[10px] font-bold uppercase'
            >
              <IconFilter className='text-primary h-3.5 w-3.5' />
              Segment: {tableState.columnFilters.length > 0 ? 'Custom' : 'All'}
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
              onClick={() => applySegment('active')}
              className='py-2 text-[10px] font-bold text-emerald-600 uppercase'
            >
              Active Users
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => applySegment('inactive')}
              className='text-muted-foreground py-2 text-[10px] font-bold uppercase'
            >
              Inactive Users
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => applySegment('admins')}
              className='text-primary py-2 text-[10px] font-bold uppercase'
            >
              Admins
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Advanced Filter Dialog */}
        <AppDialog
          component='drawer'
          title='Advanced Parameters'
          description='Filter by role and active status.'
          trigger={
            <Button
              variant='outline'
              size='sm'
              className='hover:bg-background h-10 gap-2 rounded-xl text-[10px] font-bold uppercase'
            >
              <IconArrowsHorizontal className='h-3.5 w-3.5' />
              Advanced
              {tableState.columnFilters.length > 0 && (
                <span className='bg-primary text-primary-foreground ml-1 flex h-4 w-4 items-center justify-center rounded-full text-[8px]'>
                  {tableState.columnFilters.length}
                </span>
              )}
            </Button>
          }
        >
          <AdvancedFilterContent
            onApply={tableState.setColumnFilters}
            currentFilters={tableState.columnFilters}
          />
        </AppDialog>
      </Table.Toolbar>

      {/* Status filter buttons (outside toolbar) */}
      <div className='border-border/40 bg-background/50 flex flex-wrap items-center justify-between border-b px-6 py-4'>
        <div className='flex flex-wrap gap-2'>
          {userStatusOptions.map((option) => {
            const isActive = tableState.columnFilters.some(
              (f) => f.id === 'status' && f.value === option.value
            );
            return (
              <Button
                key={option.label}
                variant={isActive ? 'default' : 'outline'}
                size='sm'
                className='gap-2 rounded-full px-3 text-xs'
                onClick={() => {
                  if (isActive) {
                    tableState.setColumnFilters(
                      tableState.columnFilters.filter((f) => f.id !== 'status')
                    );
                  } else {
                    tableState.setColumnFilters([
                      ...tableState.columnFilters.filter((f) => f.id !== 'status'),
                      { id: 'status', value: option.value }
                    ]);
                  }
                  tableState.setPagination((prev) => ({ ...prev, pageIndex: 0 }));
                }}
              >
                <option.icon className={cn('h-3.5 w-3.5', option.color)} />
                {option.label}
              </Button>
            );
          })}
        </div>
        <div className='text-primary bg-primary/10 border-primary/20 rounded-full border px-4 py-1.5 text-[10px] leading-none font-black tracking-widest uppercase'>
          {users.length} Results
        </div>
      </div>

      <Table.Grid<GetUsers200DataUsersItem>
        onRowDoubleClick={(row) => push(`/dashboard/users/edit/${row.original.id}`)}
        columnsCount={8}
        isLoading={isLoading}
      />

      <Table.Pagination
        showPageSize
        showTotalRows
        showJumpToPage
        pageSizeOptions={[10, 20, 50, 100]}
      />
    </Table.Root>
  );
}
