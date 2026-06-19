'use client';

import { useQueries } from '@tanstack/react-query';

import { getAdminCoupons } from '@/services/-admin-coupons-get';
import type { DtoCouponListResponse } from '@/services/-admin-coupons-get.schemas';

function readTotal(data: DtoCouponListResponse | undefined) {
  return data?.data?.total ?? 0;
}

function KpiCard({
  title,
  value,
  subtitle,
  accent
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div className='bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm'>
      <div className={`absolute -top-4 -right-4 h-20 w-20 rounded-full opacity-10 ${accent}`} />
      <p className='text-muted-foreground text-[10px] font-bold tracking-widest uppercase'>{title}</p>
      <p className='text-foreground mt-2 text-3xl font-black tracking-tight tabular-nums'>{value}</p>
      <p className='text-muted-foreground mt-1 text-[10px]'>{subtitle}</p>
    </div>
  );
}

export function DiscountKpiCards() {
  const statusQueries = useQueries({
    queries: [
      {
        queryKey: ['coupons-kpi', 'all'],
        queryFn: () => getAdminCoupons({ limit: 1, offset: 0, status: 'all' })
      },
      {
        queryKey: ['coupons-kpi', 'active'],
        queryFn: () => getAdminCoupons({ limit: 1, offset: 0, status: 'active' })
      },
      {
        queryKey: ['coupons-kpi', 'inactive'],
        queryFn: () => getAdminCoupons({ limit: 1, offset: 0, status: 'inactive' })
      },
      {
        queryKey: ['coupons-kpi', 'expired'],
        queryFn: () => getAdminCoupons({ limit: 1, offset: 0, status: 'expired' })
      },
      {
        queryKey: ['coupons-kpi', 'exhausted'],
        queryFn: () => getAdminCoupons({ limit: 1, offset: 0, status: 'exhausted' })
      }
    ]
  });

  const loading = statusQueries.some((query) => query.isLoading);
  const dash = loading ? '—' : undefined;

  const allTotal = readTotal(statusQueries[0]?.data);
  const activeTotal = readTotal(statusQueries[1]?.data);
  const inactiveTotal = readTotal(statusQueries[2]?.data);
  const endedTotal =
    readTotal(statusQueries[3]?.data) + readTotal(statusQueries[4]?.data);

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KpiCard
        title='All coupons'
        value={dash ?? allTotal.toLocaleString()}
        subtitle='Total discount codes'
        accent='bg-blue-500'
      />
      <KpiCard
        title='Active'
        value={dash ?? activeTotal.toLocaleString()}
        subtitle='Live at checkout'
        accent='bg-emerald-500'
      />
      <KpiCard
        title='Inactive'
        value={dash ?? inactiveTotal.toLocaleString()}
        subtitle='Draft or paused'
        accent='bg-amber-500'
      />
      <KpiCard
        title='Ended'
        value={dash ?? endedTotal.toLocaleString()}
        subtitle='Expired or usage exhausted'
        accent='bg-violet-500'
      />
    </div>
  );
}
