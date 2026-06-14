'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '~/src/components/app-dialog';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { Button } from '~/src/components/ui/button';
import { getGetWalletQueryKey } from '~/src/services/-wallet-get';
import { usePostWalletWithdraw } from '~/src/services/-wallet-withdraw-post';

import { walletWithdrawSchema, type WalletWithdrawValues } from '../account.schema';
import { formatWalletAmount, parseWalletNumber } from '../lib/wallet-utils';

interface WalletWithdrawDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  availableBalance: number;
}

const defaultValues: WalletWithdrawValues = { amount: '', description: '' };

export function WalletWithdrawDialog({
  open,
  onOpenChange,
  availableBalance
}: WalletWithdrawDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostWalletWithdraw();

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: walletWithdrawSchema
    },
    onSubmit: async ({ value }) => {
      const amount = Number(value.amount);
      if (amount > availableBalance) {
        toast.error(`Maximum withdrawable is ${formatWalletAmount(availableBalance)}`);
        return;
      }

      try {
        await mutateAsync({
          data: {
            amount,
            description: value.description?.trim() || undefined
          }
        });
        await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        toast.success('Withdrawal completed');
        form.reset();
        onOpenChange(false);
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Withdrawal failed';
        toast.error(message);
      }
    }
  });

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <AppDialog
      title='Withdraw funds'
      description={`Available balance: ${formatWalletAmount(availableBalance)}`}
      open={open}
      onOpenChange={onOpenChange}
      size='sm'
    >
      <form.AppForm>
        <form.Root
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className='space-y-5'
        >
          <form.AppField name='amount'>
            {(field) => (
              <>
                <field.TextField
                  label='Amount (USD)'
                  type='number'
                  min={0}
                  max={availableBalance}
                  step='0.01'
                  placeholder='1,000.00'
                  inputMode='decimal'
                />
                {parseWalletNumber(field.state.value) != null &&
                parseWalletNumber(field.state.value)! > 0 ? (
                  <p className='text-muted-foreground mt-2 text-sm'>
                    You will withdraw{' '}
                    <span className='text-foreground font-mono font-medium tabular-nums'>
                      {formatWalletAmount(parseWalletNumber(field.state.value)!)}
                    </span>
                  </p>
                ) : null}
              </>
            )}
          </form.AppField>

          <form.AppField name='description'>
            {(field) => (
              <field.TextField
                label='Note (optional)'
                placeholder='Bank transfer, payout request…'
              />
            )}
          </form.AppField>

          <div className='flex gap-2'>
            <Button type='button' variant='outline' className='flex-1' onClick={handleClose}>
              Cancel
            </Button>
            <form.Submit
              className='flex-1'
              isPending={isPending}
              disabled={availableBalance <= 0}
              label='Withdraw'
            />
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
