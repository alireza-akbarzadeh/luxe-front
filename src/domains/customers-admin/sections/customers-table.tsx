'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type CustomerRoleFilter,
  CustomerRoleFilterSelect
} from '@/domains/customers-admin/components/customer-role-filter';
import { CustomerSegmentPicker } from '@/domains/customers-admin/components/customer-segment-picker';
import type { CustomerSegment } from '@/domains/customers-admin/lib/customer-segments';
import {
  customerColumns,
  customerRowMenuActions
} from '@/domains/customers-admin/sections/customers-columns';
import { useGetAdminUsers } from '@/services/-admin-users-get';
import type {
  DtoAdminUserResponse,
  GetAdminUsers200,
  GetAdminUsersParams
} from '@/services/-admin-users-get.schemas';

export function CustomersTable() {
  const router = useRouter();
  const [segment, setSegment] = useState<CustomerSegment>('');
  const [tier, setTier] = useState<'all' | 'plus' | 'free'>('all');
  const [role, setRole] = useState<CustomerRoleFilter>('all');

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => {
      const params: GetAdminUsersParams = {
        limit: state.pagination.pageSize,
        offset: state.pagination.pageIndex * state.pagination.pageSize,
        search: filter.trim() || undefined,
        role: role === 'all' ? undefined : role,
        customer_segment: segment || undefined,
        membership_tier: tier === 'all' ? undefined : tier
      };
      return params;
    },
    [role, segment, tier]
  );

  const getRows = useCallback((data: GetAdminUsers200 | undefined) => data?.data?.users ?? [], []);
  const getTotal = useCallback((data: GetAdminUsers200 | undefined) => data?.data?.total ?? 0, []);

  const columns = useMemo(
    () =>
      role === 'user'
        ? customerColumns.filter(
            (column) =>
              column.id !== 'role' && !('accessorKey' in column && column.accessorKey === 'role')
          )
        : customerColumns,
    [role]
  );

  const serverTable = useServerTable({
    columns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminUsers
  });

  const openCustomer = useCallback(
    (id: number) => {
      router.push(`/dashboard/customers/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Customers unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button variant='outline' className='mt-4' onClick={() => void serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table.Root {...serverTable.rootProps}>
      <Flex direction='row' wrap='wrap' align='center' className='gap-2 px-1 pb-3'>
        <CustomerRoleFilterSelect value={role} onValueChange={setRole} />
        <Tabs value={tier} onValueChange={(value) => setTier(value as 'all' | 'plus' | 'free')}>
          <TabsList className='h-10 rounded-xl'>
            <TabsTrigger value='all' className='text-[10px] font-bold uppercase'>
              All tiers
            </TabsTrigger>
            <TabsTrigger value='plus' className='text-[10px] font-bold uppercase'>
              Plus
            </TabsTrigger>
            <TabsTrigger value='free' className='text-[10px] font-bold uppercase'>
              Free
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <CustomerSegmentPicker value={segment} onSelect={setSegment} />
      </Flex>

      <Table.Toolbar
        searchPlaceholder='Search name or email'
        showSearch
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showClear
        showColumnVisibility
        showSorting={false}
        showExport={false}
        showBulkActions={false}
      />

      <Table.Grid<DtoAdminUserResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openCustomer(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id ? `/dashboard/customers/${row.original.id}` : '/dashboard/customers'
        }
        extendMenuActions={(row) => customerRowMenuActions(row.original, openCustomer)}
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
