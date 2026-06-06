import {
  IconBasketDollar,
  IconClock,
  IconRefresh,
  IconShoppingCart,
  IconTrendingDown,
  IconTrendingUp
} from '@tabler/icons-react';
import React from 'react';

import { cn } from '@/lib/utils';

// Types
interface Order {
  total?: number;
  status: string;
  payment_status: string;
}

interface KPICardProps {
  title: string;
  value: string | number;
  change: string;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  trend: 'up' | 'down';
}

interface OrdersKPICardsProps {
  orders: Order[];
}

function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  trend
}: KPICardProps) {
  const isPositive = trend === 'up';
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
          <p className='text-foreground mt-2 text-3xl font-black tracking-tight'>{value}</p>
          <div
            className={cn(
              'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold',
              isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            )}
          >
            {isPositive ? (
              <IconTrendingUp className='h-3 w-3' />
            ) : (
              <IconTrendingDown className='h-3 w-3' />
            )}
            {change}
          </div>
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

export function OrdersKPICards({ orders }: OrdersKPICardsProps) {
  const total = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pending = orders.filter((order) => ['Pending', 'Processing'].includes(order.status)).length;
  const refunded = orders.filter((order) => order.payment_status === 'Refunded').length;

  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='Total Orders'
        value={total.toLocaleString()}
        change='+18.2%'
        changeLabel='vs last 30 days'
        icon={IconShoppingCart}
        iconColor='bg-blue-500'
        trend='up'
      />
      <KPICard
        title='Total Revenue'
        value={formatCurrency(totalRevenue)}
        change='+24.5%'
        changeLabel='vs last 30 days'
        icon={IconBasketDollar}
        iconColor='bg-emerald-500'
        trend='up'
      />
      <KPICard
        title='Awaiting Action'
        value={pending}
        change='-3.1%'
        changeLabel='vs last 7 days'
        icon={IconClock}
        iconColor='bg-amber-500'
        trend='down'
      />
      <KPICard
        title='Refunded'
        value={refunded}
        change='-12.0%'
        changeLabel='vs last 30 days'
        icon={IconRefresh}
        iconColor='bg-red-500'
        trend='down'
      />
    </div>
  );
}
