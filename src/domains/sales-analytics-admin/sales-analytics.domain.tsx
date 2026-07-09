'use client';

import { IconRefresh } from '@tabler/icons-react';
import { formatDistanceToNow, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { SalesAnalyticsKpiCards } from '@/domains/sales-analytics-admin/components/sales-analytics-kpi-cards';
import { SalesAnalyticsCharts } from '@/domains/sales-analytics-admin/sections/sales-analytics-charts';
import { SalesCohortsSection } from '@/domains/sales-analytics-admin/sections/sales-cohorts-section';
import { SalesFunnelSection } from '@/domains/sales-analytics-admin/sections/sales-funnel-section';
import { SalesProductsSection } from '@/domains/sales-analytics-admin/sections/sales-products-section';
import { useGetAdminAnalyticsSales } from '@/services/-admin-analytics-sales-get';

function SalesAnalyticsSkeleton() {
  return (
    <Flex direction='column' className='gap-6'>
      <Skeleton className='h-20 w-full rounded-2xl' />
      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className='h-36 w-full rounded-2xl' />
        ))}
      </div>
      <Skeleton className='h-96 w-full rounded-2xl' />
    </Flex>
  );
}

export function SalesAnalyticsDomain() {
  const [period, setPeriod] = useDashboardPeriod();
  const { data, isLoading, isFetching, error, refetch } = useGetAdminAnalyticsSales(
    { period },
    { query: { staleTime: 60_000 } }
  );

  const report = data?.data;
  const generatedLabel = report?.generated_at
    ? formatDistanceToNow(parseISO(report.generated_at), { addSuffix: true })
    : 'just now';

  if (isLoading) {
    return <SalesAnalyticsSkeleton />;
  }

  if (error || data?.success === false) {
    return (
      <Flex
        direction='column'
        align='center'
        justify='center'
        className='min-h-[420px] gap-4 rounded-2xl border border-dashed p-8 text-center'
      >
        <Typography.H3>Unable to load sales analytics</Typography.H3>
        <Typography.Muted className='max-w-md'>
          {data?.message ?? 'The analytics endpoint is unavailable. Restart the API and try again.'}
        </Typography.Muted>
        <Button variant='outline' onClick={() => refetch()}>
          <IconRefresh className='me-2 size-4' />
          Retry
        </Button>
      </Flex>
    );
  }

  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' className='gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <Flex direction='column' spacing={1}>
          <Badge variant='secondary' className='w-fit'>
            Reports
          </Badge>
          <Typography.H2>Sales analytics</Typography.H2>
          <Typography.Muted className='max-w-2xl'>
            Revenue, profit, orders, customers, products, funnel, and cohort insights for your
            store.
          </Typography.Muted>
        </Flex>

        <Flex direction='column' align='start' className='gap-3 sm:items-end'>
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
          <Flex align='center' className='text-muted-foreground gap-2 text-xs'>
            <span className='inline-flex size-2 rounded-full bg-emerald-500' />
            Updated {generatedLabel} · {dashboardPeriodLabel(period)}
            <Button
              variant='ghost'
              size='icon'
              className='size-7'
              onClick={() => refetch()}
              disabled={isFetching}
              aria-label='Refresh sales analytics'
            >
              <IconRefresh className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </Button>
          </Flex>
        </Flex>
      </Flex>

      <SalesAnalyticsKpiCards kpis={report?.kpis} />

      <Tabs defaultValue='overview'>
        <TabsList>
          <TabsTrigger value='overview'>Overview</TabsTrigger>
          <TabsTrigger value='products'>Products</TabsTrigger>
          <TabsTrigger value='funnel'>Funnel</TabsTrigger>
          <TabsTrigger value='cohorts'>Cohorts</TabsTrigger>
        </TabsList>

        <TabsContent value='overview' className='space-y-4'>
          <SalesAnalyticsCharts
            period={period}
            revenueSeries={report?.revenue_series}
            profitSeries={report?.profit_series}
            ordersByStatus={report?.orders_by_status}
          />
        </TabsContent>

        <TabsContent value='products'>
          <SalesProductsSection
            topProducts={report?.top_products}
            segments={report?.customer_segments}
          />
        </TabsContent>

        <TabsContent value='funnel'>
          <SalesFunnelSection steps={report?.order_funnel} />
        </TabsContent>

        <TabsContent value='cohorts'>
          <SalesCohortsSection cohorts={report?.cohorts} />
        </TabsContent>
      </Tabs>
    </Flex>
  );
}
