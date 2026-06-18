'use client';

import { IconAdjustments, IconHistory, IconPencil } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInventoryQueryState } from '@/domains/inventory-admin/hooks/use-inventory-query';
import { INVENTORY_STOCK_TABS } from '@/domains/inventory-admin/inventory.schema';
import {
  getInventoryItemsFromListResponse,
  getInventoryTotalFromListResponse
} from '@/domains/inventory-admin/lib/inventory-list';
import { InventoryActivityFeed } from '@/domains/inventory-admin/sections/inventory-activity-feed';
import { InventoryAdjustDialog } from '@/domains/inventory-admin/sections/inventory-adjust-dialog';
import { inventoryColumns } from '@/domains/inventory-admin/sections/inventory-columns';
import { InventoryHistorySheet } from '@/domains/inventory-admin/sections/inventory-history-sheet';
import { InventoryOverview } from '@/domains/inventory-admin/sections/inventory-overview';
import { useInventoryStore } from '@/domains/inventory-admin/stores/inventory-store';
import {
  useGetAdminInventory,
  useGetAdminInventoryOverview
} from '@/services/-admin-inventory';
import type { InventoryStockStatus } from '@/services/-admin-inventory.schemas';
import type {
  DtoInventoryItemResponse,
  GetAdminInventory200
} from '@/services/-admin-inventory.schemas';

export function InventoryAdminDomain() {
  const { push } = useRouter();
  const { stockStatus, setStockStatus, sort } = useInventoryQueryState();
  const openAdjust = useInventoryStore((state) => state.openAdjust);
  const openHistory = useInventoryStore((state) => state.openHistory);

  const { data: overviewData, isLoading: isOverviewLoading } = useGetAdminInventoryOverview();
  const overview = overviewData?.data;

  const getQueryParams = useCallback(
    (state: TableState, filter: string) => ({
      page: state.pagination.pageIndex + 1,
      limit: state.pagination.pageSize,
      search: filter || undefined,
      stock_status: stockStatus === 'all' ? undefined : stockStatus,
      sort
    }),
    [sort, stockStatus]
  );

  const getRows = useCallback(
    (data: GetAdminInventory200 | undefined) => getInventoryItemsFromListResponse(data),
    []
  );

  const getTotal = useCallback(
    (data: GetAdminInventory200 | undefined) => getInventoryTotalFromListResponse(data),
    []
  );

  const serverTable = useServerTable({
    columns: inventoryColumns,
    initialPageSize: 15,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useGetAdminInventory
  });

  return (
    <Flex direction='column' spacing={6}>
      <div>
        <h1 className='text-2xl font-semibold tracking-tight'>Inventory</h1>
        <p className='text-muted-foreground mt-1 text-sm'>
          Monitor stock levels, waitlists, and apply audited adjustments across your catalog.
        </p>
      </div>

      <InventoryOverview
        overview={overview}
        isLoading={isOverviewLoading}
        activeStatus={stockStatus}
        onStatusSelect={(status) => void setStockStatus(status as InventoryStockStatus)}
      />

      <div className='grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]'>
        <Table.Root {...serverTable.rootProps}>
          <Tabs
            value={stockStatus}
            onValueChange={(value) => void setStockStatus(value as InventoryStockStatus)}
            className='px-1'
          >
            <TabsList className='mb-3 h-auto flex-wrap'>
              {INVENTORY_STOCK_TABS.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Table.Toolbar
            searchPlaceholder='Search by name or SKU'
            showRefresh
            onRefresh={serverTable.refetch}
            isLoading={serverTable.isFetching}
            showClear
            showColumnVisibility
          />

          <Table.Grid<DtoInventoryItemResponse>
            isLoading={serverTable.isLoading && serverTable.rows.length === 0}
            onRowDoubleClick={(row) => {
              const id = row.original.id;
              if (id) push(`/dashboard/products/edit/${id}`);
            }}
            extendMenuActions={(row) => (
              <>
                <DropdownMenuItem
                  className='gap-2 text-[11px] font-semibold'
                  onClick={() => openAdjust(row.original)}
                >
                  <IconAdjustments className='size-3.5' />
                  Adjust stock
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='gap-2 text-[11px] font-semibold'
                  onClick={() => row.original.id && openHistory(row.original.id)}
                >
                  <IconHistory className='size-3.5' />
                  View history
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='gap-2 text-[11px] font-semibold'
                  onClick={() => row.original.id && push(`/dashboard/products/edit/${row.original.id}`)}
                >
                  <IconPencil className='size-3.5' />
                  Edit product
                </DropdownMenuItem>
              </>
            )}
          />

          <Table.Pagination
            showPageSize
            showTotalRows
            showJumpToPage
            pageSizeOptions={[10, 15, 20, 50, 100]}
          />
        </Table.Root>

        <InventoryActivityFeed />
      </div>

      <InventoryAdjustDialog />
      <InventoryHistorySheet />
    </Flex>
  );
}
