'use client';

import { useQueries } from '@tanstack/react-query';

import { INVOICE_OUTSTANDING_STATUSES } from '@/domains/invoices-admin/invoices.schema';
import { getAdminInvoices } from '@/services/-admin-invoices-get';
import type { GetAdminInvoices200 } from '@/services/-admin-invoices-get.schemas';

function readTotal(data: GetAdminInvoices200 | undefined) {
  return data?.data?.total ?? 0;
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

export function InvoicesKPICards() {
  const statusQueries = useQueries({
    queries: [
      { queryKey: ['invoices-kpi', 'all'], queryFn: () => getAdminInvoices({ limit: 1, offset: 0 }) },
      ...INVOICE_OUTSTANDING_STATUSES.map((status) => ({
        queryKey: ['invoices-kpi', status],
        queryFn: () => getAdminInvoices({ status, limit: 1, offset: 0 })
      })),
      { queryKey: ['invoices-kpi', 'paid'], queryFn: () => getAdminInvoices({ status: 'paid', limit: 1, offset: 0 }) },
      { queryKey: ['invoices-kpi', 'refunded'], queryFn: () => getAdminInvoices({ status: 'refunded', limit: 1, offset: 0 }) }
    ]
  });

  const allTotal = readTotal(statusQueries[0]?.data);
  const outstandingTotal = INVOICE_OUTSTANDING_STATUSES.reduce((sum, _status, index) => {
    return sum + readTotal(statusQueries[index + 1]?.data);
  }, 0);
  const paidTotal = readTotal(statusQueries[3]?.data);
  const refundedTotal = readTotal(statusQueries[4]?.data);

  const loading = statusQueries.some((query) => query.isLoading);
  const dash = loading ? '—' : undefined;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='All invoices'
        value={dash ?? allTotal.toLocaleString()}
        subtitle='Total billing records'
        accent='bg-blue-500'
      />
      <KPICard
        title='Outstanding'
        value={dash ?? outstandingTotal.toLocaleString()}
        subtitle='Draft or issued, awaiting payment'
        accent='bg-amber-500'
      />
      <KPICard
        title='Paid'
        value={dash ?? paidTotal.toLocaleString()}
        subtitle='Successfully collected'
        accent='bg-emerald-500'
      />
      <KPICard
        title='Refunded'
        value={dash ?? refundedTotal.toLocaleString()}
        subtitle='Refunded to customer'
        accent='bg-violet-500'
      />
    </div>
  );
}
