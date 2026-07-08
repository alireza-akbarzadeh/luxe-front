'use client';

import {
  IconAdjustmentsDollar,
  IconCreditCard,
  IconDownload,
  IconRefresh,
  IconShoppingCart,
  IconUsers
} from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { DashboardKpiCard } from '@/components/dashboard/dashboard-kpi-card';
import { DashboardPageHeader } from '@/components/dashboard/dashboard-page-header';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardCharts } from '@/domains/dashboard/components/dashboard-charts';
import { DashboardPlatformStats } from '@/domains/dashboard/components/dashboard-platform-stats';
import { DashboardTables } from '@/domains/dashboard/components/dashboard-tables';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import {
  formatChangePercent,
  formatKpiValue
} from '@/domains/dashboard/lib/dashboard-utils';
import { useGetAdminDashboardOverview } from '@/services/-admin-dashboard-overview-get';
import type { GetAdminDashboardOverview200 } from '@/services/-admin-dashboard-overview-get.schemas';

function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <Skeleton className='h-24 w-full rounded-2xl' />
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, index) => (
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
      <div className='dashboard-card flex min-h-[420px] flex-col items-center justify-center gap-4 border-dashed text-center'>
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

  const kpis = overview?.kpis;

  return (
    <div className='space-y-6'>
      <DashboardPageHeader
        title='Dashboard'
        description='Monitor revenue, orders, inventory, and customer growth across your platform.'
        actions={
          <div className='flex flex-wrap items-center gap-2'>
            <div className='hidden items-center gap-1 rounded-xl border border-white/8 p-1 sm:flex'>
              {dashboardPeriods.map((option) => (
                <Button
                  key={option}
                  size='sm'
                  variant={period === option ? 'secondary' : 'ghost'}
                  className='h-8 rounded-lg px-3 text-xs'
                  onClick={() => setPeriod(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
            <Button variant='outline' size='sm' className='rounded-xl border-white/10 bg-transparent'>
              <IconDownload className='mr-2 size-4' />
              Export report
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='h-9 w-9 rounded-xl'
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label='Refresh dashboard'
            >
              <IconRefresh className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        }
      />

      <p className='text-muted-foreground -mt-2 text-xs'>
        Updated {generatedLabel} · {dashboardPeriodLabel(period)}
      </p>

      <section className='grid gap-4 sm:grid-cols-2 xl:grid-cols-5'>
        <DashboardKpiCard
          label='Gross revenue'
          value={formatKpiValue('currency', kpis?.revenue)}
          change={kpis?.revenue?.change_percent}
          icon={IconAdjustmentsDollar}
          iconClassName='bg-emerald-500/10 text-emerald-400'
          sparkline={[12, 14, 13, 16, 18, 17, 20]}
          sparklineColor='#10b981'
        />
        <DashboardKpiCard
          label='Orders'
          value={formatKpiValue('count', kpis?.orders)}
          change={kpis?.orders?.change_percent}
          icon={IconShoppingCart}
          iconClassName='bg-blue-500/10 text-blue-400'
          sparkline={[18, 20, 19, 22, 24, 23, 26]}
          sparklineColor='#3b82f6'
        />
        <DashboardKpiCard
          label='New customers'
          value={formatKpiValue('count', kpis?.new_customers)}
          change={kpis?.new_customers?.change_percent}
          icon={IconUsers}
          iconClassName='bg-violet-500/10 text-violet-400'
          sparkline={[22, 24, 23, 26, 28, 27, 30]}
          sparklineColor='#a855f7'
        />
        <DashboardKpiCard
          label='Avg. order value'
          value={formatKpiValue('average', kpis?.avg_order_value)}
          change={kpis?.avg_order_value?.change_percent}
          icon={IconCreditCard}
          iconClassName='bg-amber-500/10 text-amber-400'
          sparkline={[2.8, 3.1, 3.0, 3.4, 3.6, 3.5, 3.87]}
          sparklineColor='#f59e0b'
        />
        <DashboardKpiCard
          label='Net change'
          value={formatChangePercent(kpis?.revenue?.change_percent)}
          change={kpis?.revenue?.change_percent}
          icon={IconAdjustmentsDollar}
          iconClassName='bg-emerald-500/10 text-emerald-400'
          sparkline={[8, 9, 10, 11, 13, 14, 16]}
          sparklineColor='#10b981'
        />
      </section>

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
