'use client';

import { useCallback, useState } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWebhooksQueryState } from '@/domains/webhooks-admin/hooks/use-webhooks-query';
import {
  type GetAdminWebhooks200,
  getWebhooksFromListResponse,
  getWebhooksTotalFromListResponse,
  WEBHOOK_STATUS_TABS,
  type WebhookEvent,
  type WebhookStatusFilter
} from '@/domains/webhooks-admin/lib/webhook-list';
import { webhookColumns } from '@/domains/webhooks-admin/sections/webhook-columns';
import { WebhookDetailSheet } from '@/domains/webhooks-admin/sections/webhook-detail-sheet';
import { useGetAdminWebhooks } from '@/services/-admin-webhooks-get';
import type { GetAdminWebhooksParams } from '@/services/-admin-webhooks-get.schemas';

export function WebhooksTable() {
  const { status, setStatus } = useWebhooksQueryState();
  const [selectedEvent, setSelectedEvent] = useState<WebhookEvent | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => {
      const params: GetAdminWebhooksParams = {
        limit: state.pagination.pageSize,
        offset: state.pagination.pageIndex * state.pagination.pageSize,
        event_type: filter.trim() || undefined,
        status: status === 'all' ? undefined : status
      };

      return params;
    },
    [status]
  );

  const getRows = useCallback(
    (data: unknown) => getWebhooksFromListResponse(data as GetAdminWebhooks200 | undefined),
    []
  );

  const getTotal = useCallback(
    (data: unknown) => getWebhooksTotalFromListResponse(data as GetAdminWebhooks200 | undefined),
    []
  );

  const serverTable = useServerTable({
    columns: webhookColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    enableRowSelection: false,
    useQuery: useGetAdminWebhooks
  });

  const openDetail = useCallback((event: WebhookEvent) => {
    setSelectedEvent(event);
    setDetailOpen(true);
  }, []);

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Webhook events unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table.Root {...serverTable.rootProps}>
        <Tabs
          value={status}
          onValueChange={(value) => void setStatus(value as WebhookStatusFilter)}
          className='px-1'
        >
          <TabsList className='mb-3 h-auto flex-wrap'>
            {WEBHOOK_STATUS_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Table.Toolbar
          searchPlaceholder='Filter by event type (exact match)…'
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showClear
          showColumnVisibility
          showSorting={false}
          showExport={false}
          showBulkActions={false}
          showCreate={false}
        />

        <Table.Grid<WebhookEvent>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => openDetail(row.original)}
        />

        <Table.Pagination
          showPageSize
          showTotalRows
          showJumpToPage
          pageSizeOptions={[10, 20, 50, 100]}
        />
      </Table.Root>

      <WebhookDetailSheet event={selectedEvent} open={detailOpen} onOpenChange={setDetailOpen} />
    </>
  );
}
