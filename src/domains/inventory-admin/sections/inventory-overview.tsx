'use client';

import {
  IconAlertTriangle,
  IconBell,
  IconPackage,
  IconPackages,
  IconStack2
} from '@tabler/icons-react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { DtoInventoryOverviewResponse } from '@/services/-admin-inventory-overview-get.schemas';

interface InventoryOverviewProps {
  overview?: DtoInventoryOverviewResponse;
  isLoading?: boolean;
  activeStatus?: string;
  onStatusSelect?: (status: string) => void;
}

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: typeof IconPackage;
  iconClass: string;
  active?: boolean;
  onClick?: () => void;
}

function StatCard({ label, value, hint, icon: Icon, iconClass, active, onClick }: StatCardProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'text-left transition-all',
        onClick && 'hover:-translate-y-0.5 hover:shadow-md',
        active && 'ring-primary ring-2 ring-offset-2'
      )}
    >
      <Card className='h-full'>
        <CardContent className='flex items-start gap-4 p-5'>
          <div
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-opacity-15',
              iconClass
            )}
          >
            <Icon className={cn('h-5 w-5', iconClass.replace('bg-', 'text-'))} />
          </div>
          <div className='min-w-0'>
            <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>
              {label}
            </p>
            <p className='mt-1 text-2xl font-semibold tracking-tight tabular-nums'>{value}</p>
            <p className='text-muted-foreground mt-1 text-xs'>{hint}</p>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}

export function InventoryOverview({
  overview,
  isLoading,
  activeStatus,
  onStatusSelect
}: InventoryOverviewProps) {
  if (isLoading) {
    return (
      <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className='h-28 rounded-xl' />
        ))}
      </div>
    );
  }

  const items: StatCardProps[] = [
    {
      label: 'Units on hand',
      value: (overview?.total_units_on_hand ?? 0).toLocaleString(),
      hint: 'Tracked SKUs only',
      icon: IconStack2,
      iconClass: 'bg-emerald-500'
    },
    {
      label: 'Tracked SKUs',
      value: (overview?.tracked_sku_count ?? 0).toLocaleString(),
      hint: 'Products with inventory tracking',
      icon: IconPackage,
      iconClass: 'bg-blue-500',
      active: activeStatus === 'all',
      onClick: () => onStatusSelect?.('all')
    },
    {
      label: 'Low stock',
      value: (overview?.low_stock_count ?? 0).toLocaleString(),
      hint: 'At or below threshold',
      icon: IconAlertTriangle,
      iconClass: 'bg-amber-500',
      active: activeStatus === 'low',
      onClick: () => onStatusSelect?.('low')
    },
    {
      label: 'Out of stock',
      value: (overview?.out_of_stock_count ?? 0).toLocaleString(),
      hint: 'Tracked with zero on hand',
      icon: IconPackages,
      iconClass: 'bg-rose-500',
      active: activeStatus === 'out',
      onClick: () => onStatusSelect?.('out')
    },
    {
      label: 'Not tracked',
      value: (overview?.not_tracked_count ?? 0).toLocaleString(),
      hint: 'Manual / unlimited catalog',
      icon: IconPackage,
      iconClass: 'bg-slate-500',
      active: activeStatus === 'not_tracked',
      onClick: () => onStatusSelect?.('not_tracked')
    },
    {
      label: 'Waitlist',
      value: (overview?.waitlist_total ?? 0).toLocaleString(),
      hint: 'Back-in-stock subscribers',
      icon: IconBell,
      iconClass: 'bg-violet-500'
    }
  ];

  return (
    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </div>
  );
}
