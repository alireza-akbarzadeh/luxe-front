'use client';

import { IconCalendar, IconChevronDown } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  dashboardPeriodLabel,
  dashboardPeriods,
  useDashboardPeriod
} from '@/domains/dashboard/hooks/use-dashboard-period';
import { cn } from '@/lib/utils';

interface HeaderPeriodControlProps {
  className?: string;
}

/** Period filter — icon-only on small screens, labeled pill on lg+. */
export function HeaderPeriodControl({ className }: HeaderPeriodControlProps) {
  const [period, setPeriod] = useDashboardPeriod();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='icon'
          variant='outline'
          aria-label={dashboardPeriodLabel(period)}
          className={cn(
            'hidden h-9 shrink-0 rounded-xl border-white/10 bg-transparent sm:inline-flex lg:hidden',
            className
          )}
        >
          <IconCalendar className='size-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        {dashboardPeriods.map((option) => (
          <DropdownMenuItem key={option} onClick={() => setPeriod(option)}>
            {dashboardPeriodLabel(option)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeaderPeriodControlWide({ className }: HeaderPeriodControlProps) {
  const [period, setPeriod] = useDashboardPeriod();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size='sm'
          variant='outline'
          className={cn(
            'hidden h-9 gap-1 rounded-xl border-white/10 bg-transparent lg:inline-flex',
            className
          )}
        >
          <IconCalendar className='size-4 shrink-0' />
          <span>{dashboardPeriodLabel(period)}</span>
          <IconChevronDown className='size-3 shrink-0 opacity-60' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-44'>
        {dashboardPeriods.map((option) => (
          <DropdownMenuItem key={option} onClick={() => setPeriod(option)}>
            {dashboardPeriodLabel(option)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
