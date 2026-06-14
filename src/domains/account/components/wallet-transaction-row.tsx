'use client';

import { IconArrowDownLeft, IconArrowUpRight } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { usePostWalletDepositIdCancel } from '~/src/services/-wallet-deposit-{id}-cancel-post';
import { getGetWalletQueryKey } from '~/src/services/-wallet-get';
import type { DtoTransactionResponse } from '~/src/services/-wallet-get.schemas';

import {
  formatTransactionDate,
  formatTransactionType,
  formatWalletAmount,
  getTransactionAmountDisplay,
  parseWalletNumber
} from '../lib/wallet-utils';
import { WalletStatusBadge } from './wallet-status-badge';

interface WalletTransactionRowProps {
  transaction: DtoTransactionResponse;
}

export function WalletTransactionRow({ transaction }: WalletTransactionRowProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: cancelDeposit, isPending: isCancelling } = usePostWalletDepositIdCancel();

  const amountDisplay = getTransactionAmountDisplay(transaction);
  const canCancel =
    transaction.status === 'pending' &&
    transaction.type === 'deposit' &&
    typeof transaction.id === 'number';

  const handleCancel = async () => {
    if (!transaction.id) return;
    try {
      await cancelDeposit({ id: transaction.id });
      await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
      toast.success('Deposit cancelled');
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Failed to cancel deposit';
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
            <p className='font-medium'>{formatTransactionType(transaction.type)}</p>
            <WalletStatusBadge status={transaction.status} />
          </div>
          <p className='text-muted-foreground mt-0.5 truncate text-sm'>
            {transaction.description || 'Wallet transaction'}
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
            Balance {formatWalletAmount(parseWalletNumber(transaction.balance_after)!)}
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
            Cancel
          </Button>
        ) : null}
      </div>
    </div>
  );
}
