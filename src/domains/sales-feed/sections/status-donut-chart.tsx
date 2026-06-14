import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { ChartTooltip } from '@/components/ui/chart';

export function StatusDonutChart({
  data
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((s: number, d: { value: number }) => s + d.value, 0);
  return (
    <div className='flex items-center gap-6'>
      <div className='relative shrink-0'>
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='50%'
              innerRadius={44}
              outerRadius={64}
              paddingAngle={2}
              dataKey='value'
              strokeWidth={0}
            />

            <Tooltip content={<ChartTooltip active={false} />} />
          </PieChart>
        </ResponsiveContainer>
        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-xl font-black tabular-nums'>{total}</span>
          <span className='text-muted-foreground text-[9px] font-bold tracking-widest uppercase'>
            total
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-1.5'>
        {data.map((d) => (
          <div key={d.name} className='flex items-center gap-2'>
            <span className='h-2 w-2 shrink-0 rounded-full' style={{ background: d.color }} />
            <span className='text-muted-foreground text-[11px] font-semibold'>{d.name}</span>
            <span className='ml-auto pl-3 text-[11px] font-black tabular-nums'>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
