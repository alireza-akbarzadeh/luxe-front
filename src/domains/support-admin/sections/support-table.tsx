'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSupportQueryState } from '@/domains/support-admin/hooks/use-support-query-state';
import {
  type DtoSupportTicketResponse,
  type GetAdminSupportTickets200,
  getTicketsFromListResponse,
  getTicketsTotalFromListResponse
} from '@/domains/support-admin/lib/support-list';
import type {
  SupportChannelFilter,
  SupportStatusFilter
} from '@/domains/support-admin/schemas/support.schema';
import {
  SUPPORT_CHANNEL_TABS,
  SUPPORT_STATUS_TABS
} from '@/domains/support-admin/schemas/support.schema';
import {
  createSupportColumns,
  supportRowMenuActions
} from '@/domains/support-admin/sections/support-columns';
import { useGetAdminSupportTickets } from '@/services/-admin-support-tickets-get';

export function SupportTable() {
  const router = useRouter();
  const { status, setStatus, channel, setChannel } = useSupportQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      status: status === 'all' ? undefined : status,
      channel: channel === 'all' ? undefined : channel,
      search: filter.trim() || undefined
    }),
    [status, channel]
  );

  const getRows = useCallback(
    (data: GetAdminSupportTickets200 | undefined) => getTicketsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminSupportTickets200 | undefined) => getTicketsTotalFromListResponse(data),
    []
  );

  const columns = useMemo(() => createSupportColumns(), []);

  const serverTable = useServerTable({
    columns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminSupportTickets,
    manualFiltering: false
  });

  const openTicket = useCallback(
    (id: number) => {
      router.push(`/dashboard/support/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Support tickets unavailable</p>
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
        value={channel}
        onValueChange={(value) => void setChannel(value as SupportChannelFilter)}
        className='px-1'
      >
        <TabsList className='mb-2 h-auto flex-wrap'>
          {SUPPORT_CHANNEL_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Tabs
        value={status}
        onValueChange={(value) => void setStatus(value as SupportStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {SUPPORT_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search subject, email, or customer'
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

      <Table.Grid<DtoSupportTicketResponse>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openTicket(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id ? `/dashboard/support/${row.original.id}` : '/dashboard/support'
        }
        extendMenuActions={(row) => supportRowMenuActions(row.original, openTicket)}
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
