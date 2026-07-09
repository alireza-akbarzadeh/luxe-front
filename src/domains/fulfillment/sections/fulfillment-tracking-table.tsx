'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import {
  getShipmentsFromListResponse,
  getShipmentsTotalFromListResponse
} from '@/domains/shipments-admin/lib/shipment-list';
import {
  shipmentColumns,
  shipmentRowMenuActions
} from '@/domains/shipments-admin/sections/shipments-columns';
import { useGetAdminShipments } from '@/services/-admin-shipments-get';
import type {
  DtoAdminShipmentListItem,
  GetAdminShipments200
} from '@/services/-admin-shipments-get.schemas';

export function FulfillmentTrackingTable() {
  const router = useRouter();

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: 'shipped'
    }),
    []
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
        <p className='text-lg font-semibold'>Tracking data unavailable</p>
        <p className='text-muted-foreground mt-1 text-sm'>Check your connection and try again.</p>
        <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <Table.Root {...serverTable.rootProps}>
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
          row.original.id ? `/dashboard/shipments/${row.original.id}` : '/dashboard/fulfillment'
        }
        extendMenuActions={(row) => shipmentRowMenuActions(row.original, openShipment)}
      />

      <Table.Pagination showPageSize showTotalRows showJumpToPage pageSizeOptions={[10, 20, 50]} />
    </Table.Root>
  );
}
