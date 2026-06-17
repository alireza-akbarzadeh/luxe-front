import {
  IconAdjustmentsDollar,
  IconCreditCard,
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp,
  IconUsers
} from '@tabler/icons-react';

import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DtoAdminDashboardKPIs } from '@/services/-admin-dashboard-overview-get.schemas';

import {
  formatChangePercent,
  formatKpiValue,
  isPositiveChange
} from '../lib/dashboard-utils';

interface DashboardKpiCardsProps {
  kpis?: DtoAdminDashboardKPIs;
}

interface KpiCardItem {
  label: string;
  value: string;
  change?: number;
  hint: string;
  icon: typeof IconAdjustmentsDollar;
  iconClass: string;
}

function KpiCard({ item }: { item: KpiCardItem }) {
  const positive = isPositiveChange(item.change);

  return (
    <Card className='group overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md'>
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

export function DashboardKpiCards({ kpis }: DashboardKpiCardsProps) {
  const items: KpiCardItem[] = [
    {
      label: 'Gross revenue',
      value: formatKpiValue('currency', kpis?.revenue),
      change: kpis?.revenue?.change_percent,
      hint: 'vs previous period',
      icon: IconAdjustmentsDollar,
      iconClass: 'bg-emerald-500'
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
      value: formatKpiValue('count', kpis?.new_customers),
      change: kpis?.new_customers?.change_percent,
      hint: 'vs previous period',
      icon: IconUsers,
      iconClass: 'bg-violet-500'
    },
    {
      label: 'Avg. order value',
      value: formatKpiValue('average', kpis?.avg_order_value),
      change: kpis?.avg_order_value?.change_percent,
      hint: 'vs previous period',
      icon: IconCreditCard,
      iconClass: 'bg-amber-500'
    }
  ];

  return (
    <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
      {items.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </section>
  );
}
