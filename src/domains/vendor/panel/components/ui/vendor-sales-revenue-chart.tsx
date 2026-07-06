'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import type { VendorDailySalesPoint } from '@/lib/api/vendor-ai-sales-insights';

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--gold))' }
} satisfies ChartConfig;

interface VendorSalesRevenueChartProps {
  series: VendorDailySalesPoint[];
  periodDays: number;
}

function formatAxisDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function VendorSalesRevenueChart({ series, periodDays }: VendorSalesRevenueChartProps) {
  const chartData = series.map((point) => ({
    date: point.date ?? '',
    revenue: point.revenue ?? 0
  }));

  return (
    <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
      <CardHeader>
        <CardTitle>Revenue trend</CardTitle>
        <CardDescription>Last {periodDays} days from paid, shipped, and delivered orders</CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className='text-muted-foreground py-12 text-center text-sm'>No sales in this period yet.</p>
        ) : (
          <ChartContainer config={revenueChartConfig} className='h-75 w-full'>
            <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={formatAxisDate}
              />
              <YAxis tickLine={false} axisLine={false} width={56} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='revenue'
                stroke='var(--color-revenue)'
                fill='var(--color-revenue)'
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
