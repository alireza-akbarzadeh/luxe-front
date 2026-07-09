'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useReturnTransition } from '@/domains/returns-admin/hooks/use-return-transition';
import { useReturnsQueryState } from '@/domains/returns-admin/hooks/use-returns-query';
import {
  type DtoReturnResponse,
  type GetAdminReturns200,
  getReturnsFromListResponse,
  getReturnsTotalFromListResponse
} from '@/domains/returns-admin/lib/return-list';
import type { ReturnStatusFilter, ReturnTypeFilter } from '@/domains/returns-admin/returns.schema';
import { RETURN_STATUS_TABS, RETURN_TYPE_TABS } from '@/domains/returns-admin/returns.schema';
import {
  createReturnColumns,
  returnRowMenuActions
} from '@/domains/returns-admin/sections/returns-columns';
import { useGetAdminReturns } from '@/services/-admin-returns-get';

export function ReturnsTable() {
  const router = useRouter();
  const { status, setStatus, returnType, setReturnType } = useReturnsQueryState();

  const { applyTransition, isPending } = useReturnTransition();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      status: status === 'all' ? undefined : status,
      return_type: returnType === 'all' ? undefined : returnType,
      search: filter.trim() || undefined
    }),
    [status, returnType]
  );

  const getRows = useCallback(
    (data: GetAdminReturns200 | undefined) => getReturnsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminReturns200 | undefined) => getReturnsTotalFromListResponse(data),
    []
  );

  const handleQuickApprove = useCallback(
    (returnItem: DtoReturnResponse) => {
      if (!returnItem.id) return;
      void applyTransition(returnItem.id, 'approve');
    },
    [applyTransition]
  );

  const handleQuickReject = useCallback(
    (returnItem: DtoReturnResponse) => {
      if (!returnItem.id) return;
      void applyTransition(returnItem.id, 'reject');
    },
    [applyTransition]
  );

  const columns = useMemo(
    () =>
      createReturnColumns({
        onQuickApprove: handleQuickApprove,
        onQuickReject: handleQuickReject,
        isActionPending: isPending
      }),
    [handleQuickApprove, handleQuickReject, isPending]
  );

  const serverTable = useServerTable({
    columns,
    initialPageSize: 20,
    getQueryParams,
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
        value={returnType}
        onValueChange={(value) => void setReturnType(value as ReturnTypeFilter)}
        className='px-1'
      >
        <TabsList className='mb-2 h-auto flex-wrap'>
          {RETURN_TYPE_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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
        searchPlaceholder='Search reason, order #, or customer'
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
