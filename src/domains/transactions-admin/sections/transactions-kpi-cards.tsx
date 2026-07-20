'use client';

import { Text } from '@/components/ui/typography';
import { formatCurrency } from '@/lib/format';
import { useGetAdminTransactionsSummary } from '@/services/-admin-transactions-summary-get';

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
      <Text variant='overline'>{title}</Text>
      <p className='text-foreground mt-2 text-3xl font-black tabular-nums'>{value}</p>
      <Text variant='subtle' className='mt-1'>
        {subtitle}
      </Text>
    </div>
  );
}

/** Combined payment + wallet KPI cards for the transactions hub. */
export function TransactionsKPICards() {
  const { data, isLoading } = useGetAdminTransactionsSummary();
  const summary = data?.data;
  const dash = isLoading ? '—' : undefined;

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      <KPICard
        title='Order payments'
        value={dash ?? (summary?.payments_total ?? 0).toLocaleString()}
        subtitle='Gateway payment records'
        accent='bg-blue-500'
      />
      <KPICard
        title='Payment volume'
        value={dash ?? formatCurrency(summary?.payments_volume ?? 0, 'USD')}
        subtitle='Completed payment total'
        accent='bg-emerald-500'
      />
      <KPICard
        title='Wallet ledger'
        value={dash ?? (summary?.wallet_tx_total ?? 0).toLocaleString()}
        subtitle='Wallet credits & debits'
        accent='bg-violet-500'
      />
      <KPICard
        title='Needs attention'
        value={
          dash ??
          ((summary?.pending_payments ?? 0) + (summary?.failed_payments ?? 0)).toLocaleString()
        }
        subtitle='Pending or failed payments'
        accent='bg-amber-500'
      />
    </div>
  );
}
