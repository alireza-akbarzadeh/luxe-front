'use client';
import {
  IconAdjustmentsHorizontal,
  IconAlertTriangle,
  IconClock,
  IconRefresh,
  IconUserCheck,
  IconUserMinus,
  IconX
} from '@tabler/icons-react';
import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Table } from '@/components/table/data-table';
import { useTableContext } from '@/components/table/table-context';
import { Button } from '@/components/ui/button';
import { ContextMenuItem, ContextMenuShortcut } from '@/components/ui/context-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { useOrdersQueryState } from '@/domains/orders/hooks/useOrderFilterQuery';
import { useOrdersFilterStore } from '@/domains/orders/hooks/useOrderFilterStore';
import { mapApiOrdersToDomain, mapUiStatusToApi } from '@/domains/orders/order.utils';
import type { Order, OrderStatus } from '@/domains/orders/orders-types';
import { OrdersAdvancedFilter } from '@/domains/orders/sections/orders-advanced-filter';
import { orderColumns } from '@/domains/orders/sections/orders-columns';
import { exportToCSV } from '@/lib/export-file';
import { useGetOrders } from '@/services/-orders-get';

const STATUS_TABS: readonly (OrderStatus | 'All')[] = [
  'All',
  'Pending',
  'Processing',
  'Fulfilled',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded'
];

export default function OrdersTable() {
  const {
    search,
    setSearch,
    statusTab,
    setStatusTab,
    sortKey,
    setSortKey,
    sortDir,
    setSortDir,
    page,
    setPage,
    pageSize,
    setPageSize,
    filters: advancedFilters,
    minTotal,
    maxTotal,
    resetAllFilters
  } = useOrdersQueryState();

  const { advancedOpen, setAdvancedOpen } = useOrdersFilterStore();
  const deferredSearch = React.useDeferredValue(search);

  const queryParams = React.useMemo(
    () => ({
      limit: pageSize,
      offset: page * pageSize,
      search: deferredSearch.trim() || undefined,
      status: mapUiStatusToApi(statusTab as OrderStatus | 'All'),
      min_amount: minTotal ?? undefined,
      max_amount: maxTotal ?? undefined
    }),
    [pageSize, page, deferredSearch, statusTab, minTotal, maxTotal]
  );

  const { data, isLoading, isFetching, isError, error, refetch } = useGetOrders(queryParams);

  const orders = React.useMemo(
    () => mapApiOrdersToDomain(data?.data?.orders),
    [data?.data?.orders]
  );
  const total = data?.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const sorting: SortingState = sortKey ? [{ id: sortKey, desc: sortDir === 'desc' }] : [];

  const derivedColumnFilters = React.useMemo(() => {
    const filters: ColumnFiltersState = [];

    if (statusTab !== 'All') {
      filters.push({ id: 'status', value: [statusTab] });
    }

    advancedFilters.forEach((filter) => {
      if (['status', 'payment_status', 'channel', 'priority'].includes(filter.id)) {
        if (filter.id === 'status' && statusTab !== 'All') return;
        filters.push({ id: filter.id, value: filter.value });
      }
    });

    return filters;
  }, [statusTab, advancedFilters]);

  const handleSortingChange = async (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => {
    const newSorting = typeof updater === 'function' ? updater(sorting) : updater;
    const sort = newSorting[0];

    if (sort) {
      const validSortKeys = ['order_number', 'total', 'ordered_at'] as const;
      if ((validSortKeys as readonly string[]).includes(sort.id)) {
        await setSortKey(sort.id as (typeof validSortKeys)[number]);
        await setSortDir(sort.desc ? 'desc' : 'asc');
      }
    } else {
      await setSortKey(null);
      await setSortDir('asc');
    }
    await setPage(0);
  };

  const handleColumnFiltersChange = async (
    updater: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)
  ) => {
    const newFilters = typeof updater === 'function' ? updater(derivedColumnFilters) : updater;

    const statusFilter = newFilters.find((f) => f.id === 'status');
    const filterValue = statusFilter ? (statusFilter.value as string[])[0] : undefined;
    const newStatus = filterValue ? (filterValue as OrderStatus) : 'All';

    if (newStatus !== statusTab) {
      await setStatusTab(newStatus);
      await setPage(0);
    }
  };

  const handlePaginationChange = async (
    updater:
      | {
          pageIndex: number;
          pageSize: number;
        }
      | ((old: { pageIndex: number; pageSize: number }) => { pageIndex: number; pageSize: number })
  ) => {
    const newPagination =
      typeof updater === 'function' ? updater({ pageIndex: page, pageSize }) : updater;
    await setPage(newPagination.pageIndex);
    await setPageSize(newPagination.pageSize);
  };

  const handleGlobalFilterChange = async (updaterOrValue: string | ((old: string) => string)) => {
    const newSearch = typeof updaterOrValue === 'function' ? updaterOrValue(search) : updaterOrValue;
    if (newSearch !== search) {
      await setSearch(newSearch ?? '');
      await setPage(0);
    }
  };

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load orders';

    return (
      <div className='rounded-2xl border-2 border-dashed p-16 text-center'>
        <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
        <h3 className='text-lg font-bold tracking-tight uppercase italic'>Orders unavailable</h3>
        <p className='text-muted-foreground text-sm font-medium'>{message}</p>
        <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <Table.Root
      data={orders}
      columns={orderColumns}
      pagination={{ pageIndex: page, pageSize }}
      onPaginationChange={handlePaginationChange}
      globalFilter={search}
      onGlobalFilterChange={handleGlobalFilterChange}
      sorting={sorting}
      onSortingChange={handleSortingChange}
      columnFilters={derivedColumnFilters}
      onColumnFiltersChange={handleColumnFiltersChange}
      manualPagination
      manualFiltering
      manualSorting
      pageCount={pageCount}
      rowCount={total}
      enableRowSelection
    >
      <OrdersTableContent
        resetAllFilters={resetAllFilters}
        search={search}
        derivedColumnFilters={derivedColumnFilters}
        advancedFilters={advancedFilters}
        setAdvancedOpen={setAdvancedOpen}
        advancedOpen={advancedOpen}
        total={total}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    </Table.Root>
  );
}

