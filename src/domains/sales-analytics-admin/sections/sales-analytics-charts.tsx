'use client';

import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { DashboardPeriod } from '@/domains/dashboard/hooks/use-dashboard-period';
import {
  formatSeriesDate,
  formatStatusLabel,
  ORDER_STATUS_COLORS,
  revenueChartConfig
} from '@/domains/dashboard/lib/dashboard-utils';
import type {
  DtoAdminDashboardSeriesPoint,
  DtoAdminDashboardStatusCount,
  DtoAdminSalesProfitPoint
} from '@/services/-admin-analytics-sales-get.schemas';

interface SalesAnalyticsChartsProps {
  period: DashboardPeriod;
  revenueSeries?: DtoAdminDashboardSeriesPoint[];
  profitSeries?: DtoAdminSalesProfitPoint[];
  ordersByStatus?: DtoAdminDashboardStatusCount[];
}

const profitChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(142 76% 36%)' },
  cost: { label: 'Cost', color: 'hsl(0 84% 60%)' },
  profit: { label: 'Profit', color: 'hsl(221 83% 53%)' }
} satisfies ChartConfig;

export function SalesAnalyticsCharts({
  period,
  revenueSeries = [],
  profitSeries = [],
  ordersByStatus = []
}: SalesAnalyticsChartsProps) {
  const revenueData = useMemo(
    () =>
      revenueSeries.map((point) => ({
        date: point.date ? formatSeriesDate(point.date, period) : '',
        revenue: point.revenue ?? 0,
        orders: point.orders ?? 0
      })),
    [period, revenueSeries]
  );

  const profitData = useMemo(
    () =>
      profitSeries.map((point) => ({
        date: point.date ? formatSeriesDate(point.date, period) : '',
        revenue: point.revenue ?? 0,
        cost: point.cost ?? 0,
        profit: point.profit ?? 0
      })),
    [period, profitSeries]
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

  return (
    <section className='grid gap-4 lg:grid-cols-2'>
      <Card className='border-0 shadow-none lg:col-span-2'>
        <CardHeader>
          <CardTitle>Revenue & orders</CardTitle>
          <CardDescription>Daily gross revenue and order volume</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <div className='text-muted-foreground flex h-75 items-center justify-center text-sm'>
              No revenue data for this period yet.
            </div>
          ) : (
            <ChartContainer config={revenueChartConfig} className='h-75 w-full'>
              <AreaChart data={revenueData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} width={48} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type='monotone'
                  dataKey='revenue'
                  stroke='var(--color-revenue)'
                  fill='var(--color-revenue)'
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className='border-0 shadow-none lg:col-span-2'>
        <CardHeader>
          <CardTitle>Profit breakdown</CardTitle>
          <CardDescription>Revenue, product cost, and estimated profit per day</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={profitChartConfig} className='h-75 w-full'>
            <AreaChart data={profitData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={48} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type='monotone'
                dataKey='profit'
                stroke='var(--color-profit)'
                fill='var(--color-profit)'
                fillOpacity={0.15}
              />
              <Area
                type='monotone'
                dataKey='revenue'
                stroke='var(--color-revenue)'
                fill='var(--color-revenue)'
                fillOpacity={0.1}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className='border-0 shadow-none'>
        <CardHeader>
          <CardTitle>Orders by status</CardTitle>
          <CardDescription>Distribution for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={statusChartConfig} className='h-72 w-full'>
            <BarChart data={statusData} layout='vertical' margin={{ left: 8 }}>
              <CartesianGrid horizontal={false} />
              <XAxis type='number' hide />
              <YAxis
                dataKey='status'
                type='category'
                width={88}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='count' radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
