'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useShipmentsQueryState } from '@/domains/shipments-admin/hooks/use-shipments-query';
import {
  getShipmentsFromListResponse,
  getShipmentsTotalFromListResponse
} from '@/domains/shipments-admin/lib/shipment-list';
import type { ShipmentStatusFilter } from '@/domains/shipments-admin/shipments.schema';
import { SHIPMENT_STATUS_TABS } from '@/domains/shipments-admin/shipments.schema';
import {
  shipmentColumns,
  shipmentRowMenuActions
} from '@/domains/shipments-admin/sections/shipments-columns';
import { useGetAdminShipments } from '@/services/-admin-shipments-get';
import type { DtoAdminShipmentListItem, GetAdminShipments200 } from '@/services/-admin-shipments-get.schemas';

export function ShipmentsTable() {
  const router = useRouter();
  const { status, setStatus } = useShipmentsQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: status === 'all' ? undefined : status
    }),
    [status]
  );

  const getRows = useCallback(
    (data: GetAdminShipments200 | undefined) => getShipmentsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminShipments200 | undefined) => getShipmentsTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: shipmentColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminShipments
  });

  const openShipment = useCallback(
    (id: number) => {
      router.push(`/dashboard/shipments/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <div className='rounded-xl border border-dashed p-12 text-center'>
        <p className='text-lg font-semibold'>Shipments unavailable</p>
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
        onValueChange={(value) => void setStatus(value as ShipmentStatusFilter)}
        className='px-1'
      >
        <TabsList className='mb-3 h-auto flex-wrap'>
          {SHIPMENT_STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Table.Toolbar
        searchPlaceholder='Search tracking, order #, or carrier'
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

      <Table.Grid<DtoAdminShipmentListItem>
        isLoading={serverTable.isLoading && serverTable.rows.length === 0}
        onRowDoubleClick={(row) => row.original.id && openShipment(row.original.id)}
        getDetailsUrl={(row) =>
          row.original.id ? `/dashboard/shipments/${row.original.id}` : '/dashboard/shipments'
        }
        extendMenuActions={(row) => shipmentRowMenuActions(row.original, openShipment)}
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
