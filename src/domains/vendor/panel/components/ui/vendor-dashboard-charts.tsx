'use client';

import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from 'recharts';

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
  VENDOR_REVENUE_OVERVIEW,
  VENDOR_REVENUE_SERIES,
  VENDOR_SALES_CHANNELS,
  VENDOR_TRAFFIC_SOURCES
} from '@/domains/vendor/panel/data/vendor-dashboard.data';

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: '#10b981' }
} satisfies ChartConfig;

const performanceChartConfig = {
  revenue: { label: 'Revenue', color: '#10b981' },
  orders: { label: 'Orders', color: '#3b82f6' }
} satisfies ChartConfig;

const categoryChartConfig = {
  sales: { label: 'Sales', color: '#10b981' }
} satisfies ChartConfig;

const TRAFFIC_COLORS = ['#10b981', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444'];

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function VendorDashboardCharts() {
  const trafficData = useMemo(
    () =>
      VENDOR_TRAFFIC_SOURCES.map((item, index) => ({
        ...item,
        fill: TRAFFIC_COLORS[index % TRAFFIC_COLORS.length]
      })),
    []
  );

  const channelData = useMemo(
    () =>
      VENDOR_SALES_CHANNELS.map((item) => ({
        name: item.channel,
        value: item.percent,
        fill: item.color
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

  const channelConfig = useMemo(() => {
    const config: ChartConfig = {};
    channelData.forEach((item) => {
      config[item.name] = { label: item.name, color: item.fill };
    });
    return config;
  }, [channelData]);

  return (
    <section className='grid gap-4 xl:grid-cols-3'>
      <div className='dashboard-card xl:col-span-2'>
        <div className='mb-4 flex items-center justify-between'>
          <div>
            <h2 className='text-base font-semibold'>Revenue overview</h2>
            <p className='text-muted-foreground text-sm'>Daily revenue for the selected period</p>
          </div>
          <span className='text-muted-foreground rounded-lg border border-white/8 px-2 py-1 text-xs'>
            Daily
          </span>
        </div>
        <ChartContainer config={revenueChartConfig} className='h-72 w-full'>
          <AreaChart data={[...VENDOR_REVENUE_OVERVIEW]} margin={{ left: 0, right: 8 }}>
            <defs>
              <linearGradient id='vendorRevenueFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#10b981' stopOpacity={0.35} />
                <stop offset='100%' stopColor='#10b981' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke='rgba(255,255,255,0.06)' />
            <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={56} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke='#10b981'
              fill='url(#vendorRevenueFill)'
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className='dashboard-card'>
        <h2 className='text-base font-semibold'>Top sales channels</h2>
        <p className='text-muted-foreground mb-4 text-sm'>Where your revenue comes from</p>
        <ChartContainer config={channelConfig} className='mx-auto h-52 w-full'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={channelData} dataKey='value' nameKey='name' innerRadius={52} strokeWidth={2}>
              {channelData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className='mt-2 space-y-2'>
          {VENDOR_SALES_CHANNELS.map((channel) => (
            <div key={channel.channel} className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-2'>
                <span className='size-2 rounded-full' style={{ background: channel.color }} />
                <span>{channel.channel}</span>
              </div>
              <span className='text-muted-foreground tabular-nums'>
                {channel.percent}% · {formatCurrency(channel.revenue)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className='dashboard-card xl:col-span-2'>
        <h2 className='text-base font-semibold'>Sales performance</h2>
        <p className='text-muted-foreground mb-4 text-sm'>Revenue bars with order trend line</p>
        <ChartContainer config={performanceChartConfig} className='h-72 w-full'>
          <ComposedChart data={[...VENDOR_REVENUE_SERIES]} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} stroke='rgba(255,255,255,0.06)' />
            <XAxis dataKey='date' tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis yAxisId='left' tickLine={false} axisLine={false} width={48} />
            <YAxis yAxisId='right' orientation='right' tickLine={false} axisLine={false} width={36} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar yAxisId='left' dataKey='revenue' fill='#10b981' radius={[6, 6, 0, 0]} />
            <Line
              yAxisId='right'
              type='monotone'
              dataKey='orders'
              stroke='#3b82f6'
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ChartContainer>
        <div className='mt-4 grid gap-3 sm:grid-cols-4'>
          <MetricSummary label='Total revenue' value={formatCurrency(48300)} change='+18.2%' />
          <MetricSummary label='Total orders' value='427' change='+15.7%' />
          <MetricSummary label='Avg order value' value={formatCurrency(113.1)} change='+2.1%' />
          <MetricSummary label='Refunds' value={formatCurrency(840)} change='-4.2%' negative />
        </div>
      </div>

      <div className='dashboard-card'>
        <h2 className='text-base font-semibold'>Traffic sources</h2>
        <p className='text-muted-foreground mb-4 text-sm'>Visitor acquisition mix</p>
        <ChartContainer config={trafficConfig} className='mx-auto h-52 w-full'>
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={trafficData} dataKey='value' nameKey='source' innerRadius={52} strokeWidth={2}>
              {trafficData.map((entry) => (
                <Cell key={entry.source} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey='source' />} />
          </PieChart>
        </ChartContainer>
      </div>

      <div className='dashboard-card xl:col-span-3'>
        <h2 className='text-base font-semibold'>Sales by category</h2>
        <p className='text-muted-foreground mb-4 text-sm'>Revenue distribution across catalog categories</p>
        <ChartContainer config={categoryChartConfig} className='h-64 w-full'>
          <BarChart data={[...VENDOR_CATEGORY_SALES]} margin={{ left: 0, right: 0 }}>
            <CartesianGrid vertical={false} stroke='rgba(255,255,255,0.06)' />
            <XAxis dataKey='category' tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} width={56} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey='sales' fill='#10b981' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </div>
    </section>
  );
}

function MetricSummary({
  label,
  value,
  change,
  negative = false
}: {
  label: string;
  value: string;
  change: string;
  negative?: boolean;
}) {
  return (
    <div className='rounded-lg border border-white/6 bg-white/2 p-3'>
      <p className='text-muted-foreground text-xs'>{label}</p>
      <p className='mt-1 text-lg font-semibold tabular-nums'>{value}</p>
      <p className={negative ? 'mt-1 text-xs text-rose-400' : 'mt-1 text-xs text-emerald-400'}>
        {change}
      </p>
    </div>
  );
}
