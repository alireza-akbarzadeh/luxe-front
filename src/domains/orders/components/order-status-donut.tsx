import React from 'react';
import { Pie, PieChart } from 'recharts';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { ORDER_STATUS_DIST } from '@/domains/orders/mock_order';
import { ChartCard, type StatusDistPoint } from '@/domains/orders/sections/order-detail-chart';

export function OrderStatusDonut() {
  const typedStatusData = ORDER_STATUS_DIST as StatusDistPoint[];
  const total = typedStatusData.reduce((s, d) => s + d.value, 0);

  // Dynamically turn distribution entries into a valid Shadcn config map
  const donutConfig = React.useMemo(() => {
    const cfg: ChartConfig = {};
    typedStatusData.forEach((d) => {
      cfg[d.name] = { label: d.name, color: d.fill };
    });
    return cfg;
  }, [typedStatusData]);

  return (
    <ChartCard title='Status Distribution' subtitle='Current order breakdown'>
      <div className='flex items-center gap-4'>
        <div className='shrink-0'>
          <ChartContainer config={donutConfig} className='aspect-auto h-35 w-35'>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideIndicator className='min-w-27.5' />}
              />
              <Pie
                data={typedStatusData}
                cx='50%'
                cy='50%'
                innerRadius={45}
                outerRadius={65}
                paddingAngle={3}
                dataKey='value'
                strokeWidth={0}
              />
            </PieChart>
          </ChartContainer>
        </div>

        <div className='flex-1 space-y-2'>
          {typedStatusData.map((d) => (
            <div key={d.name} className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='h-2 w-2 shrink-0 rounded-full' style={{ background: d.fill }} />
                <span className='text-foreground text-[11px] font-semibold'>{d.name}</span>
              </div>
              <div className='flex items-center gap-2'>
                <span className='text-muted-foreground text-[10px] font-medium'>
                  {total > 0 ? Math.round((d.value / total) * 100) : 0}%
                </span>
                <span className='text-foreground text-[11px] font-bold tabular-nums'>
                  {d.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
