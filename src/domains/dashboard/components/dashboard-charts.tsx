import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '@/components/ui/chart';
import type {
  DtoAdminDashboardSeriesPoint,
  DtoAdminDashboardStatusCount
} from '@/services/-admin-dashboard-overview-get.schemas';

import type { DashboardPeriod } from '../hooks/use-dashboard-period';
import {
  formatSeriesDate,
  formatStatusLabel,
  ORDER_STATUS_COLORS,
  revenueChartConfig
} from '../lib/dashboard-utils';

interface DashboardChartsProps {
  period: DashboardPeriod;
  revenueSeries?: DtoAdminDashboardSeriesPoint[];
  ordersByStatus?: DtoAdminDashboardStatusCount[];
}

export function DashboardCharts({
  period,
  revenueSeries = [],
  ordersByStatus = []
}: DashboardChartsProps) {
  const revenueData = useMemo(
    () =>
      revenueSeries.map((point) => ({
        date: point.date ? formatSeriesDate(point.date, period) : '',
        revenue: point.revenue ?? 0,
        orders: point.orders ?? 0
      })),
    [period, revenueSeries]
  );

  const statusData = useMemo(
    () =>
      ordersByStatus.map((item) => {
        const status = item.status ?? 'unknown';
        return {
          status: formatStatusLabel(status),
          count: item.count ?? 0,
          fill: ORDER_STATUS_COLORS[status.toLowerCase()] ?? 'hsl(220 9% 46%)'
        };
      }),
    [ordersByStatus]
  );

  const statusChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    statusData.forEach((item) => {
      config[item.status] = { label: item.status, color: item.fill };
    });
    return config;
  }, [statusData]);

  const totalOrders = statusData.reduce((sum, item) => sum + item.count, 0);

  return (
    <section className='grid gap-4 lg:grid-cols-3'>
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle>Revenue & orders</CardTitle>
          <CardDescription>Daily performance for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className='text-muted-foreground flex h-75 items-center justify-center text-sm'>
              No revenue data for this period yet.
            </div>
          ) : (
            <ChartContainer config={revenueChartConfig} className='h-75 w-full'>
              <AreaChart data={revenueData} margin={{ left: 4, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id='dashboardFillRevenue' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='var(--color-revenue)' stopOpacity={0.35} />
                    <stop offset='100%' stopColor='var(--color-revenue)' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='dashboardFillOrders' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='var(--color-orders)' stopOpacity={0.25} />
                    <stop offset='100%' stopColor='var(--color-orders)' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
                <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={48} />
                <ChartTooltip content={<ChartTooltipContent indicator='dot' />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke='var(--color-revenue)'
                  fill='url(#dashboardFillRevenue)'
                  strokeWidth={2}
                />
                <Area
                  type='monotone'
                  dataKey='orders'
                  stroke='var(--color-orders)'
                  fill='url(#dashboardFillOrders)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Orders by status</CardTitle>
          <CardDescription>
            {totalOrders > 0 ? `${totalOrders.toLocaleString()} orders in period` : 'No orders yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {statusData.length === 0 ? (
            <div className='text-muted-foreground flex h-55 items-center justify-center text-sm'>
              No order activity for this period.
            </div>
          ) : (
            <>
              <ChartContainer config={statusChartConfig} className='h-55 w-full'>
                <BarChart data={statusData} margin={{ left: 4, right: 8, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray='3 3' />
                  <XAxis
                    dataKey='status'
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval={0}
                    angle={-20}
                    textAnchor='end'
                    height={56}
                  />
                  <YAxis tickLine={false} axisLine={false} width={36} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent indicator='dashed' />} />
                  <Bar dataKey='count' radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <div className='mt-4 grid gap-2'>
                {statusData.map((item) => (
                  <div key={item.status} className='flex items-center justify-between text-sm'>
                    <div className='flex items-center gap-2'>
                      <span
                        className='h-2.5 w-2.5 rounded-sm'
                        style={{ background: item.fill }}
                      />
                      <span className='text-muted-foreground'>{item.status}</span>
                    </div>
                    <span className='font-medium tabular-nums'>{item.count}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
