import {
  IconShieldCheck,
  IconTrendingDown,
  IconTrendingUp,
  IconUserCheck,
  IconUsers
} from '@tabler/icons-react';
import React from 'react';

import {
  formatChangePercent,
  formatKpiValue,
  isPositiveChange
} from '@/domains/dashboard/lib/dashboard-utils';
import { cn } from '@/lib/utils';
import type { DtoAdminDashboardOverviewResponse } from '@/services/-admin-dashboard-overview-get.schemas';
import type { DtoAdminStatsResponse } from '@/services/-admin-stats-get.schemas';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}

interface UsersKPICardsProps {
  stats?: DtoAdminStatsResponse;
  overview?: DtoAdminDashboardOverviewResponse;
  isLoading?: boolean;
}

function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  trend = 'neutral',
  isLoading
}: KPICardProps) {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';

  return (
    <div className='group bg-card relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md'>
      <div
        className={cn(
          'absolute -top-4 -right-4 h-24 w-24 rounded-full opacity-10 transition-opacity group-hover:opacity-20',
          iconColor
        )}
      />
      <div className='relative flex items-start justify-between'>
        <div>
          <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
            {title}
          </p>
          <p className='text-foreground mt-2 text-3xl font-black tracking-tight'>
            {isLoading ? '—' : value}
          </p>
          {change ? (
            <div
              className={cn(
                'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
                isPositive && 'bg-emerald-100 text-emerald-700',
                isNegative && 'bg-red-100 text-red-700',
                !isPositive && !isNegative && 'bg-muted text-muted-foreground'
              )}
            >
              {isPositive ? (
                <IconTrendingUp className='h-3 w-3' />
              ) : isNegative ? (
                <IconTrendingDown className='h-3 w-3' />
              ) : null}
              {isLoading ? '—' : change}
            </div>
          ) : null}
          <p className='text-muted-foreground mt-1.5 text-[10px]'>{changeLabel}</p>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-2xl',
            iconColor,
            'bg-opacity-15'
          )}
        >
          <Icon className={cn('h-5 w-5', iconColor.replace('bg-', 'text-'))} />
        </div>
      </div>
    </div>
  );
}

export function UsersKPICards({ stats, overview, isLoading }: UsersKPICardsProps) {
  const newCustomersKpi = overview?.kpis?.new_customers;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='Total Users'
        value={(stats?.total_users ?? 0).toLocaleString()}
        changeLabel='Registered accounts platform-wide'
        icon={IconUsers}
        iconColor='bg-blue-500'
        isLoading={isLoading}
      />
      <KPICard
        title='Active Users'
        value={(stats?.active_users ?? 0).toLocaleString()}
        changeLabel='Accounts currently enabled'
        icon={IconUserCheck}
        iconColor='bg-emerald-500'
        isLoading={isLoading}
      />
      <KPICard
        title='Administrators'
        value={(stats?.admin_users ?? 0).toLocaleString()}
        changeLabel='Users with admin access'
        icon={IconShieldCheck}
        iconColor='bg-violet-500'
        isLoading={isLoading}
      />
      <KPICard
        title='New Customers'
        value={formatKpiValue('count', newCustomersKpi)}
        change={formatChangePercent(newCustomersKpi?.change_percent)}
        changeLabel='vs previous 30 days'
        icon={IconUsers}
        iconColor='bg-amber-500'
        trend={isPositiveChange(newCustomersKpi?.change_percent) ? 'up' : 'down'}
        isLoading={isLoading}
      />
    </div>
  );
}
