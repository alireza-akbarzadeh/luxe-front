'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'; // adjust import path to your shadcn chart file

interface RevenueSparklingProps {
  time: string;
  revenue: number;
  orders: number;
}

export function RevenueSparkling({ data }: { data: RevenueSparklingProps[] }) {
  // Chart config for shadcn theming
  const chartConfig = {
    revenue: {
      label: 'Revenue',
      color: 'hsl(var(--primary))'
    },
    orders: {
      label: 'Orders',
      color: 'hsl(var(--muted-foreground))'
    }
  };

  return (
    <ChartContainer config={chartConfig} className='aspect-auto h-[180px] w-full min-h-0'>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id='revGrad' x1='0' y1='0' x2='0' y2='1'>
            <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.25} />
            <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--border))' vertical={false} />
        <XAxis
          dataKey='time'
          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          interval='preserveStartEnd'
        />
        <YAxis
          tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator='dot'
              labelFormatter={(label, payload) => {
                const orders = payload?.[0]?.payload?.orders ?? 0;
                return (
                  <div>
                    <div>{label}</div>
                    <div className='text-muted-foreground text-xs'>{orders} orders</div>
                  </div>
                );
              }}
              formatter={(value, name) => {
                if (name === 'revenue') {
                  return `$${Number(value).toLocaleString()}`;
                }
                return value;
              }}
            />
          }
        />
        <Area
          type='monotone'
          dataKey='revenue'
          stroke='hsl(var(--primary))'
          strokeWidth={2}
          fill='url(#revGrad)'
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}
