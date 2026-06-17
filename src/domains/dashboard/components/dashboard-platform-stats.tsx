import {
  IconAlertTriangle,
  IconClock,
  IconPackage,
  IconShoppingCart,
  IconUsers,
  IconWallet
} from '@tabler/icons-react';
import Link from 'next/link';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { DtoAdminStatsResponse } from '@/services/-admin-dashboard-overview-get.schemas';

interface DashboardPlatformStatsProps {
  platform?: DtoAdminStatsResponse;
}

interface StatItem {
  label: string;
  value: string;
  hint: string;
  icon: typeof IconUsers;
  iconClass: string;
  href?: string;
}

function StatCard({ item }: { item: StatItem }) {
  const content = (
    <Card
      className={cn(
        'transition-all',
        item.href && 'hover:-translate-y-0.5 hover:shadow-md'
      )}
    >
      <CardContent className='flex items-start gap-4 p-5'>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-opacity-15',
            item.iconClass
          )}
        >
          <item.icon className={cn('h-5 w-5', item.iconClass.replace('bg-', 'text-'))} />
        </div>
        <div className='min-w-0'>
          <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
            {item.label}
          </p>
          <p className='mt-1 text-2xl font-semibold tracking-tight tabular-nums'>{item.value}</p>
          <p className='text-muted-foreground mt-1 text-xs'>{item.hint}</p>
        </div>
      </CardContent>
    </Card>
  );

  if (item.href) {
    return (
      <Link href={item.href} className='block'>
        {content}
      </Link>
    );
  }

  return content;
}

export function DashboardPlatformStats({ platform }: DashboardPlatformStatsProps) {
  const items: StatItem[] = [
    {
      label: 'Total users',
      value: (platform?.total_users ?? 0).toLocaleString(),
      hint: 'Registered accounts',
      icon: IconUsers,
      iconClass: 'bg-violet-500',
      href: '/dashboard/users'
    },
    {
      label: 'All-time orders',
      value: (platform?.total_orders ?? 0).toLocaleString(),
      hint: 'Lifetime order count',
      icon: IconShoppingCart,
      iconClass: 'bg-blue-500',
      href: '/dashboard/orders'
    },
    {
      label: 'Active products',
      value: (platform?.total_active_products ?? 0).toLocaleString(),
      hint: 'Published catalog items',
      icon: IconPackage,
      iconClass: 'bg-emerald-500',
      href: '/dashboard/products'
    },
    {
      label: 'Pending orders',
      value: (platform?.pending_orders ?? 0).toLocaleString(),
      hint: 'Needs attention',
      icon: IconClock,
      iconClass: 'bg-amber-500',
      href: '/dashboard/orders'
    },
    {
      label: 'Wallet balance',
      value: formatCurrency(platform?.total_wallet_balance ?? 0),
      hint: 'Total customer wallets',
      icon: IconWallet,
      iconClass: 'bg-sky-500'
    },
    {
      label: 'Low stock',
      value: (platform?.low_stock_products ?? 0).toLocaleString(),
      hint: 'Products below threshold',
      icon: IconAlertTriangle,
      iconClass: 'bg-rose-500',
      href: '/dashboard/inventory'
    }
  ];

  return (
    <section>
      <Card className='border-dashed'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Platform snapshot</CardTitle>
          <CardDescription>
            All-time totals and operational alerts · lifetime revenue{' '}
            {formatCurrency(platform?.total_revenue ?? 0)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            {items.map((item) => (
              <StatCard key={item.label} item={item} />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
