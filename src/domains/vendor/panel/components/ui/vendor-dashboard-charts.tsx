'use client';

import { useMemo } from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  VENDOR_CATEGORY_SALES,
  VENDOR_REVENUE_SERIES,
  VENDOR_TRAFFIC_SOURCES
} from '@/domains/vendor/panel/data/vendor-dashboard.data';

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--gold))' },
  orders: { label: 'Orders', color: 'hsl(var(--chart-2))' }
} satisfies ChartConfig;

const categoryChartConfig = {
  sales: { label: 'Sales', color: 'hsl(var(--gold))' }
} satisfies ChartConfig;

const TRAFFIC_COLORS = [
  'hsl(var(--gold))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))'
];

export function VendorDashboardCharts() {
  const trafficData = useMemo(
    () =>
      VENDOR_TRAFFIC_SOURCES.map((item, index) => ({
        ...item,
        fill: TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]
      })),
    []
  );

  const trafficConfig = useMemo(() => {
    const config: ChartConfig = {};
    trafficData.forEach((item) => {
      config[item.source] = { label: item.source, color: item.fill };
    });
    return config;
  }, [trafficData]);

  return (
    <section className='grid gap-4 xl:grid-cols-3'>
      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none xl:col-span-2'>
        <CardHeader>
          <CardTitle>Revenue & orders</CardTitle>
          <CardDescription>Last 7 days performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={revenueChartConfig} className='h-75 w-full'>
            <AreaChart data={[...VENDOR_REVENUE_SERIES]} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={48} />
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
        </CardContent>
      </Card>

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none'>
        <CardHeader>
          <CardTitle>Traffic sources</CardTitle>
          <CardDescription>Visitor acquisition mix</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={trafficConfig} className='mx-auto h-75 w-full'>
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={trafficData} dataKey='value' nameKey='source' innerRadius={55} strokeWidth={2}>
                {trafficData.map((entry) => (
                  <Cell key={entry.source} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey='source' />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className='border-border/40 bg-card/50 rounded-2xl shadow-none xl:col-span-3'>
        <CardHeader>
          <CardTitle>Sales by category</CardTitle>
          <CardDescription>Revenue distribution across catalog categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryChartConfig} className='h-75 w-full'>
            <BarChart data={[...VENDOR_CATEGORY_SALES]} margin={{ left: 0, right: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='category' tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={56} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey='sales' fill='var(--color-sales)' radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