function OrdersTableContent({
  resetAllFilters,
  setAdvancedOpen,
  advancedOpen,
  search,
  derivedColumnFilters,
  advancedFilters,
  total,
  isLoading,
  isFetching
}: {
  resetAllFilters: () => Promise<void>;
  setAdvancedOpen: (open: boolean) => void;
  advancedOpen: boolean;
  search: string;
  derivedColumnFilters: ColumnFiltersState;
  advancedFilters: Array<{
    id: string;
    value: string[] | ((old: string[]) => string[] | null) | null;
  }>;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
}) {
  const { table } = useTableContext<Order>();
  const router = useRouter();

  const handleExport = () => {
    const rows = table.getSelectedRowModel().rows;
    const exportData = (rows.length ? rows : table.getRowModel().rows).map((row) => ({
      order_number: row.original.order_number,
      customer: row.original.customer_name,
      email: row.original.customer_email,
      status: row.original.status,
      payment: row.original.payment_status,
      total: row.original.total,
      channel: row.original.channel,
      date: row.original.ordered_at
    }));
    if (!exportData.length) {
      toast.error('No orders to export');
      return;
    }
    exportToCSV(exportData, {
      filename: 'orders-export.csv',
      successMessage: `Exported ${exportData.length} orders`
    });
  };

  const handleReset = async () => {
    await resetAllFilters();
    table.resetColumnFilters();
    table.resetGlobalFilter();
    table.resetSorting();
  };

  const hasFilters = derivedColumnFilters.length > 0 || !!search;

  return (
    <div className='space-y-0'>
      <div className='bg-muted/5 border-border/40 flex flex-col items-center gap-3 border-b px-6 py-5 md:flex-row'>
        <div className='w-full flex-1 md:w-auto'>
          <Table.Search placeholder='Search by order #, customer name or email…' />
        </div>

        <div className='flex w-full items-center gap-2 md:w-auto'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => setAdvancedOpen(true)}
            className='h-9 gap-2 rounded-xl border-dashed text-[10px] font-bold tracking-wide uppercase'
          >
            <IconAdjustmentsHorizontal className='h-3.5 w-3.5' />
            Advanced
            {advancedFilters.length > 0 && (
              <span className='bg-primary text-primary-foreground flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-black'>
                {advancedFilters.length}
              </span>
            )}
          </Button>

          {hasFilters && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleReset}
              className='text-destructive hover:bg-destructive/5 h-9 gap-1.5 rounded-xl px-3 text-[10px] font-black uppercase'
            >
              <IconX className='h-3 w-3' /> Reset
            </Button>
          )}

          <div className='bg-border mx-2 hidden h-4 w-px md:block' />

          <Table.FilterTabs
            columnId='status'
            options={STATUS_TABS.map((tab) => (tab === 'All' ? 'All' : tab))}
          />

          <div className='bg-primary/10 border-primary/20 text-primary rounded-full border px-4 py-1.5 text-[10px] leading-none font-black tracking-widest uppercase'>
            {isFetching ? 'Loading…' : `${total.toLocaleString()} Results`}
          </div>
        </div>
      </div>

      <div className='bg-background/50 border-border/40 flex items-center justify-between border-b px-6 py-4'>
        <Table.StatusFilters
          columnId='status'
          title='Order Status'
          options={[
            { label: 'Pending', icon: IconClock, color: 'text-amber-500' },
            { label: 'Processing', icon: IconClock, color: 'text-amber-500' },
            { label: 'Fulfilled', icon: IconUserCheck, color: 'text-emerald-500' },
            { label: 'Shipped', icon: IconUserCheck, color: 'text-emerald-500' },
            { label: 'Delivered', icon: IconUserCheck, color: 'text-emerald-500' },
            { label: 'Cancelled', icon: IconUserMinus, color: 'text-destructive' },
            { label: 'Refunded', icon: IconRefresh, color: 'text-muted-foreground' }
          ]}
        />

        <div className='flex items-center gap-3'>
          <Table.BulkActions
            onDelete={(rows) => toast.error(`Cancelling ${rows.length} orders`)}
            onDownload={handleExport}
            deleteTitle='Cancel Orders'
            deleteDescription='This action cannot be undone. Orders will be cancelled immediately.'
          />
        </div>
      </div>

      <div className='p-2'>
        <Table.Grid<Order>
          isLoading={isLoading}
          onRowDoubleClick={(row) => router.push(`/dashboard/orders/${row.original.id}`)}
          getDetailsUrl={(row) => `/dashboard/orders/${row.original.id}`}
          extendMenuActions={(row) => {
            const order = row.original;
            return (
              <>
                <ContextMenuItem disabled={order.status === 'Fulfilled'}>
                  Mark as Shipped
                  <ContextMenuShortcut>⌘⇧S</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem className='text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/30'>
                  Cancel Order
                </ContextMenuItem>
              </>
            );
          }}
        />
      </div>

      <div className='border-border/40 border-t px-6 py-4'>
        <Table.Pagination />
      </div>

      <Sheet open={advancedOpen} onOpenChange={setAdvancedOpen}>
        <SheetContent side='right' className='flex w-full max-w-md flex-col p-0'>
          <SheetHeader className='border-b px-6 py-5'>
            <SheetTitle className='text-sm font-black tracking-widest uppercase'>
              Advanced Filters
            </SheetTitle>
            <SheetDescription className='text-muted-foreground text-xs'>
              Narrow orders by status, payment, channel and more.
            </SheetDescription>
          </SheetHeader>
          <div className='flex-1 overflow-hidden'>
            <OrdersAdvancedFilter onClose={() => setAdvancedOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
