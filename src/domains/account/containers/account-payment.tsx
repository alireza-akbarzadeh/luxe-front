'use client';

import {
  IconArrowDownLeft,
  IconArrowUpRight,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconPlus,
  IconWallet
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { useGetWallet } from '~/src/services/-wallet-get';

import { AccountWalletSkeleton } from '../components/account-wallet-skeleton';
import { WalletBalanceChart } from '../components/wallet-balance-chart';
import { WalletDepositDialog } from '../components/wallet-deposit-dialog';
import { WalletTransactionRow } from '../components/wallet-transaction-row';
import { WalletWithdrawDialog } from '../components/wallet-withdraw-dialog';
import {
  buildWalletActivitySeries,
  buildWalletBalanceSeries,
  formatWalletAmount,
  resolveWalletBalance,
  summarizeWalletActivity
} from '../lib/wallet-utils';

const PAGE_SIZE = 8;
const CHART_LIMIT = 100;

export function AccountPayment() {
  const [page, setPage] = useState(0);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const offset = page * PAGE_SIZE;
  const t = useTranslations('account.wallet');
  const tCommon = useTranslations('account.common');

  const {
    data: listResponse,
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList
  } = useGetWallet({ limit: PAGE_SIZE, offset });

  const { data: chartResponse, isLoading: isChartLoading } = useGetWallet({
    limit: CHART_LIMIT,
    offset: 0
  });

  const wallet = listResponse?.data;
  const chartWallet = chartResponse?.data;
  const chartTransactions = chartWallet?.transactions ?? [];
  const transactions = wallet?.transactions ?? [];
  const totalTransactions = wallet?.total ?? chartWallet?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalTransactions / PAGE_SIZE));
  const currency = chartWallet?.currency ?? wallet?.currency ?? 'USD';
  const balance = resolveWalletBalance(
    chartWallet?.balance ?? wallet?.balance,
    chartTransactions.length > 0 ? chartTransactions : transactions
  );

  const balanceSeries = buildWalletBalanceSeries(chartTransactions);
  const activitySeries = buildWalletActivitySeries(chartTransactions);
  const { totalIn, totalOut, pendingCount } = summarizeWalletActivity(chartTransactions);

  const isLoading = isListLoading || isChartLoading;

  const handlePrev = () => setPage((current) => Math.max(0, current - 1));
  const handleNext = () => setPage((current) => Math.min(totalPages - 1, current + 1));

  if (isLoading) {
    return <AccountWalletSkeleton />;
  }

  if (isListError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-12'>
        <p className='text-destructive font-medium'>{t('loadError')}</p>
        <p className='text-muted-foreground mt-2 text-sm'>{tCommon('connectionError')}</p>
        <Button variant='outline' className='mt-5' onClick={() => void refetchList()}>
          {tCommon('retry')}
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <h2 className='font-display text-2xl font-semibold tracking-tight'>{t('title')}</h2>
          <p className='text-muted-foreground mt-1 text-sm'>{t('subtitle')}</p>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button className='rounded-full' onClick={() => setDepositOpen(true)}>
            <IconPlus className='size-4' />
            {t('deposit')}
          </Button>
          <Button
            variant='outline'
            className='rounded-full'
            disabled={balance <= 0}
            onClick={() => setWithdrawOpen(true)}
          >
            <IconArrowUpRight className='size-4' />
            {t('withdraw')}
          </Button>
        </div>
      </div>

      <div className='from-gold/20 via-gold/10 border-gold/25 relative overflow-hidden rounded-2xl border bg-linear-to-br to-transparent p-6 sm:p-8'>
        <div className='bg-gold/15 pointer-events-none absolute -top-16 -right-16 size-48 rounded-full blur-3xl' />
        <div className='relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <div className='text-gold-strong mb-2 flex items-center gap-2 text-sm font-medium'>
              <IconWallet className='size-4' />
              {t('availableBalance')}
            </div>
            <p className='font-display text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl'>
              {formatWalletAmount(balance)}
            </p>
            <p className='text-muted-foreground mt-2 text-sm'>
              {t('walletCheckout', { currency })}
            </p>
          </div>
          <div className='grid grid-cols-3 gap-3 sm:gap-4'>
            {[
              { label: t('moneyIn'), value: formatWalletAmount(totalIn), icon: IconArrowDownLeft },
              { label: t('moneyOut'), value: formatWalletAmount(totalOut), icon: IconArrowUpRight },
              {
                label: t('pending'),
                value: String(pendingCount),
                icon: IconClock
              }
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className='bg-background/60 border-border/60 rounded-xl border px-3 py-3 text-center backdrop-blur-sm sm:px-4'
                >
                  <Icon className='text-gold mx-auto mb-1 size-4' />
                  <p className='font-mono text-sm font-semibold tabular-nums sm:text-base'>
                    {stat.value}
                  </p>
                  <p className='text-muted-foreground text-[10px] sm:text-xs'>{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <WalletBalanceChart balanceSeries={balanceSeries} activitySeries={activitySeries} />

      <div className='space-y-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <h3 className='font-display text-lg font-semibold'>{t('recentTransactions')}</h3>
            <p className='text-muted-foreground text-sm'>
              {t('totalEntries', { count: totalTransactions })}
            </p>
          </div>
          {totalPages > 1 ? (
            <div className='flex items-center gap-1'>
              <Button variant='outline' size='icon-sm' onClick={handlePrev} disabled={page === 0}>
                <IconChevronLeft className='cn-rtl-flip size-4' />
              </Button>
              <span className='text-muted-foreground min-w-24 text-center text-sm tabular-nums'>
                {tCommon('pageOf', { current: page + 1, total: totalPages })}
              </span>
              <Button
                variant='outline'
                size='icon-sm'
                onClick={handleNext}
                disabled={page + 1 >= totalPages}
              >
                <IconChevronRight className='cn-rtl-flip size-4' />
              </Button>
            </div>
          ) : null}
        </div>

        {transactions.length === 0 ? (
          <div className='bg-card border-border rounded-2xl border p-10 text-center'>
            <div className='bg-muted/60 mx-auto mb-4 flex size-14 items-center justify-center rounded-full'>
              <IconWallet className='text-muted-foreground size-7' />
            </div>
            <h4 className='font-medium'>{t('emptyTitle')}</h4>
            <p className='text-muted-foreground mx-auto mt-2 max-w-sm text-sm'>{t('emptyDescription')}</p>
            <Button className='mt-5 rounded-full' onClick={() => setDepositOpen(true)}>
              <IconPlus className='size-4' />
              {t('firstDeposit')}
            </Button>
          </div>
        ) : (
          <div className='space-y-3'>
            {transactions.map((transaction) =>
              transaction.id ? (
                <WalletTransactionRow key={transaction.id} transaction={transaction} />
              ) : null
            )}
          </div>
        )}
      </div>

      <WalletDepositDialog open={depositOpen} onOpenChange={setDepositOpen} />
      <WalletWithdrawDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        availableBalance={balance}
      />
    </div>
  );
}
