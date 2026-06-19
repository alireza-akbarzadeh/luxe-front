'use client';

import { useQueries } from '@tanstack/react-query';

import { RETURN_ACTION_STATUSES } from '@/domains/returns-admin/returns.schema';
import { getAdminReturns } from '@/services/-admin-returns-get';

import type { GetAdminReturns200 } from '../lib/return-list';

function readTotal(data: GetAdminReturns200 | undefined) {
  return data?.data?.total ?? 0;
}

interface ReturnsKPICardsProps {
  isLoading?: boolean;
}

function KPICard({
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

export function ReturnsKPICards({ isLoading }: ReturnsKPICardsProps) {
  const statusQueries = useQueries({
    queries: [
      { queryKey: ['returns-kpi', 'all'], queryFn: () => getAdminReturns({ limit: 1, offset: 0 }) },
      ...RETURN_ACTION_STATUSES.map((status) => ({
        queryKey: ['returns-kpi', status],
        queryFn: () => getAdminReturns({ status, limit: 1, offset: 0 })
      }))
    ]
  });

  const allTotal = readTotal(statusQueries[0]?.data);
  const openTotal = RETURN_ACTION_STATUSES.reduce((sum, _status, index) => {
    const total = readTotal(statusQueries[index + 1]?.data);
    return sum + total;
  }, 0);
  const requestedTotal = readTotal(statusQueries[1]?.data);
  const refundProcessingTotal = readTotal(statusQueries[4]?.data);

  const loading = isLoading || statusQueries.some((query) => query.isLoading);
  const dash = loading ? '—' : undefined;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='All returns'
        value={dash ?? allTotal.toLocaleString()}
        subtitle='Total return requests'
        accent='bg-blue-500'
      />
      <KPICard
        title='Needs action'
        value={dash ?? openTotal.toLocaleString()}
        subtitle='Requested through refund processing'
        accent='bg-amber-500'
      />
      <KPICard
        title='New requests'
        value={dash ?? requestedTotal.toLocaleString()}
        subtitle='Awaiting admin review'
        accent='bg-violet-500'
      />
      <KPICard
        title='Refunding'
        value={dash ?? refundProcessingTotal.toLocaleString()}
        subtitle='Refund in progress'
        accent='bg-emerald-500'
      />
    </div>
  );
}
