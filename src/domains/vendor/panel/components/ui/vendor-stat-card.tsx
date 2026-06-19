import type { TablerIcon } from '@tabler/icons-react';
import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface VendorStatCardProps {
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: TablerIcon;
  className?: string;
}

export function VendorStatCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  className
}: VendorStatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn('border-border/40 bg-card/50 rounded-2xl shadow-none', className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-muted-foreground text-sm font-medium'>{label}</CardTitle>
        {Icon ? (
          <div className='bg-muted/60 flex size-8 items-center justify-center rounded-lg'>
            <Icon className='text-muted-foreground size-4' aria-hidden />
          </div>
        ) : null}
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-semibold tracking-tight tabular-nums'>{value}</p>
        {change !== undefined ? (
          <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
            {isPositive ? (
              <IconTrendingUp className='size-3.5 text-emerald-600 dark:text-emerald-400' aria-hidden />
            ) : (
              <IconTrendingDown className='size-3.5 text-red-500' aria-hidden />
            )}
            <span className={isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            {changeLabel ? <span>{changeLabel}</span> : <span>vs last period</span>}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
