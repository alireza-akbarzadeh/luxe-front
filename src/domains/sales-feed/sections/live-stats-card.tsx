import { IconTrendingDown, IconTrendingUp, type TablerIcon } from '@tabler/icons-react';

import { cn } from '@/lib/utils';

export function LiveStatCard({
  label,
  value,
  delta,
  deltaLabel = 'vs last min',
  icon: Icon,
  iconColor = 'text-primary',
  iconBg = 'bg-primary/10',
  pulse = false
}: {
  label: string;
  value: string | number;
  delta?: number;
  deltaLabel?: string;
  icon: TablerIcon;
  iconColor?: string;
  iconBg?: string;
  pulse?: boolean;
}) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm'>
      {pulse && (
        <span className='absolute top-4 right-4 flex h-2.5 w-2.5'>
          <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75' />
          <span className='relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500' />
        </span>
      )}
      <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBg)}>
        <Icon className={cn('h-5 w-5', iconColor)} />
      </div>
      <div className='mt-4'>
        <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
          {label}
        </p>
        <p className='mt-1 text-2xl font-black tracking-tight tabular-nums'>{value}</p>
        {delta !== undefined && (
          <div
            className={cn(
              'mt-2 flex items-center gap-1 text-[11px] font-bold',
              isPositive ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            {isPositive ? (
              <IconTrendingUp className='h-3 w-3' />
            ) : (
              <IconTrendingDown className='h-3 w-3' />
            )}
            {Math.abs(delta).toFixed(1)}% {deltaLabel}
          </div>
        )}
      </div>
    </div>
  );
}
