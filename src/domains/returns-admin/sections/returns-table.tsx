'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReturnsQueryState } from '@/domains/returns-admin/hooks/use-returns-query';
import {
  type DtoReturnResponse,
  type GetAdminReturns200,
  getReturnsFromListResponse,
  getReturnsTotalFromListResponse} from '@/domains/returns-admin/lib/return-list';
import type { ReturnStatusFilter } from '@/domains/returns-admin/returns.schema';
import { RETURN_STATUS_TABS } from '@/domains/returns-admin/returns.schema';
import { returnColumns, returnRowMenuActions } from '@/domains/returns-admin/sections/returns-columns';
import { useGetAdminReturns } from '@/services/-admin-returns-get';

export function ReturnsTable() {
  const router = useRouter();
  const { status, setStatus } = useReturnsQueryState();

  const getQueryParams = useCallback(
    (state: TableState) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      status: status === 'all' ? undefined : status
    }),
    [status]
  );

  const getRows = useCallback(
    (data: GetAdminReturns200 | undefined) => getReturnsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminReturns200 | undefined) => getReturnsTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: returnColumns,
    initialPageSize: 20,
    getQueryParams: (state) => getQueryParams(state),
    getRows,
    getTotal,
    useQuery: useGetAdminReturns,
    manualFiltering: false
  });

  const openReturn = useCallback(
    (id: number) => {
      router.push(`/dashboard/returns/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Returns unavailable</p>
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
        onValueChange={(value) => void setStatus(value as ReturnStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {RETURN_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        showSearch={false}
        showRefresh
        onRefresh={serverTable.refetch}
        isLoading={serverTable.isFetching}
        showClear={false}
        showColumnVisibility
        showSorting={false}
        showExport={false}
        showBulkActions={false}
      />

      <Table.Grid<DtoReturnResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openReturn(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id ? `/dashboard/returns/${row.original.id}` : '/dashboard/returns'
        }
        extendMenuActions={(row) => returnRowMenuActions(row.original, openReturn)}
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
