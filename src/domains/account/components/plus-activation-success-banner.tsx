'use client';

import { IconCheck, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Grid } from '@/components/ui/grid';
import { Text, Typography } from '@/components/ui/typography';
import type { PlusPaymentReceipt } from '@/domains/plus/lib/confirm-plus-stripe';
import { usePlusActivationStore } from '@/domains/plus/stores/plus-activation-store';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);
}

function formatPaidAt(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function ReceiptRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text variant='muted' className='text-xs font-medium tracking-wide uppercase'>
        {label}
      </Text>
      <Text className='mt-1 text-sm font-medium'>{value}</Text>
    </Box>
  );
}

export function PlusActivationSuccessBanner({ receipt }: { receipt: PlusPaymentReceipt }) {
  const t = useTranslations('plus.account.activation');
  const clearReceipt = usePlusActivationStore((state) => state.clearReceipt);
  const amount = receipt.amount ?? 0;
  const currency = receipt.currency ?? 'USD';

  return (
    <Box className='via-card to-card mb-6 rounded-2xl border border-emerald-500/30 bg-linear-to-br from-emerald-500/10 p-5 shadow-sm sm:p-6'>
      <Flex align='start' justify='between' gap={4}>
        <Flex align='start' gap={3}>
          <Flex
            align='center'
            justify='center'
            className='size-10 shrink-0 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
          >
            <IconCheck className='size-5' aria-hidden />
          </Flex>
          <Box>
            <Typography.H5 className='text-lg font-semibold'>{t('title')}</Typography.H5>
            <Text variant='muted' className='mt-1 text-sm leading-relaxed'>
              {t('description')}
            </Text>
          </Box>
        </Flex>
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='shrink-0 rounded-full'
          onClick={clearReceipt}
          aria-label={t('dismiss')}
        >
          <IconX className='size-4' />
        </Button>
      </Flex>

      <Grid
        cols={1}
        className='mt-5 gap-4 border-t border-emerald-500/20 pt-5 sm:grid-cols-2 lg:grid-cols-4'
      >
        <ReceiptRow label={t('plan')} value={receipt.plan_name ?? 'Luxe Plus'} />
        <ReceiptRow label={t('amount')} value={formatMoney(amount, currency)} />
        <ReceiptRow label={t('paidAt')} value={formatPaidAt(receipt.paid_at)} />
        <ReceiptRow label={t('method')} value={t('methodStripe')} />
      </Grid>

      {receipt.stripe_session_id ? (
        <Text variant='muted' className='mt-4 text-xs'>
          {t('reference', { id: receipt.stripe_session_id })}
        </Text>
      ) : null}
    </Box>
  );
}
