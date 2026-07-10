'use client';

import { IconArrowLeft, IconPencil, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/components/ui/typography';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { VendorStatusBadge } from '@/domains/vendors-admin/components/vendor-status-badge';
import { useVendorActions } from '@/domains/vendors-admin/hooks/use-vendor-actions';
import { VendorPerformanceSection } from '@/domains/vendors-admin/sections/vendor-performance-section';
import { useGetAdminVendorsIdPerformance } from '@/services/-admin-vendors-{id}-performance-get';

interface VendorDetailDomainProps {
  vendorId: string;
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardDescription className='text-[10px] tracking-widest uppercase'>{label}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-semibold tabular-nums'>{value}</div>
        {hint ? <p className='text-muted-foreground mt-1 text-xs'>{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

export function VendorDetailDomain({ vendorId }: VendorDetailDomainProps) {
  const numericId = Number(vendorId);
  const isValidId = Number.isFinite(numericId) && numericId > 0;
  const [period, setPeriod] = useDashboardPeriod();
  const actions = useVendorActions();

  const { data, isLoading, isError, refetch, isFetching } = useGetAdminVendorsIdPerformance(
    numericId,
    { period },
    { query: { enabled: isValidId, staleTime: 60_000 } }
  );

  const report = data?.data;
  const store = report?.store;

  const handleApprove = useCallback(async () => {
    if (!numericId) return;
    await actions.approve(numericId);
    void refetch();
  }, [actions, numericId, refetch]);

  const handleReject = useCallback(async () => {
    if (!numericId) return;
    await actions.reject(numericId);
    void refetch();
  }, [actions, numericId, refetch]);

  const handleSuspend = useCallback(async () => {
    if (!numericId) return;
    await actions.suspend(numericId);
    void refetch();
  }, [actions, numericId, refetch]);

  const handleVerify = useCallback(async () => {
    if (!numericId) return;
    if (store?.is_verified) {
      await actions.unverify(numericId);
    } else {
      await actions.verify(numericId);
    }
    void refetch();
  }, [actions, numericId, refetch, store?.is_verified]);

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return <Typography.Muted>Loading vendor…</Typography.Muted>;
  }

  if (isError || data?.success === false || !store) {
    return (
      <Flex
        direction='column'
        align='center'
        className='gap-4 rounded-2xl border border-dashed p-8'
      >
        <Typography.H3>Unable to load vendor</Typography.H3>
        <Button variant='outline' onClick={() => refetch()}>
          <IconRefresh className='me-2 size-4' />
          Retry
        </Button>
      </Flex>
    );
  }

  const current = report.current_sales;
  const previous = report.previous_sales;
  const revenueChange =
    previous?.revenue && previous.revenue > 0
      ? (((current?.revenue ?? 0) - previous.revenue) / previous.revenue) * 100
      : null;

  return (
    <Flex direction='column' className='gap-6'>
      <Flex direction='column' className='gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <Flex direction='column' className='gap-2'>
          <Button variant='ghost' size='sm' className='w-fit px-0' asChild>
            <Link href='/dashboard/vendors'>
              <IconArrowLeft className='me-2 size-4' />
              Back to vendors
            </Link>
          </Button>
          <Typography.H2>{store.name}</Typography.H2>
          <Flex align='center' className='gap-2'>
            <VendorStatusBadge status={store.status} />
            {store.is_verified ? (
              <Badge>Verified</Badge>
            ) : (
              <Badge variant='outline'>Unverified</Badge>
            )}
          </Flex>
          <Typography.Muted className='max-w-2xl text-sm'>
            {store.owner_email ?? 'No owner email'} · {store.location ?? 'No location'}
          </Typography.Muted>
        </Flex>

        <Flex direction='row' wrap='wrap' className='gap-2'>
          <Button variant='outline' asChild>
            <Link href={`/dashboard/vendors/edit/${numericId}`}>
              <IconPencil className='me-2 size-4' />
              Edit profile
            </Link>
          </Button>
          {store.status === 'pending' ? (
            <>
              <Button variant='outline' onClick={() => void handleReject()}>
                Reject
              </Button>
              <Button onClick={() => void handleApprove()}>Approve</Button>
            </>
          ) : null}
          {store.status === 'active' ? (
            <Button variant='outline' onClick={() => void handleSuspend()}>
              Suspend
            </Button>
          ) : null}
          <Button variant='secondary' onClick={() => void handleVerify()}>
            {store.is_verified ? 'Remove verification' : 'Verify vendor'}
          </Button>
        </Flex>
      </Flex>

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

      <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <MetricCard
          label='Revenue'
          value={`$${(current?.revenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          hint={
            revenueChange !== null
              ? `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}% vs prior period`
              : dashboardPeriodLabel(period)
          }
        />
        <MetricCard label='Orders' value={String(current?.order_count ?? 0)} />
        <MetricCard
          label='Avg order value'
          value={`$${(current?.avg_order_value ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        />
        <MetricCard label='Units sold' value={String(current?.units_sold ?? 0)} />
      </div>

      <Tabs defaultValue='performance'>
        <TabsList>
          <TabsTrigger value='performance'>Performance</TabsTrigger>
          <TabsTrigger value='operations'>Operations</TabsTrigger>
        </TabsList>

        <TabsContent value='performance' className='space-y-4'>
          <VendorPerformanceSection
            period={period}
            dailySales={report.daily_sales}
            topProducts={report.top_products}
          />
        </TabsContent>

        <TabsContent value='operations'>
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardHeader>
                <CardTitle>Orders</CardTitle>
                <CardDescription>All-time order breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography.Text className='text-2xl font-semibold tabular-nums'>
                  {report.order_total ?? 0}
                </Typography.Text>
                <Flex direction='column' className='mt-4 gap-2'>
                  {Object.entries(report.orders_by_status ?? {}).map(([status, count]) => (
                    <Flex key={status} direction='row' justify='between' className='text-sm'>
                      <span className='capitalize'>{status}</span>
                      <span className='font-medium tabular-nums'>{count}</span>
                    </Flex>
                  ))}
                </Flex>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catalog</CardTitle>
                <CardDescription>Product inventory snapshot</CardDescription>
              </CardHeader>
              <CardContent>
                <Typography.Text className='text-2xl font-semibold tabular-nums'>
                  {report.product_total ?? 0}
                </Typography.Text>
                <Typography.Muted className='mt-2 text-sm'>
                  {report.low_stock_count ?? 0} low-stock SKUs
                </Typography.Muted>
                <Flex direction='column' className='mt-4 gap-2'>
                  {Object.entries(report.products_by_status ?? {}).map(([status, count]) => (
                    <Flex key={status} direction='row' justify='between' className='text-sm'>
                      <span className='capitalize'>{status}</span>
                      <span className='font-medium tabular-nums'>{count}</span>
                    </Flex>
                  ))}
                </Flex>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Flex align='center' className='text-muted-foreground gap-2 text-xs'>
        <Button
          variant='ghost'
          size='icon'
          className='size-7'
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label='Refresh vendor performance'
        >
          <IconRefresh className={`size-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
        Updated {dashboardPeriodLabel(period)}
      </Flex>
    </Flex>
  );
}
