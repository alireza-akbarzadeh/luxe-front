'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Box } from '@/components/ui/box';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Text, Typography } from '@/components/ui/typography';
import { PlusMembershipBadge } from '@/domains/plus/components/plus-membership-badge';
import {
  usePlusMembershipQuery,
  useSubscribeToPlusMutation
} from '@/domains/plus/hooks/use-plus-membership';
import { cn } from '@/lib/utils';
import type { DtoPlusBenefitsResponse } from '@/services/-plus-benefits-get.schemas';
import {
  DtoSubscribePlusRequestPaymentMethod,
  type DtoSubscribePlusRequestPaymentMethod as PaymentMethod
} from '@/services/-plus-subscribe-post.schemas';
import { useGetWallet } from '@/services/-wallet-get';

type PlusPricingCardProps = {
  benefits: DtoPlusBenefitsResponse;
  className?: string;
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const message = (error as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;
  return message && message.trim().length > 0 ? message : fallback;
}

/** Primary CTA card for subscribing to Luxe Plus. */
export function PlusPricingCard({ benefits, className }: PlusPricingCardProps) {
  const t = useTranslations('plus.pricing');
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { data: membershipData, isLoading: membershipLoading } = usePlusMembershipQuery();
  const { data: walletData } = useGetWallet(undefined, {
    query: { enabled: isAuthenticated, staleTime: 30_000 }
  });
  const subscribe = useSubscribeToPlusMutation();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    DtoSubscribePlusRequestPaymentMethod.wallet
  );
  const [giftCardCode, setGiftCardCode] = useState('');

  const isPlus = membershipData?.data?.is_plus_active === true;
  const expiresAt = membershipData?.data?.plus_expires_at;
  const annualPrice = benefits.annual_price ?? 0;
  const walletBalance = walletData?.data?.balance ?? 0;
  const walletInsufficient = walletBalance < annualPrice;

  const onSubscribe = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/plus/landing');
      return;
    }

    if (
      paymentMethod === DtoSubscribePlusRequestPaymentMethod.gift_card &&
      giftCardCode.trim().length === 0
    ) {
      toast.error(t('giftCardRequired'));
      return;
    }

    try {
      const result = await subscribe.mutateAsync({
        data: {
          payment_method: paymentMethod,
          ...(paymentMethod === DtoSubscribePlusRequestPaymentMethod.gift_card
            ? { gift_card_code: giftCardCode.trim() }
            : {})
        }
      });

      const payload = result.data;
      if (payload?.payment_status === 'pending' && payload.checkout_url) {
        window.location.assign(payload.checkout_url);
        return;
      }

      toast.success(result.message ?? t('success'));
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, t('error')));
    }
  };

  return (
    <Box
      className={cn(
        'border-gold/40 from-gold/15 via-card to-card relative overflow-hidden rounded-3xl border bg-linear-to-br p-6 shadow-xl sm:p-8',
        className
      )}
    >
      <Box
        aria-hidden
        className='bg-gold/20 pointer-events-none absolute -top-24 -right-16 size-56 rounded-full blur-3xl'
      />

      <Flex direction='column' gap={6} className='relative'>
        <Flex align='center' justify='between' wrap='wrap' gap={3}>
          <Box>
            <Typography.H3 family='display' className='text-2xl sm:text-3xl'>
              {benefits.plan_name}
            </Typography.H3>
            <Text variant='muted' className='mt-1 text-sm'>
              {t('subtitle')}
            </Text>
          </Box>
          <PlusMembershipBadge size='md' />
        </Flex>

        <Flex align='end' gap={2}>
          <Typography.H2 className='text-4xl font-bold tabular-nums sm:text-5xl'>
            {formatPrice(annualPrice, benefits.currency ?? 'USD')}
          </Typography.H2>
          <Text variant='muted' className='pb-1.5 text-sm'>
            {t('perYear')}
          </Text>
        </Flex>

        <ul className='text-muted-foreground space-y-2 text-sm'>
          <li>• {t('perkDiscount', { percent: benefits.discount_percent ?? 0 })}</li>
          <li>• {t('perkReturns', { days: benefits.return_window_days?.plus ?? 0 })}</li>
          <li>• {t('perkShipping')}</li>
          <li>• {t('perkSupport')}</li>
        </ul>

        {isPlus ? (
          <Box className='rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
            <Text className='text-sm text-emerald-800 dark:text-emerald-300'>
              {expiresAt
                ? t('activeUntil', { date: new Date(expiresAt).toLocaleDateString() })
                : t('active')}
            </Text>
            <Button asChild variant='outline' className='mt-3 w-full rounded-xl'>
              <Link href='/account'>{t('manageAccount')}</Link>
            </Button>
          </Box>
        ) : (
          <>
            {isAuthenticated ? (
              <Box className='space-y-4'>
                <Box>
                  <Label className='mb-2 block text-sm font-medium'>{t('paymentMethod')}</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                    className='space-y-2'
                  >
                    <Flex
                      align='center'
                      gap={3}
                      className='border-border hover:bg-muted/40 rounded-xl border p-3'
                    >
                      <RadioGroupItem
                        value={DtoSubscribePlusRequestPaymentMethod.wallet}
                        id='plus-pay-wallet'
                      />
                      <Label
                        htmlFor='plus-pay-wallet'
                        className='flex-1 cursor-pointer font-normal'
                      >
                        <Text className='text-sm font-medium'>{t('payWallet')}</Text>
                        <Text variant='muted' className='text-xs'>
                          {t('walletBalance', {
                            amount: formatPrice(walletBalance, benefits.currency ?? 'USD')
                          })}
                        </Text>
                      </Label>
                    </Flex>

                    <Flex
                      align='center'
                      gap={3}
                      className='border-border hover:bg-muted/40 rounded-xl border p-3'
                    >
                      <RadioGroupItem
                        value={DtoSubscribePlusRequestPaymentMethod.gift_card}
                        id='plus-pay-gift'
                      />
                      <Label htmlFor='plus-pay-gift' className='flex-1 cursor-pointer font-normal'>
                        <Text className='text-sm font-medium'>{t('payGiftCard')}</Text>
                        <Text variant='muted' className='text-xs'>
                          {t('payGiftCardHint')}
                        </Text>
                      </Label>
                    </Flex>

                    <Flex
                      align='center'
                      gap={3}
                      className='border-border hover:bg-muted/40 rounded-xl border p-3'
                    >
                      <RadioGroupItem
                        value={DtoSubscribePlusRequestPaymentMethod.stripe}
                        id='plus-pay-stripe'
                      />
                      <Label
                        htmlFor='plus-pay-stripe'
                        className='flex-1 cursor-pointer font-normal'
                      >
                        <Text className='text-sm font-medium'>{t('payStripe')}</Text>
                        <Text variant='muted' className='text-xs'>
                          {t('payStripeHint')}
                        </Text>
                      </Label>
                    </Flex>
                  </RadioGroup>
                </Box>

                {paymentMethod === DtoSubscribePlusRequestPaymentMethod.gift_card ? (
                  <Box>
                    <Label htmlFor='plus-gift-code' className='mb-2 block text-sm font-medium'>
                      {t('giftCardCode')}
                    </Label>
                    <Input
                      id='plus-gift-code'
                      value={giftCardCode}
                      onChange={(event) => setGiftCardCode(event.target.value.toUpperCase())}
                      placeholder='LUXE-XXXX-XXXX'
                      autoComplete='off'
                      className='rounded-xl'
                    />
                  </Box>
                ) : null}

                {paymentMethod === DtoSubscribePlusRequestPaymentMethod.wallet &&
                walletInsufficient ? (
                  <Box className='rounded-xl border border-amber-500/30 bg-amber-500/10 p-3'>
                    <Text className='text-sm text-amber-900 dark:text-amber-200'>
                      {t('walletInsufficient')}
                    </Text>
                    <Button asChild variant='link' className='mt-1 h-auto p-0 text-sm'>
                      <Link href='/account'>{t('topUpWallet')}</Link>
                    </Button>
                  </Box>
                ) : null}
              </Box>
            ) : null}

            <Button
              size='lg'
              className='from-gold via-gold-strong to-gold w-full rounded-xl bg-linear-to-r text-amber-950 hover:opacity-95'
              onClick={onSubscribe}
              disabled={subscribe.isPending || membershipLoading}
            >
              {subscribe.isPending
                ? t('processing')
                : isAuthenticated
                  ? t('subscribe')
                  : t('signInToSubscribe')}
            </Button>
          </>
        )}

        <Text variant='muted' className='text-center text-xs'>
          {t('paymentNote')}
        </Text>
      </Flex>
    </Box>
  );
}
