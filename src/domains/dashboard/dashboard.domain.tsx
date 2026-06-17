'use client';

import { IconRefresh } from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardCharts } from '@/domains/dashboard/components/dashboard-charts';
import { DashboardKpiCards } from '@/domains/dashboard/components/dashboard-kpi-cards';
import { DashboardPlatformStats } from '@/domains/dashboard/components/dashboard-platform-stats';
import { DashboardTables } from '@/domains/dashboard/components/dashboard-tables';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { useGetAdminDashboardOverview } from '@/services/-admin-dashboard-overview-get';
import type { GetAdminDashboardOverview200 } from '@/services/-admin-dashboard-overview-get.schemas';

function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-24 w-full rounded-2xl' />
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className='h-36 w-full rounded-2xl' />
        ))}
      </div>
      <div className='grid gap-4 lg:grid-cols-3'>
        <Skeleton className='h-96 w-full rounded-2xl lg:col-span-2' />
        <Skeleton className='h-96 w-full rounded-2xl' />
      </div>
      <Skeleton className='h-56 w-full rounded-2xl' />
      <Skeleton className='h-96 w-full rounded-2xl' />
    </div>
  );
}

export function DashboardDomain() {
  const [period, setPeriod] = useDashboardPeriod();
  const { data, isLoading, isFetching, error, refetch } = useGetAdminDashboardOverview(
    { period },
    { query: { staleTime: 60_000 } }
  );

  const overview = (data as GetAdminDashboardOverview200 | undefined)?.data;
  const generatedLabel = overview?.generated_at
    ? formatDistanceToNow(parseISO(overview.generated_at), { addSuffix: true })
    : 'just now';

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || data?.success === false) {
    return (
      <div className='flex min-h-[420px] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed p-8 text-center'>
        <div>
          <h2 className='text-lg font-semibold'>Unable to load dashboard</h2>
          <p className='text-muted-foreground mt-1 max-w-md text-sm'>
            {data?.message ??
              'The dashboard overview endpoint is unavailable. Restart the API after pulling the latest backend changes, then try again.'}
          </p>
        </div>
        <Button variant='outline' onClick={() => refetch()}>
          <IconRefresh className='mr-2 h-4 w-4' />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <header className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <Badge variant='secondary' className='mb-3'>
            Commerce overview
          </Badge>
          <h1 className='text-3xl font-semibold tracking-tight md:text-4xl'>Dashboard</h1>
          <p className='text-muted-foreground mt-1 max-w-2xl text-sm'>
            Monitor revenue, orders, inventory, and customer growth across your storefront in
            real time.
          </p>
        </div>

        <div className='flex flex-col items-start gap-3 sm:items-end'>
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as (typeof dashboardPeriods)[number])}
          >
            <TabsList>
              {dashboardPeriods.map((option) => (
                <TabsTrigger key={option} value={option}>
                  {option}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <span className='inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500' />
            Updated {generatedLabel} · {dashboardPeriodLabel(period)}
            <Button
              variant='ghost'
              size='icon'
              className='h-7 w-7'
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label='Refresh dashboard'
            >
              <IconRefresh className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      <DashboardKpiCards kpis={overview?.kpis} />

      <DashboardCharts
        period={period}
        revenueSeries={overview?.revenue_series}
        ordersByStatus={overview?.orders_by_status}
      />

      <DashboardPlatformStats platform={overview?.platform} />

      <DashboardTables
        recentOrders={overview?.recent_orders}
        topProducts={overview?.top_products}
        lowStockProducts={overview?.low_stock_products}
      />
    </div>
  );
}
