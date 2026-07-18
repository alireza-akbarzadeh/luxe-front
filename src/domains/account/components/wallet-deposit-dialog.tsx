'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { type Dispatch, type SetStateAction } from 'react';
import { toast } from 'sonner';

import { AppDialog } from '~/src/components/app-dialog';
import { useAppForm } from '~/src/components/forms/useAppForm';
import { Button } from '~/src/components/ui/button';
import { usePostWalletDeposit } from '~/src/services/-wallet-deposit-post';
import { getGetWalletQueryKey } from '~/src/services/-wallet-get';

import { walletDepositSchema } from '../account.schema';
import { formatWalletAmount } from '../lib/wallet-utils';

interface WalletDepositDialogProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function WalletDepositDialog({ open, onOpenChange }: WalletDepositDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = usePostWalletDeposit();
  const t = useTranslations('account.wallet');
  const tCommon = useTranslations('account.common');

  const form = useAppForm({
    defaultValues: {
      amount: null as unknown as number
    },
    validators: {
      onSubmit: walletDepositSchema
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await mutateAsync({ data: { amount: Math.trunc(value.amount) } });
        const deposit = response.data;

        if (deposit?.checkout_url && deposit.status === 'pending') {
          window.location.assign(deposit.checkout_url);
          return;
        }

        await queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        toast.success(t('depositSuccess'));
        form.reset();
        onOpenChange(false);
      } catch (error: unknown) {
        const message =
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          t('depositFailed');
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
      title={t('depositDialogTitle')}
      description={t('depositDialogDescription')}
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
                    {t('depositPreview', {
                      amount: formatWalletAmount(field.state.value)
                    })}
                  </p>
                ) : null}
              </>
            )}
          </form.AppField>

          <div className='bg-muted/50 text-muted-foreground rounded-xl p-3 text-xs leading-relaxed'>
            {t('depositNote')}
          </div>

          <div className='flex gap-2'>
            <Button type='button' variant='outline' className='flex-1' onClick={handleClose}>
              {tCommon('cancel')}
            </Button>
            <form.Submit className='flex-1' isPending={isPending} label={t('deposit')} />
          </div>
        </form.Root>
      </form.AppForm>
    </AppDialog>
  );
}
