'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVendorsQueryState } from '@/domains/vendors-admin/hooks/use-vendors-query-state';
import {
  getVendorsFromListResponse,
  getVendorsTotalFromListResponse
} from '@/domains/vendors-admin/lib/vendors-list';
import type { VendorStatusFilter } from '@/domains/vendors-admin/schemas/vendors.schema';
import { VENDOR_STATUS_TABS } from '@/domains/vendors-admin/schemas/vendors.schema';
import { createVendorColumns } from '@/domains/vendors-admin/sections/vendors-columns';
import { useGetAdminStores } from '@/services/-admin-stores-get';
import type { DtoAdminStoreResponse, GetAdminStores200 } from '@/services/-admin-stores-get.schemas';

export function VendorsTable() {
  const router = useRouter();
  const { status, setStatus } = useVendorsQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: status === 'all' ? undefined : status,
      sort_by: 'newest' as const
    }),
    [status]
  );

  const getRows = useCallback(
    (data: GetAdminStores200 | undefined) => getVendorsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminStores200 | undefined) => getVendorsTotalFromListResponse(data),
    []
  );

  const openVendor = useCallback(
    (store: DtoAdminStoreResponse) => {
      if (!store.id) return;
      router.push(`/dashboard/vendors/${store.id}`);
    },
    [router]
  );

  const columns = useMemo(() => createVendorColumns({ onOpen: openVendor }), [openVendor]);

  const serverTable = useServerTable({
    columns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminStores,
    manualFiltering: false
  });

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Vendors unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table.Root {...serverTable.rootProps}>
      <Tabs
        value={status}
        onValueChange={(value) => void setStatus(value as VendorStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {VENDOR_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search by name or description…'
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showClear
        showColumnVisibility
        showBulkActions={false}
      />

      <Table.Grid<DtoAdminStoreResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openVendor(row.original)}
        getDetailsUrl={(row) =>
          row.original.id ? `/dashboard/vendors/${row.original.id}` : '/dashboard/vendors'
        }
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
