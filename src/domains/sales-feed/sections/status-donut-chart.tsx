import { Cell, Pie, PieChart } from 'recharts';

export function StatusDonutChart({
  data
}: {
  data: { name: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className='text-muted-foreground flex h-[140px] items-center justify-center text-sm'>
        No orders yet today
      </div>
    );
  }

  return (
    <div className='flex items-center gap-6'>
      <div className='relative shrink-0'>
        <PieChart width={140} height={140}>
          <Pie
            data={data}
            cx={70}
            cy={70}
            innerRadius={44}
            outerRadius={64}
            paddingAngle={2}
            dataKey='value'
            strokeWidth={0}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
        <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
          <span className='text-xl font-black tabular-nums'>{total}</span>
          <span className='text-muted-foreground text-[9px] font-bold tracking-widest uppercase'>
            total
          </span>
        </div>
      </div>
      <div className='flex flex-col gap-1.5'>
        {data.map((item) => (
          <div key={item.name} className='flex items-center gap-2'>
            <span className='h-2 w-2 shrink-0 rounded-full' style={{ background: item.color }} />
            <span className='text-muted-foreground text-[11px] font-semibold'>{item.name}</span>
            <span className='ml-auto pl-3 text-[11px] font-black tabular-nums'>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
