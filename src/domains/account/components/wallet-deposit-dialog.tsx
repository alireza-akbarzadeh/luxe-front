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
  const t = useTranslations('account.wallet');
  const tCommon = useTranslations('account.common');

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: walletDepositSchema
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({ data: { amount: Number(value.amount) } });
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
                <field.TextField
                  label={t('depositAmount')}
                  type='number'
                  min={0}
                  step='0.01'
                  placeholder='1,000.00'
                  inputMode='decimal'
                />
                {parseWalletNumber(field.state.value) != null &&
                parseWalletNumber(field.state.value)! > 0 ? (
                  <p className='text-muted-foreground mt-2 text-sm'>
                    {t('depositPreview', {
                      amount: formatWalletAmount(parseWalletNumber(field.state.value)!)
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
