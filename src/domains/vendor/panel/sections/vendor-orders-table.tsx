'use client';

import { IconFilter, IconPackage, IconShoppingBag, IconTruck } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

import type { TableState } from '@/components/table/data-table';
import { Table, useServerTable } from '@/components/table/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import type { OrderStatusFilter } from '@/domains/orders/orders.schema';
import { ORDER_STATUS_TABS } from '@/domains/orders/orders.schema';
import { useVendorOrdersQueryState } from '@/domains/vendor/panel/hooks/use-vendor-orders-query';
import {
  useVendorStoreOrdersQuery,
  useVendorStoreOrderStatsQuery,
  type VendorOrdersListParams,
  type VendorOrdersListResponse
} from '@/domains/vendor/panel/hooks/use-vendor-store-orders';
import {
  vendorOrderColumns,
  vendorOrderRowMenuActions
} from '@/domains/vendor/panel/sections/vendor-orders-columns';
import { VendorOrdersFilterSheet } from '@/domains/vendor/panel/sections/vendor-orders-filter-sheet';
import type { VendorOrderListItem } from '@/lib/api/vendor-orders';

function useVendorOrdersQueryAdapter(params: VendorOrdersListParams) {
  return useVendorStoreOrdersQuery(params);
}

function VendorOrderKpiCards() {
  const t = useTranslations('vendor.panel.orders.kpi');
  const { data, isLoading } = useVendorStoreOrderStatsQuery();
  const stats = data?.data;

  const cards = [
    {
      label: t('total'),
      value: stats?.total ?? 0,
      icon: IconShoppingBag
    },
    {
      label: t('pending'),
      value: stats?.by_status?.['pending'] ?? 0,
      icon: IconPackage
    },
    {
      label: t('paid'),
      value: stats?.by_status?.['paid'] ?? 0,
      icon: IconPackage
    },
    {
      label: t('shipped'),
      value: (stats?.by_status?.['shipped'] ?? 0) + (stats?.by_status?.['delivered'] ?? 0),
      icon: IconTruck
    }
  ];

  return (
    <Grid cols={2} gap={3} className='lg:grid-cols-4'>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
            <CardContent className='flex items-center gap-3 p-4'>
              <span className='bg-muted flex size-10 shrink-0 items-center justify-center rounded-xl'>
                <Icon className='text-muted-foreground size-5' />
              </span>
              <div>
                <Typography.Muted className='text-xs'>{card.label}</Typography.Muted>
                <p className='text-2xl font-semibold tabular-nums'>
                  {isLoading ? '—' : card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </Grid>
  );
}

export function VendorOrdersTable() {
  const router = useRouter();
  const t = useTranslations('vendor.panel.orders');
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    status,
    setStatus,
    fromDate,
    toDate,
    minAmount,
    maxAmount,
    hasActiveFilters,
    resetFilters
  } = useVendorOrdersQueryState();

  const getQueryParams = useCallback(
    (state: TableState, filter: string): VendorOrdersListParams => ({
      limit: state.pagination.pageSize,
      offset: state.pagination.pageIndex * state.pagination.pageSize,
      search: filter.trim() || undefined,
      status: status === 'all' ? undefined : status,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      min_amount: minAmount ?? undefined,
      max_amount: maxAmount ?? undefined
    }),
    [status, fromDate, toDate, minAmount, maxAmount]
  );

  const getRows = useCallback(
    (data: VendorOrdersListResponse | undefined) => data?.data?.orders ?? [],
    []
  );

  const getTotal = useCallback(
    (data: VendorOrdersListResponse | undefined) => data?.data?.total,
    []
  );

  const serverTable = useServerTable({
    columns: vendorOrderColumns,
    initialPageSize: 20,
    getQueryParams,
    getRows,
    getTotal,
    useQuery: useVendorOrdersQueryAdapter,
    enableRowSelection: false
  });

  const openOrder = useCallback(
    (id: number) => {
      router.push(`/vendor/panel/orders/${id}`);
    },
    [router]
  );

  if (serverTable.isError) {
    return (
      <Flex direction='column' spacing={6} fullWidth>
        <VendorOrderKpiCards />
        <div className='rounded-xl border border-dashed p-12 text-center'>
          <p className='text-lg font-semibold'>{t('loadErrorTitle')}</p>
          <p className='text-muted-foreground mt-1 text-sm'>{t('loadErrorBody')}</p>
          <Button className='mt-4' variant='outline' onClick={() => serverTable.refetch()}>
            {t('retry')}
          </Button>
        </div>
      </Flex>
    );
  }

  return (
    <Flex direction='column' spacing={6} fullWidth>
      <VendorOrderKpiCards />

      <Table.Root {...serverTable.rootProps}>
        <Tabs
          value={status}
          onValueChange={(value) => void setStatus(value as OrderStatusFilter)}
          className='px-1'
        >
          <TabsList className='mb-3 h-auto flex-wrap'>
            {ORDER_STATUS_TABS.filter((tab) => tab.value !== 'delayed').map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className='text-xs'>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Table.Toolbar
          searchPlaceholder={t('searchPlaceholder')}
          showRefresh
          onRefresh={serverTable.refetch}
          isLoading={serverTable.isFetching}
          showClear
          showColumnVisibility
          showSorting={false}
        >
          <Button type='button' variant='outline' size='sm' onClick={() => setFilterOpen(true)}>
            <IconFilter className='size-4' />
            {t('filtersButton')}
            {hasActiveFilters ? (
              <span className='bg-primary text-primary-foreground ms-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold'>
                ON
              </span>
            ) : null}
          </Button>
        </Table.Toolbar>

        <Table.Grid<VendorOrderListItem>
          isLoading={serverTable.isLoading && serverTable.rows.length === 0}
          onRowDoubleClick={(row) => row.original.id && openOrder(row.original.id)}
          getDetailsUrl={(row) =>
            row.original.id ? `/vendor/panel/orders/${row.original.id}` : '/vendor/panel/orders'
          }
          extendMenuActions={(row) => vendorOrderRowMenuActions(row.original, openOrder)}
        />

        <Table.Pagination
          showPageSize
          showTotalRows
          showJumpToPage
          pageSizeOptions={[10, 20, 50]}
        />
      </Table.Root>

      <VendorOrdersFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onReset={() => void resetFilters()}
      />
    </Flex>
  );
}
