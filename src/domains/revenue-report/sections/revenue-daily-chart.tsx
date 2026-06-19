'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { DashboardPeriod } from '@/domains/dashboard/hooks/use-dashboard-period';
import { formatSeriesDate, revenueChartConfig } from '@/domains/dashboard/lib/dashboard-utils';
import { formatCurrency } from '@/lib/format';
import type { DtoAdminRevenueDailyRow } from '@/services/-admin-reports-revenue-get.schemas';

interface RevenueDailyChartProps {
  period: DashboardPeriod;
  daily?: DtoAdminRevenueDailyRow[];
}

export function RevenueDailyChart({ period, daily = [] }: RevenueDailyChartProps) {
  const chartData = useMemo(
    () =>
      daily.map((row) => ({
        date: row.date ? formatSeriesDate(row.date, period) : '',
        revenue: row.revenue ?? 0,
        orders: row.orders ?? 0
      })),
    [daily, period]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily revenue trend</CardTitle>
        <CardDescription>Gross revenue and order volume by day</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className='text-muted-foreground flex h-75 items-center justify-center text-sm'>
            No revenue data for this period yet.
          </div>
        ) : (
          <ChartContainer config={revenueChartConfig} className='h-75 w-full'>
            <AreaChart data={chartData} margin={{ left: 4, right: 12, top: 8 }}>
              <defs>
                <linearGradient id='revenueReportFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--color-revenue)' stopOpacity={0.35} />
                  <stop offset='100%' stopColor='var(--color-revenue)' stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray='3 3' />
              <XAxis dataKey='date' tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis
                yAxisId='revenue'
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) => formatCurrency(value)}
                width={72}
              />
              <YAxis yAxisId='orders' orientation='right' hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => {
                      if (name === 'revenue') return formatCurrency(Number(value));
                      return Number(value).toLocaleString();
                    }}
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                yAxisId='revenue'
                type='monotone'
                dataKey='revenue'
                stroke='var(--color-revenue)'
                fill='url(#revenueReportFill)'
                strokeWidth={2}
              />
              <Area
                yAxisId='orders'
                type='monotone'
                dataKey='orders'
                stroke='var(--color-orders)'
                fill='transparent'
                strokeWidth={2}
                strokeDasharray='4 4'
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
