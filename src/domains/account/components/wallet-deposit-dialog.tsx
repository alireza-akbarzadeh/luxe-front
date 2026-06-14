'use client';

import { useQueryClient } from '@tanstack/react-query';
import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '~/src/components/app-dialog';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { Button } from '~/src/components/ui/button';
import { usePostWalletDeposit } from '~/src/services/-wallet-deposit-post';
import { getGetWalletQueryKey } from '~/src/services/-wallet-get';

import { walletDepositSchema, type WalletDepositValues } from '../account.schema';
import { formatWalletAmount, parseWalletNumber } from '../lib/wallet-utils';

interface WalletDepositDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

const defaultValues: WalletDepositValues = { amount: '' };

export function WalletDepositDialog({ open, onOpenChange }: WalletDepositDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostWalletDeposit();

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: walletDepositSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({ data: { amount: Number(value.amount) } });
        await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        toast.success('Deposit added to your wallet');
        form.reset();
        onOpenChange(false);
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Deposit failed';
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
      title='Add funds'
      description='Top up your Luxe wallet for faster checkout.'
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
                  step='0.01'
                  placeholder='1,000.00'
                  inputMode='decimal'
                />
                {parseWalletNumber(field.state.value) != null &&
                parseWalletNumber(field.state.value)! > 0 ? (
                  <p className='text-muted-foreground mt-2 text-sm'>
                    You will deposit{' '}
                    <span className='text-foreground font-mono font-medium tabular-nums'>
                      {formatWalletAmount(parseWalletNumber(field.state.value)!)}
                    </span>
                  </p>
                ) : null}
              </>
            )}
          </form.AppField>

          <div className='bg-muted/50 text-muted-foreground rounded-xl p-3 text-xs leading-relaxed'>
            Funds are added instantly in this demo environment. In production, this step would
            connect to your payment provider.
          </div>

          <div className='flex gap-2'>
            <Button type='button' variant='outline' className='flex-1' onClick={handleClose}>
              Cancel
            </Button>
            <form.Submit className='flex-1' isPending={isPending} label='Deposit' />
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
