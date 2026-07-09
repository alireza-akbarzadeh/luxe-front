'use client';

import {
  IconAdjustmentsDollar,
  IconChartPie,
  IconCreditCard,
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp,
  IconUserPlus
} from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
  formatChangePercent,
  formatKpiValue,
  isPositiveChange
} from '@/domains/dashboard/lib/dashboard-utils';
import { cn } from '@/lib/utils';
import type { DtoAdminSalesAnalyticsKPIs } from '@/services/-admin-analytics-sales-get.schemas';

interface SalesAnalyticsKpiCardsProps {
  kpis?: DtoAdminSalesAnalyticsKPIs;
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
              'bg-opacity-15 flex h-9 w-9 items-center justify-center rounded-xl',
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

export function SalesAnalyticsKpiCards({ kpis }: SalesAnalyticsKpiCardsProps) {
  const items: KpiItem[] = [
    {
      label: 'Revenue',
      value: formatKpiValue('currency', kpis?.revenue),
      change: kpis?.revenue?.change_percent,
      hint: 'vs previous period',
      icon: IconAdjustmentsDollar,
      iconClass: 'bg-emerald-500'
    },
    {
      label: 'Profit',
      value: formatKpiValue('currency', kpis?.profit),
      change: kpis?.profit?.change_percent,
      hint: 'revenue minus cost',
      icon: IconChartPie,
      iconClass: 'bg-teal-500'
    },
    {
      label: 'Orders',
      value: formatKpiValue('count', kpis?.orders),
      change: kpis?.orders?.change_percent,
      hint: 'vs previous period',
      icon: IconShoppingCart,
      iconClass: 'bg-blue-500'
    },
    {
      label: 'New customers',
      value: formatKpiValue('count', kpis?.customers),
      change: kpis?.customers?.change_percent,
      hint: 'signups in period',
      icon: IconUserPlus,
      iconClass: 'bg-violet-500'
    },
    {
      label: 'Avg order value',
      value: formatKpiValue('average', kpis?.avg_order_value),
      change: kpis?.avg_order_value?.change_percent,
      hint: 'paid orders only',
      icon: IconCreditCard,
      iconClass: 'bg-amber-500'
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-5'>
      {items.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  );
}
