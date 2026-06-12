'use client';
import {
  IconAdjustmentsHorizontal,
  IconClock,
  IconRefresh,
  IconUserCheck,
  IconUserMinus,
  IconX
} from '@tabler/icons-react';
import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import { Table } from '@/components/table/data-table';
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
import type { Order, OrderStatus } from '@/domains/orders/orders-types';
import { OrdersAdvancedFilter } from '@/domains/orders/sections/orders-advanced-filter';
import { orderColumns } from '@/domains/orders/sections/orders-columns';
import { exportToCSV } from '@/lib/export-file';

interface OrdersTableProps {
  data: Order[];
}

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

export default function OrdersTable({ data }: OrdersTableProps) {
  const router = useRouter();

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
    resetAllFilters
  } = useOrdersQueryState();

  const { advancedOpen, setAdvancedOpen } = useOrdersFilterStore();

  // 1. Derive sorting state directly
  const sorting: SortingState = sortKey ? [{ id: sortKey, desc: sortDir === 'desc' }] : [];

  // 2. DERIVE columnFilters directly from URL state (Removes 3 useEffects entirely!)
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

  // Create table instance
  const table = useReactTable({
    data,
    columns: orderColumns,
    state: {
      sorting,
      columnFilters: derivedColumnFilters,
      pagination: { pageIndex: page, pageSize },
      globalFilter: search
    },
    onSortingChange: async (updater) => {
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
    },
    onColumnFiltersChange: async (updater) => {
      const newFilters = typeof updater === 'function' ? updater(derivedColumnFilters) : updater;

      const statusFilter = newFilters.find((f) => f.id === 'status');
      const filterValue = statusFilter ? (statusFilter.value as string[])[0] : undefined;
      const newStatus = filterValue ? (filterValue as OrderStatus) : 'All';

      if (newStatus !== statusTab) {
        await setStatusTab(newStatus);
        await setPage(0);
      }
    },
    onPaginationChange: async (updater) => {
      const newPagination =
        typeof updater === 'function' ? updater({ pageIndex: page, pageSize }) : updater;
      await setPage(newPagination.pageIndex);
      await setPageSize(newPagination.pageSize);
    },
    onGlobalFilterChange: async (updater) => {
      const newValue = typeof updater === 'function' ? updater(search) : updater;
      const newSearch = newValue ?? '';
      if (newSearch !== search) {
        await setSearch(newSearch);
        await setPage(0);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      multiSelect: (row, columnId, filterValue) => {
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return true;
        const rowValue = String(row.getValue(columnId)).toLowerCase();
        if (Array.isArray(filterValue)) {
          return filterValue.some((val) => String(val).toLowerCase() === rowValue);
        }
        return String(filterValue).toLowerCase() === rowValue;
      }
    },
    globalFilterFn: (row: Row<Order>, _columnId: string, filterValue) => {
      const searchStr = String(filterValue).toLowerCase();
      if (!searchStr) return true;
      const orderNumber = row.getValue('order_number') as string;
      const customerName = row.getValue('customer_name') as string;
      const customerEmail = row.original.customer_email;
      return (
        orderNumber?.toLowerCase().includes(searchStr) ||
        customerName?.toLowerCase().includes(searchStr) ||
        customerEmail?.toLowerCase().includes(searchStr)
      );
    }
  });

  const handleExport = () => {
    const rows = table.getSelectedRowModel().rows;
    const exportData = (rows.length ? rows : table.getFilteredRowModel().rows).map((row) => ({
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
    <Table.Root table={table}>
      <div className='space-y-0'>
        {/* Command bar */}
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
              {table.getFilteredRowModel().rows.length} Results
            </div>
          </div>
        </div>

        {/* Sub-bar with status filters & bulk actions */}
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

        {/* Table body */}
        <div className='p-2'>
          <Table.Grid<Order>
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
            columnsCount={orderColumns.length}
          />
        </div>

        {/* Pagination */}
        <div className='border-border/40 border-t px-6 py-4'>
          <Table.Pagination />
        </div>
      </div>

      {/* Advanced filter sheet */}
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
    </Table.Root>
  );
}
