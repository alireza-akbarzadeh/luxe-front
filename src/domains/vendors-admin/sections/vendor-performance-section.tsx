'use client';

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { DashboardPeriod } from '@/domains/dashboard/hooks/use-dashboard-period';
import { formatSeriesDate } from '@/domains/dashboard/lib/dashboard-utils';
import type {
  DtoAdminVendorDailySales,
  DtoAdminVendorTopProduct
} from '@/services/-admin-vendors-{id}-performance-get.schemas';

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(221 83% 53%)' }
} satisfies ChartConfig;

interface VendorPerformanceSectionProps {
  period: DashboardPeriod;
  dailySales?: DtoAdminVendorDailySales[];
  topProducts?: DtoAdminVendorTopProduct[];
}

export function VendorPerformanceSection({
  period,
  dailySales = [],
  topProducts = []
}: VendorPerformanceSectionProps) {
  const chartData = useMemo(
    () =>
      dailySales.map((point) => ({
        date: point.date ? formatSeriesDate(point.date, period) : '',
        revenue: point.revenue ?? 0
      })),
    [dailySales, period]
  );

  return (
    <Flex direction='column' className='gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>Revenue trend</CardTitle>
          <CardDescription>Daily vendor revenue for the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <Typography.Muted className='text-sm'>No sales data for this period.</Typography.Muted>
          ) : (
            <ChartContainer config={revenueChartConfig} className='aspect-[16/7] w-full'>
              <AreaChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey='date' tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={56} />
                <ChartTooltip content={<ChartTooltipContent />} />
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

      <Card>
        <CardHeader>
          <CardTitle>Top products</CardTitle>
          <CardDescription>Best sellers by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <Typography.Muted className='text-sm'>No product sales yet.</Typography.Muted>
          ) : (
            <Flex direction='column' className='gap-3'>
              {topProducts.map((product) => (
                <Flex
                  key={product.product_id}
                  direction='row'
                  align='center'
                  justify='between'
                  className='border-b pb-3 last:border-0 last:pb-0'
                >
                  <div>
                    <Typography.Text className='text-sm font-medium'>
                      {product.name ?? 'Product'}
                    </Typography.Text>
                    <Typography.Muted className='text-xs'>
                      {product.units ?? 0} units sold
                    </Typography.Muted>
                  </div>
                  <Typography.Text className='text-sm font-semibold tabular-nums'>
                    ${(product.revenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Typography.Text>
                </Flex>
              ))}
            </Flex>
          )}
        </CardContent>
      </Card>
    </Flex>
  );
}
