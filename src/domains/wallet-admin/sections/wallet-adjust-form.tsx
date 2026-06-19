'use client';

import { IconLoader2 } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Separator } from '@/components/ui/separator';
import { WalletUserPicker } from '@/domains/wallet-admin/components/wallet-user-picker';
import { formatPrice } from '@/domains/discounts/lib/discount-utils';
import {
  walletAdjustDefaultValues,
  walletAdjustFormSchema
} from '@/domains/wallet-admin/wallet-adjust.schema';
import { usePostAdminWalletAdjust } from '@/services/-admin-wallet-adjust-post';

export function WalletAdjustForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedUserId = searchParams.get('userId');

  const { mutateAsync: adjustWallet, isPending } = usePostAdminWalletAdjust();

  const form = useAppForm({
    defaultValues: walletAdjustDefaultValues,
    validators: {
      onSubmit: walletAdjustFormSchema
    },
    onSubmit: async ({ value }) => {
      const userId = Number(value.user_id);
      if (!Number.isFinite(userId) || userId <= 0) {
        toast.error('Select a valid customer');
        return;
      }

      const confirmed = window.confirm(
        `Apply ${value.amount > 0 ? 'credit' : 'debit'} of ${formatPrice(Math.abs(value.amount))} to user #${userId}?`
      );
      if (!confirmed) return;

      try {
        await adjustWallet({
          data: {
            user_id: userId,
            amount: value.amount,
            description: value.description.trim()
          }
        });

        toast.success('Wallet adjusted successfully');
        form.reset(walletAdjustDefaultValues);
      } catch (error) {
        toast.error('Failed to adjust wallet', {
          description: error instanceof Error ? error.message : 'Something went wrong'
        });
      }
    }
  });

  useEffect(() => {
    if (preselectedUserId) {
      form.setFieldValue('user_id', preselectedUserId);
    }
  }, [preselectedUserId, form]);

  return (
    <Card className='border-border/40 bg-card/40 max-w-2xl backdrop-blur-2xl'>
      <CardHeader>
        <CardTitle>Adjust wallet balance</CardTitle>
        <CardDescription>
          Issue support credits or corrective debits. Positive amounts add funds; negative amounts
          deduct (blocked if balance would go below zero).
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.AppForm>
          <form.Root
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <Flex direction='column' spacing={6}>
              <form.AppField
                name='user_id'
                children={(field) => (
                  <WalletUserPicker
                    value={field.state.value}
                    onChange={field.handleChange}
                    label='Customer'
                    detail='Search by name or email'
                    error={field.state.meta.errors.join(', ') || undefined}
                  />
                )}
              />

              <form.AppField
                name='amount'
                children={(field) => (
                  <field.NumberField
                    label='Amount (USD)'
                    step={0.01}
                    required
                    detail='Use positive values for credits, negative for debits'
                  />
                )}
              />

              <form.Subscribe
                selector={(state) => state.values.amount}
                children={(amount) =>
                  amount !== 0 ? (
                    <p className='text-muted-foreground text-xs'>
                      This will {amount > 0 ? 'credit' : 'debit'}{' '}
                      <span className='text-foreground font-semibold'>
                        {formatPrice(Math.abs(amount))}
                      </span>{' '}
                      {amount > 0 ? 'to' : 'from'} the selected wallet.
                    </p>
                  ) : null
                }
              />

              <form.AppField
                name='description'
                children={(field) => (
                  <field.TextArea
                    label='Reason'
                    placeholder='e.g. Goodwill credit for delayed shipment'
                    rows={3}
                    required
                    description='Stored on the wallet transaction for audit'
                  />
                )}
              />

              <Separator />

              <Flex direction='row' justify='between' spacing={3} className='flex-wrap'>
                <Button type='button' variant='ghost' onClick={() => router.push('/dashboard/users')}>
                  Back to users
                </Button>

                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.isSubmitting, state.isDirty]}
                  children={([canSubmit, isSubmitting, isDirty]) => (
                    <Button type='submit' disabled={!canSubmit || isPending || !isDirty}>
                      {isPending || isSubmitting ? (
                        <>
                          <IconLoader2 className='size-4 animate-spin' />
                          Applying…
                        </>
                      ) : (
                        'Apply adjustment'
                      )}
                    </Button>
                  )}
                />
              </Flex>
            </Flex>
          </form.Root>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
