'use client';

import {
  IconAdjustmentsDollar,
  IconCalendarStats,
  IconCreditCard,
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp
} from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  formatChangePercent,
  formatKpiValue,
  isPositiveChange
} from '@/domains/dashboard/lib/dashboard-utils';
import type { DtoAdminRevenueReportSummary } from '@/services/-admin-reports-revenue-get.schemas';

interface RevenueKpiCardsProps {
  summary?: DtoAdminRevenueReportSummary;
}

interface KpiItem {
  label: string;
  value: string;
  change?: number;
  hint: string;
  icon: typeof IconAdjustmentsDollar;
  iconClass: string;
}

function KpiCard({ item }: { item: KpiItem }) {
  const positive = isPositiveChange(item.change);

  return (
    <Card className='overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md'>
      <CardHeader className='pb-2'>
        <div className='flex items-center justify-between'>
          <CardDescription className='text-[10px] tracking-widest uppercase'>
            {item.label}
          </CardDescription>
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-xl bg-opacity-15',
              item.iconClass
            )}
          >
            <item.icon className={cn('h-4 w-4', item.iconClass.replace('bg-', 'text-'))} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='text-3xl font-semibold tracking-tight tabular-nums'>{item.value}</div>
        <div className='mt-2 flex items-center gap-2 text-xs'>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-medium',
              positive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
            )}
          >
            {positive ? (
              <IconTrendingUp className='h-3 w-3' />
            ) : (
              <IconTrendingDown className='h-3 w-3' />
            )}
            {formatChangePercent(item.change)}
          </span>
          <span className='text-muted-foreground'>{item.hint}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function RevenueKpiCards({ summary }: RevenueKpiCardsProps) {
  const items: KpiItem[] = [
    {
      label: 'Gross revenue',
      value: formatKpiValue('currency', summary?.revenue),
      change: summary?.revenue?.change_percent,
      hint: 'vs previous period',
      icon: IconAdjustmentsDollar,
      iconClass: 'bg-emerald-500'
    },
    {
      label: 'Orders',
      value: formatKpiValue('count', summary?.orders),
      change: summary?.orders?.change_percent,
      hint: 'vs previous period',
      icon: IconShoppingCart,
      iconClass: 'bg-blue-500'
    },
    {
      label: 'Avg order value',
      value: formatKpiValue('average', summary?.avg_order_value),
      change: summary?.avg_order_value?.change_percent,
      hint: 'paid orders only',
      icon: IconCreditCard,
      iconClass: 'bg-violet-500'
    },
    {
      label: 'Avg daily revenue',
      value: formatKpiValue('currency', summary?.avg_daily_revenue),
      change: summary?.avg_daily_revenue?.change_percent,
      hint: 'vs previous period',
      icon: IconCalendarStats,
      iconClass: 'bg-amber-500'
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {items.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}
