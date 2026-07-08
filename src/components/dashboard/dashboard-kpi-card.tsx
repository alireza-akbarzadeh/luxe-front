import type { TablerIcon } from '@tabler/icons-react';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { DashboardSparkline } from '@/components/dashboard/dashboard-sparkline';
import { cn } from '@/lib/utils';

interface DashboardKpiCardProps {
  label: string;
  value: string;
  change?: number;
  changeHint?: string;
  icon?: TablerIcon;
  iconClassName?: string;
  sparkline?: number[];
  sparklineColor?: string;
  className?: string;
}

/** KPI card styled for the luxe dashboard shell (dark analytics layout). */
export function DashboardKpiCard({
  label,
  value,
  change,
  changeHint = 'vs last 30 days',
  icon: Icon,
  iconClassName,
  sparkline,
  sparklineColor,
  className
}: DashboardKpiCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <article className={cn('dashboard-card dashboard-kpi-card', className)}>
      <div className='flex items-start justify-between gap-3'>
        <p className='text-muted-foreground text-xs font-medium'>{label}</p>
        {Icon ? (
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-lg',
              iconClassName ?? 'bg-emerald-500/10 text-emerald-400'
            )}
          >
            <Icon className='size-4' aria-hidden />
          </div>
        ) : null}
      </div>

      <p className='mt-2 text-2xl font-semibold tracking-tight tabular-nums'>{value}</p>

      {change !== undefined ? (
        <p className='mt-1 flex items-center gap-1 text-xs'>
          {isPositive ? (
            <IconTrendingUp className='size-3.5 text-emerald-400' aria-hidden />
          ) : (
            <IconTrendingDown className='size-3.5 text-rose-400' aria-hidden />
          )}
          <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {isPositive ? '+' : ''}
            {change}%
          </span>
          <span className='text-muted-foreground'>{changeHint}</span>
        </p>
      ) : null}

      {sparkline && sparkline.length > 1 ? (
        <div className='mt-3 opacity-80'>
          <DashboardSparkline data={sparkline} color={sparklineColor} />
        </div>
      ) : null}
    </article>
  );
}
