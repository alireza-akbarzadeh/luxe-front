'use client';

import { useQueries } from '@tanstack/react-query';

import { getAdminWebhooks } from '@/services/-admin-webhooks-get';

import type { GetAdminWebhooks200 } from '../lib/webhook-list';

function readTotal(data: GetAdminWebhooks200 | undefined) {
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

export function WebhookKpiCards() {
  const statusQueries = useQueries({
    queries: [
      {
        queryKey: ['webhooks-kpi', 'all'],
        queryFn: () => getAdminWebhooks({ limit: 1, offset: 0 })
      },
      {
        queryKey: ['webhooks-kpi', 'received'],
        queryFn: () => getAdminWebhooks({ limit: 1, offset: 0, status: 'received' })
      },
      {
        queryKey: ['webhooks-kpi', 'processed'],
        queryFn: () => getAdminWebhooks({ limit: 1, offset: 0, status: 'processed' })
      },
      {
        queryKey: ['webhooks-kpi', 'failed'],
        queryFn: () => getAdminWebhooks({ limit: 1, offset: 0, status: 'failed' })
      }
    ]
  });

  const loading = statusQueries.some((query) => query.isLoading);
  const dash = loading ? '—' : undefined;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KpiCard
        title='All events'
        value={dash ?? readTotal(statusQueries[0]?.data as GetAdminWebhooks200 | undefined).toLocaleString()}
        subtitle='Inbound webhook deliveries'
        accent='bg-blue-500'
      />
      <KpiCard
        title='Received'
        value={dash ?? readTotal(statusQueries[1]?.data as GetAdminWebhooks200 | undefined).toLocaleString()}
        subtitle='Awaiting processing'
        accent='bg-amber-500'
      />
      <KpiCard
        title='Processed'
        value={dash ?? readTotal(statusQueries[2]?.data as GetAdminWebhooks200 | undefined).toLocaleString()}
        subtitle='Handled successfully'
        accent='bg-emerald-500'
      />
      <KpiCard
        title='Failed'
        value={dash ?? readTotal(statusQueries[3]?.data as GetAdminWebhooks200 | undefined).toLocaleString()}
        subtitle='Processing errors'
        accent='bg-red-500'
      />
    </div>
  );
}
