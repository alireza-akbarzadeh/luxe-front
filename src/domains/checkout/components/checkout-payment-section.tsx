'use client';

import { IconChevronDown, IconCreditCard, IconLock } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  detectCardBrand,
  formatCardNumber,
  getCardBrandLabel
} from '@/domains/checkout/lib/checkout-utils';
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';
import { cn } from '@/lib/utils';

import { useCheckoutPaymentMethods } from '../hooks/use-checkout-payment-methods';
import { checkoutPaymentMethodRequiresCard } from '../lib/checkout-payment-methods';
import { CheckoutPaymentMethodPicker } from './checkout-payment-method-picker';

const onlyDigits = (max: number) => (value: string) => value.replace(/\D/g, '').slice(0, max);

/** Collapsible payment tab — provider chips + optional demo card fields. */
export function CheckoutPaymentSection() {
  const t = useTranslations('checkout.payment');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const { methods, defaultMethodId, isStripeCheckout, isLoading } = useCheckoutPaymentMethods();
  const paymentMethod = useStore(form.store, (s) => s.values.paymentMethod);
  const cardNumberValue = useStore(form.store, (s) => s.values.cardNumber);
  const [open, setOpen] = useState(true);
  const requiresCard = checkoutPaymentMethodRequiresCard(paymentMethod, methods);
  const cardBrand = detectCardBrand(cardNumberValue ?? '');
  const selectedLabel =
    methods.find((method) => method.id === paymentMethod)?.displayName ?? paymentMethod;

  useEffect(() => {
    if (!defaultMethodId) return;
    const current = form.state.values.paymentMethod;
    const isKnown = methods.some((method) => method.id === current);
    if (!current || !isKnown) {
      form.setFieldValue('paymentMethod', defaultMethodId);
    }
  }, [defaultMethodId, form, methods]);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className='w-full'>
      <Flex
        direction='column'
        className='border-border/70 bg-card/40 overflow-hidden rounded-2xl border shadow-sm'
      >
        <CollapsibleTrigger asChild>
          <button
            type='button'
            className='hover:bg-muted/30 flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors'
            aria-expanded={open}
          >
            <span className='bg-gold/15 text-gold flex size-9 shrink-0 items-center justify-center rounded-full'>
              <IconCreditCard className='size-4' aria-hidden />
            </span>
            <Flex direction='column' align='start' gap={0.5} className='min-w-0 flex-1'>
              <Typography.Small weight='semibold'>{t('title')}</Typography.Small>
              <Typography.Muted className='truncate text-xs'>
                {open ? t('subtitle') : selectedLabel}
              </Typography.Muted>
            </Flex>
            <IconChevronDown
              className={cn(
                'text-muted-foreground size-4 shrink-0 transition-transform',
                open && 'rotate-180'
              )}
              aria-hidden
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <Flex direction='column' gap={4} className='border-border/50 border-t px-4 pt-4 pb-4'>
            <Flex
              direction='row'
              align='start'
              gap={2.5}
              className='bg-muted/40 border-border/60 rounded-xl border px-3 py-2.5'
            >
              <IconLock className='text-muted-foreground mt-0.5 size-4 shrink-0' aria-hidden />
              <Typography.Muted className='text-xs leading-relaxed'>
                {isStripeCheckout ? t('stripeDescription') : t('secureNotice')}
              </Typography.Muted>
            </Flex>

            <form.AppField name='paymentMethod'>
              {(field) => (
                <CheckoutPaymentMethodPicker
                  methods={methods}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                  isLoading={isLoading}
                />
              )}
            </form.AppField>

            {requiresCard ? (
              <Flex direction='column' gap={4}>
                <Typography.Muted className='rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs'>
                  {t('demoNotice')}
                </Typography.Muted>

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
                        <span className='text-muted-foreground absolute end-4 top-9 text-xs font-medium'>
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
          </Flex>
        </CollapsibleContent>
      </Flex>
    </Collapsible>
  );
}
