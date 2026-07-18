'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '~/src/components/app-dialog';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { Button } from '~/src/components/ui/button';
import { getGetWalletQueryKey } from '~/src/services/-wallet-get';
import { usePostWalletWithdraw } from '~/src/services/-wallet-withdraw-post';

import { walletWithdrawSchema } from '../account.schema';
import { formatWalletAmount } from '../lib/wallet-utils';

interface WalletWithdrawDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
  availableBalance: number;
}

export function WalletWithdrawDialog({
  open,
  onOpenChange,
  availableBalance
}: WalletWithdrawDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostWalletWithdraw();
  const t = useTranslations('account.wallet');
  const tCommon = useTranslations('account.common');

  const form = useAppForm({
    defaultValues: {
      amount: null as unknown as number,
      description: ''
    },
    validators: {
      onSubmit: walletWithdrawSchema
    },
    onSubmit: async ({ value }) => {
      const amount = Math.trunc(value.amount);
      if (amount > availableBalance) {
        toast.error(t('withdrawMaxError', { amount: formatWalletAmount(availableBalance) }));
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
        toast.success(t('withdrawSuccess'));
        form.reset();
        onOpenChange(false);
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          t('withdrawFailed');
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
      title={t('withdrawDialogTitle')}
      description={t('withdrawDialogDescription', {
        balance: formatWalletAmount(availableBalance)
      })}
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
                <field.PriceField label={t('depositAmount')} placeholder='1,000' />
                {typeof field.state.value === 'number' && field.state.value > 0 ? (
                  <p className='text-muted-foreground mt-2 text-sm'>
                    {t('withdrawPreview', {
                      amount: formatWalletAmount(field.state.value)
                    })}
                  </p>
                ) : null}
              </>
            )}
          </form.AppField>

          <form.AppField name='description'>
            {(field) => (
              <field.TextField
                label={t('withdrawNoteLabel')}
                placeholder={t('withdrawNotePlaceholder')}
              />
            )}
          </form.AppField>

          <div className='flex gap-2'>
            <Button type='button' variant='outline' className='flex-1' onClick={handleClose}>
              {tCommon('cancel')}
            </Button>
            <form.Submit
              className='flex-1'
              isPending={isPending}
              disabled={availableBalance <= 0}
              label={t('withdraw')}
            />
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
