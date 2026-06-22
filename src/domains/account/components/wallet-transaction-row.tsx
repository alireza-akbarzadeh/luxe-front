'use client';

import { IconArrowDownLeft, IconArrowUpRight } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { usePostWalletDepositIdCancel } from '~/src/services/-wallet-deposit-{id}-cancel-post';
import { getGetWalletQueryKey } from '~/src/services/-wallet-get';
import type { DtoTransactionResponse } from '~/src/services/-wallet-get.schemas';

import {
  formatTransactionDate,
  formatWalletAmount,
  getTransactionAmountDisplay,
  parseWalletNumber
} from '../lib/wallet-utils';
import { WalletStatusBadge } from './wallet-status-badge';

interface WalletTransactionRowProps {
  transaction: DtoTransactionResponse;
}

function getTransactionTypeKey(type?: string): string {
  if (!type) return 'transaction';
  const normalized = type.toLowerCase();
  if (['deposit', 'payment', 'refund', 'adjustment'].includes(normalized)) {
    return normalized;
  }
  return 'transaction';
}

export function WalletTransactionRow({ transaction }: WalletTransactionRowProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: cancelDeposit, isPending: isCancelling } = usePostWalletDepositIdCancel();
  const t = useTranslations('account.wallet');
  const tCommon = useTranslations('account.common');

  const amountDisplay = getTransactionAmountDisplay(transaction);
  const canCancel =
    transaction.status === 'pending' &&
    transaction.type === 'deposit' &&
    typeof transaction.id === 'number';

  const typeKey = getTransactionTypeKey(transaction.type);
  const typeLabel = t(`transactionType.${typeKey}` as 'transactionType.deposit');

  const handleCancel = async () => {
    if (!transaction.id) return;
    try {
      await cancelDeposit({ id: transaction.id });
      await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
      toast.success(t('depositCancelled'));
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        t('cancelDepositFailed');
      toast.error(message);
    }
  };

  return (
    <div className='bg-muted/30 border-border/60 flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between'>
      <div className='flex min-w-0 items-start gap-3'>
        <div
          className={
            amountDisplay.prefix === '+'
              ? 'bg-gold/15 text-gold-strong flex size-10 shrink-0 items-center justify-center rounded-full'
              : 'bg-destructive/10 text-destructive flex size-10 shrink-0 items-center justify-center rounded-full'
          }
        >
          {amountDisplay.prefix === '+' ? (
            <IconArrowDownLeft className='size-4' />
          ) : (
            <IconArrowUpRight className='size-4' />
          )}
        </div>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='font-medium'>{typeLabel}</p>
            <WalletStatusBadge status={transaction.status} />
          </div>
          <p className='text-muted-foreground mt-0.5 truncate text-sm'>
            {transaction.description || t('transactionFallback')}
          </p>
          <p className='text-muted-foreground mt-1 text-xs'>
            {formatTransactionDate(transaction.created_at)}
            {transaction.id ? (
              <>
                {' '}
                · <span className='font-mono'>#{transaction.id}</span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      <div className='flex items-center justify-between gap-3 sm:flex-col sm:items-end'>
        <p className={`font-mono text-lg font-semibold tabular-nums ${amountDisplay.className}`}>
          {amountDisplay.prefix}
          {formatWalletAmount(amountDisplay.value)}
        </p>
        {parseWalletNumber(transaction.balance_after) != null &&
        transaction.status === 'completed' ? (
          <p className='text-muted-foreground text-xs tabular-nums'>
            {t('balanceAfter', {
              amount: formatWalletAmount(parseWalletNumber(transaction.balance_after)!)
            })}
          </p>
        ) : null}
        {canCancel ? (
          <Button
            variant='outline'
            size='sm'
            className='rounded-full'
            disabled={isCancelling}
            onClick={() => void handleCancel()}
          >
            {tCommon('cancel')}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
