import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ORDER_MONTHLY_DATA } from '@/domains/orders/mock_order';
import { ChartCard, type MonthlyDataPoint } from '@/domains/orders/sections/order-detail-chart';
import { fmtChartDigit } from '@/lib/format';

export function OrderRevenueChart() {
  const revenueChartConfig = {
    revenue: {
      label: 'Total Revenue',
      color: 'hsl(var(--primary))'
    }
  } satisfies ChartConfig;

  return (
    <ChartCard title='Revenue & Orders' subtitle='Last 6 months performance'>
      <ChartContainer config={revenueChartConfig} className='aspect-auto h-55 w-full'>
        <AreaChart
          data={ORDER_MONTHLY_DATA as MonthlyDataPoint[]}
          margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id='revGrad' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='5%' stopColor='var(--color-revenue)' stopOpacity={0.2} />
              <stop offset='95%' stopColor='var(--color-revenue)' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='month'
            tick={{ fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v / 1000}k`}
          />
          {/* Custom Shadcn Tooltip Injection */}
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                indicator='line'
                formatter={(value, name) => (
                  <>
                    <span className='text-muted-foreground'>{String(name)}</span>
                    <span className='text-foreground ml-auto font-mono font-bold tabular-nums'>
                      {typeof value === 'number' ? fmtChartDigit(value) : value}
                    </span>
                  </>
                )}
              />
            }
          />
          <Area
            type='monotone'
            dataKey='revenue'
            stroke='var(--color-revenue)'
            strokeWidth={2.5}
            fill='url(#revGrad)'
            dot={{ r: 4, fill: 'var(--color-revenue)', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  );
}
