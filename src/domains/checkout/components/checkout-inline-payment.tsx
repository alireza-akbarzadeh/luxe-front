'use client';

import { IconCreditCard, IconLock } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/typography';
import {
  detectCardBrand,
  formatCardNumber,
  getCardBrandLabel,
  paymentMethodRequiresCard
} from '@/domains/checkout/lib/checkout-utils';
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';

import { PaymentMethodSelector } from './payment-providers';

const onlyDigits = (max: number) => (value: string) => value.replace(/\D/g, '').slice(0, max);

/** Demo / non-Stripe card entry — shown on the review step only. */
export function CheckoutInlinePayment() {
  const t = useTranslations('checkout.payment');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const paymentMethod = useStore(form.store, (s) => s.values.paymentMethod);
  const cardNumberValue = useStore(form.store, (s) => s.values.cardNumber);
  const requiresCard = paymentMethodRequiresCard(paymentMethod);
  const cardBrand = detectCardBrand(cardNumberValue ?? '');

  return (
    <Flex
      direction='column'
      spacing={4}
      className='bg-card border-border/60 rounded-xl border p-4 sm:p-5'
    >
      <Flex direction='row' align='center' spacing={2}>
        <IconCreditCard className='text-muted-foreground h-4 w-4' />
        <Typography.Text variant='small'>{t('title')}</Typography.Text>
      </Flex>

      <Flex
        direction='row'
        align='start'
        spacing={3}
        className='bg-muted/40 border-border/60 rounded-xl border px-3 py-3'
      >
        <IconLock className='text-muted-foreground mt-0.5 h-4 w-4 shrink-0' />
        <Typography.Text variant='muted'>{t('secureNotice')}</Typography.Text>
      </Flex>

      <Typography.Text
        variant='muted'
        className='rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5'
      >
        {t('demoNotice')}
      </Typography.Text>

      <div>
        <Label className='mb-2 block'>{t('methodLabel')}</Label>
        <form.AppField name='paymentMethod'>
          {(field) => (
            <PaymentMethodSelector
              value={field.state.value}
              onChange={(val) => field.handleChange(val)}
            />
          )}
        </form.AppField>
      </div>

      {requiresCard ? (
        <Flex direction='column' spacing={4}>
          <form.AppField name='cardNumber'>
            {(field) => (
              <div className='relative'>
                <field.TextField
                  startIcon={IconCreditCard}
                  label={t('cardNumber')}
                  placeholder='1234 5678 9012 3456'
                  inputMode='numeric'
                  autoComplete='cc-number'
                  transform={formatCardNumber}
                />
                {cardBrand !== 'unknown' ? (
                  <span className='text-muted-foreground absolute top-9 right-4 text-xs font-medium'>
                    {getCardBrandLabel(cardBrand)}
                  </span>
                ) : null}
              </div>
            )}
          </form.AppField>

          <div className='grid grid-cols-2 gap-4'>
            <form.AppField name='expiryMonth'>
              {(field) => (
                <field.TextField
                  label={t('expiryMonth')}
                  placeholder='MM'
                  inputMode='numeric'
                  autoComplete='cc-exp-month'
                  maxLength={2}
                  transform={onlyDigits(2)}
                />
              )}
            </form.AppField>
            <form.AppField name='expiryYear'>
              {(field) => (
                <field.TextField
                  label={t('expiryYear')}
                  placeholder='YYYY'
                  inputMode='numeric'
                  autoComplete='cc-exp-year'
                  maxLength={4}
                  transform={onlyDigits(4)}
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name='cvv'>
            {(field) => (
              <field.TextField
                label={t('cvc')}
                placeholder='123'
                inputMode='numeric'
                autoComplete='cc-csc'
                maxLength={4}
                transform={onlyDigits(4)}
              />
            )}
          </form.AppField>
        </Flex>
      ) : null}

      <form.AppField name='saveInfo'>
        {(field) => <field.Checkbox label={t('saveInfo')} id='saveInfo' />}
      </form.AppField>
    </Flex>
  );
}
