'use client';

import {
  IconAlertTriangle,
  IconArrowsHorizontal,
  IconChevronDown,
  IconFilter,
  IconUserCheck,
  IconUserMinus
} from '@tabler/icons-react';
import { type ComponentType, useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '@/components/app-dialog';
import { AdvancedFilterContent } from '@/components/table/advanced-filter-content';
import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserDetailSheet } from '@/domains/users/components/user-detail-sheet';
import { cn } from '@/lib/utils';
import { useGetAdminUsers } from '@/services/-admin-users-get';
import type {
  DtoAdminUserResponse,
  GetAdminUsers200,
  GetAdminUsersParams
} from '@/services/-admin-users-get.schemas';

import { userColumns } from '../components/userColumns';

export function UserManagementTable() {
  const [selectedUser, setSelectedUser] = useState<DtoAdminUserResponse | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const getQueryParams = useCallback((state: TableState, filter: string) => {
    const isActiveFilter = state.columnFilters.find((f) => f.id === 'status')?.value as
      | boolean
      | undefined;
    const roleFilter = state.columnFilters.find((f) => f.id === 'role')?.value as
      | string
      | undefined;

    const params: GetAdminUsersParams = {
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      is_active: isActiveFilter,
      role: roleFilter
    };

    return params;
  }, []);

  const getRows = useCallback(
    (data: GetAdminUsers200 | undefined) => data?.data?.users ?? [],
    []
  );

  const getTotal = useCallback((data: GetAdminUsers200 | undefined) => data?.data?.total ?? 0, []);

  const serverTable = useServerTable({
    columns: userColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: (params) => useGetAdminUsers(params)
  });

  const applySegment = (segment: 'all' | 'active' | 'inactive' | 'admins') => {
    switch (segment) {
      case 'active':
        serverTable.tableState.setColumnFilters([{ id: 'status', value: true }]);
        break;
      case 'inactive':
        serverTable.tableState.setColumnFilters([{ id: 'status', value: false }]);
        break;
      case 'admins':
        serverTable.tableState.setColumnFilters([{ id: 'role', value: 'admin' }]);
        break;
      default:
        serverTable.tableState.setColumnFilters([]);
    }
    toast.success(`Showing ${segment} users`);
  };

  const userStatusOptions = useMemo(
    () => [
      { label: 'Active', value: true, icon: IconUserCheck, color: 'text-emerald-500' },
      { label: 'Inactive', value: false, icon: IconUserMinus, color: 'text-slate-400' }
    ],
    []
  );

  const openUserDetail = (user: DtoAdminUserResponse) => {
    setSelectedUser(user);
    setDetailOpen(true);
  };

  if (serverTable.isError && serverTable.error) {
    const message =
      typeof serverTable.error === 'object' &&
      serverTable.error !== null &&
      'message' in serverTable.error
        ? String((serverTable.error as { message?: string }).message)
        : 'Failed to load users';

    return (
      <div className='rounded-4xl border-2 border-dashed p-16 text-center'>
        <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-bold tracking-tight uppercase italic'>Sync Error</h3>
        <p className='text-muted-foreground text-sm font-medium'>{message}</p>
      </div>
    );
  }

  return (
    <>
      <UserTableContent
        serverTable={serverTable}
        applySegment={applySegment}
        userStatusOptions={userStatusOptions}
        onRowOpen={openUserDetail}
      />
      <UserDetailSheet user={selectedUser} open={detailOpen} onOpenChange={setDetailOpen} />
    </>
  );
}

function UserTableContent({
  serverTable,
  applySegment,
  userStatusOptions,
  onRowOpen
}: {
  serverTable: ReturnType<typeof useServerTable<DtoAdminUserResponse, GetAdminUsers200, GetAdminUsersParams>>;
  applySegment: (segment: 'all' | 'active' | 'inactive' | 'admins') => void;
  userStatusOptions: Array<{
    label: string;
    value: boolean;
    icon: ComponentType<{ className?: string }>;
    color: string;
  }>;
  onRowOpen: (user: DtoAdminUserResponse) => void;
}) {
  const { tableState, isLoading, isFetching, refetch, total } = serverTable;

  return (
    <Table.Root {...serverTable.rootProps}>
      <Table.Toolbar
        searchPlaceholder='Search by name or email...'
        showRefresh
        onRefresh={refetch}
        isLoading={isFetching}
        showClear
        onClearFilter={() => tableState.resetFilters()}
        showColumnVisibility
        showSorting
        showExport
      >
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

        <AppDialog
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
                }}
              >
                <option.icon className={cn('h-3.5 w-3.5', option.color)} />
                {option.label}
              </Button>
            );
          })}
        </div>
        <div className='text-primary bg-primary/10 border-primary/20 rounded-full border px-4 py-1.5 text-[10px] leading-none font-black tracking-widest uppercase'>
          {total.toLocaleString()} Results
        </div>
      </div>

      <Table.Grid<DtoAdminUserResponse>
        onRowDoubleClick={(row) => onRowOpen(row.original)}
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
