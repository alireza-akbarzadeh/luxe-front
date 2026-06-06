import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ORDER_MONTHLY_DATA } from '@/domains/orders/mock_order';
import { ChartCard, type MonthlyDataPoint } from '@/domains/orders/sections/order-detail-chart';

export function OrderVolumeChart() {
  const volumeChartConfig = {
    orders: {
      label: 'Orders Placed',
      color: 'hsl(var(--primary))'
    },
    returns: {
      label: 'Returns Processed',
      color: '#ef4444'
    }
  } satisfies ChartConfig;
  return (
    <ChartCard title='Order Volume' subtitle='Monthly order count trend'>
      <ChartContainer config={volumeChartConfig} className='aspect-auto h-45 w-full'>
        <BarChart
          data={ORDER_MONTHLY_DATA as MonthlyDataPoint[]}
          margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
          barSize={20}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='month'
            tick={{ fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' />} />
          <Bar
            dataKey='orders'
            fill='var(--color-orders)'
            radius={[6, 6, 0, 0]}
            fillOpacity={0.85}
          />
          <Bar
            dataKey='returns'
            fill='var(--color-returns)'
            radius={[6, 6, 0, 0]}
            fillOpacity={0.7}
          />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  );
}
