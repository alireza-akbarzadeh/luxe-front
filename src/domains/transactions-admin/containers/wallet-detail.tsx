'use client';

import { IconAlertTriangle, IconArrowLeft } from '@tabler/icons-react';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { ApiPaymentStatusBadge } from '@/domains/orders/components/order-api-badges';
import { WalletTypeBadge } from '@/domains/transactions-admin/components/wallet-type-badge';
import { TransactionDetailSkeleton } from '@/domains/transactions-admin/sections/transaction-detail-skeleton';
import { formatCurrency } from '@/lib/format';
import { useGetAdminWalletTransactionsId } from '@/services/-admin-wallet-transactions-{id}-get';
import type { DtoAdminWalletTxDetailResponse } from '@/services/-admin-wallet-transactions-{id}-get.schemas';

interface WalletDetailDomainProps {
  transactionId: string;
}

function formatDate(value?: string) {
  if (!value) return '—';
  const date = parseISO(value);
  if (Number.isNaN(date.getTime())) return '—';
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function WalletDetailDomain({ transactionId }: WalletDetailDomainProps) {
  const numericId = Number(transactionId);
  const isValidId = Number.isFinite(numericId) && numericId > 0;

  const { data, isLoading, isError, error, refetch } = useGetAdminWalletTransactionsId(numericId, {
    query: { enabled: isValidId }
  });

  if (!isValidId) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className='mx-auto max-w-350 px-6 py-8'>
        <TransactionDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const message =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Failed to load wallet transaction';

    return (
      <Flex align='center' justify='center' className='min-h-[50vh] p-8'>
        <div className='max-w-md rounded-2xl border-2 border-dashed p-12 text-center'>
          <IconAlertTriangle className='text-destructive mx-auto mb-4 h-12 w-12' />
          <Typography.H4>Transaction unavailable</Typography.H4>
          <Text variant='muted' className='mt-2'>
            {message}
          </Text>
          <Button className='mt-4' variant='outline' onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      </Flex>
    );
  }

  const tx = data?.data;
  if (!tx?.id) {
    notFound();
  }

  return <WalletDetailView tx={tx} />;
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Flex justify='between' align='start' className='gap-4 text-sm'>
      <Text variant='muted'>{label}</Text>
      <span className='text-right text-xs font-semibold'>{value}</span>
    </Flex>
  );
}

function WalletDetailView({ tx }: { tx: DtoAdminWalletTxDetailResponse }) {
  const amount = tx.amount ?? 0;
  const isCredit = amount >= 0;
  const metadataJson =
    tx.metadata && Object.keys(tx.metadata).length > 0
      ? JSON.stringify(tx.metadata, null, 2)
      : null;

  return (
    <div className='bg-background min-h-screen'>
      <div className='bg-card/80 border-border/40 sticky top-0 z-20 border-b backdrop-blur-sm'>
        <div className='mx-auto max-w-350 px-6 py-4'>
          <Flex align='start' className='gap-4'>
            <Link href='/dashboard/transactions?tab=wallet'>
              <Button
                variant='ghost'
                size='icon'
                className='border-border/60 h-9 w-9 shrink-0 rounded-xl border shadow-sm'
              >
                <IconArrowLeft className='h-4 w-4' />
              </Button>
            </Link>
            <div>
              <Flex align='center' className='flex-wrap gap-3'>
                <Typography.H4 className='font-mono font-bold'>Wallet #{tx.id}</Typography.H4>
                <WalletTypeBadge type={tx.type} size='md' />
                <ApiPaymentStatusBadge status={tx.status} size='md' />
              </Flex>
              <Text variant='muted' className='mt-1'>
                {tx.description ?? 'Wallet ledger entry'} · Created {formatDate(tx.created_at)}
              </Text>
            </div>
          </Flex>
        </div>
      </div>

      <div className='mx-auto max-w-350 space-y-6 px-6 py-8'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {metadataJson ? (
              <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
                <Text variant='overline'>Metadata</Text>
                <pre className='bg-muted/50 mt-4 max-h-96 overflow-auto rounded-xl p-4 font-mono text-[11px] leading-relaxed'>
                  {metadataJson}
                </pre>
              </div>
            ) : (
              <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
                <Text variant='muted'>No metadata attached to this entry.</Text>
              </div>
            )}
          </div>

          <div className='space-y-5'>
            <div className='bg-card border-border/40 rounded-2xl border p-6 shadow-sm'>
              <Text variant='overline'>Amount</Text>
              <Typography.H3
                className={`mt-3 text-3xl font-black tabular-nums ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {isCredit ? '+' : ''}
                {formatCurrency(amount, 'USD')}
              </Typography.H3>
              <Text variant='muted' className='mt-2'>
                Balance after {formatCurrency(tx.balance_after ?? 0, 'USD')}
              </Text>
            </div>

            <div className='bg-card border-border/40 space-y-3 rounded-2xl border p-6 shadow-sm'>
              <Text variant='overline'>Details</Text>
              <DetailRow label='Customer' value={tx.customer_name ?? '—'} />
              <DetailRow label='Email' value={tx.customer_email ?? '—'} />
              <DetailRow label='User ID' value={tx.user_id ?? '—'} />
              <DetailRow label='Reference type' value={tx.reference_type ?? '—'} />
              <DetailRow label='Reference ID' value={tx.reference_id ?? '—'} />
              <DetailRow label='Stripe session' value={tx.stripe_session_id ?? '—'} />
              <DetailRow label='Updated' value={formatDate(tx.updated_at)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
