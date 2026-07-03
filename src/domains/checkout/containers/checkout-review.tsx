// app/checkout/components/checkout-review.tsx
'use client';

import {
  IconCreditCard,
  IconMail,
  IconMapPin,
  IconPackage,
  IconPencil,
  IconShieldLock,
  IconTruck
} from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { checkoutDefaultValues, type CheckoutStepId } from '@/domains/checkout/checkout.schema';
import { CheckoutInlinePayment } from '@/domains/checkout/components/checkout-inline-payment';
import { CheckoutTermsConsent } from '@/domains/checkout/components/checkout-terms-consent';
import { useStripeCheckoutEnabled } from '@/domains/checkout/hooks/useStripeCheckoutEnabled';
import {
  detectCardBrand,
  getCardBrandLabel,
  getPaymentMethodLabel,
  maskCardNumber,
  paymentMethodRequiresCard
} from '@/domains/checkout/lib/checkout-utils';
import { useCheckoutStore } from '@/domains/checkout/store/checkout.store';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

import { useCheckoutTotals } from '../hooks/useCartTotal';

function ReviewSection({
  title,
  icon,
  onEdit,
  children
}: {
  title: string;
  icon: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
}) {
  return (
    <section className='bg-card border-border/60 rounded-xl border p-4 sm:p-5'>
      <Flex direction='row' align='center' justify='between' className='mb-3'>
        <Typography.Text variant='small' className='flex items-center gap-2 font-semibold'>
          <span className='text-muted-foreground'>{icon}</span>
          {title}
        </Typography.Text>
        {onEdit ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='text-accent h-auto gap-1 px-2 py-1'
            onClick={onEdit}
          >
            <IconPencil className='h-3.5 w-3.5' />
            Edit
          </Button>
        ) : null}
      </Flex>
      {children}
    </section>
  );
}

export const CheckoutReview = withForm({
  defaultValues: checkoutDefaultValues,

  render: function ReviewRender({ form }) {
    const t = useTranslations('checkout.review');
    const { isStripeCheckout } = useStripeCheckoutEnabled();
    const { items } = useCartController();
    const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
    const submitError = useCheckoutStore((s) => s.submitError);

    const formValues = form.state.values;
    const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);

    const { shippingPrice, providerRate, hasFreeShipping, selectedProvider } =
      useCheckoutTotals(shippingProviderId);

    const goTo = (step: CheckoutStepId) => setCurrentStep(step);
    const requiresCard = paymentMethodRequiresCard(formValues.paymentMethod);
    const cardBrand = detectCardBrand(formValues.cardNumber ?? '');
    const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

    return (
      <motion.div
        key='review'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className='space-y-5'
      >
        <Flex direction='column' spacing={1}>
          <Typography.H3 className='text-2xl font-bold'>{t('title')}</Typography.H3>
          <Typography.Text variant='muted'>{t('subtitle')}</Typography.Text>
        </Flex>

        {submitError ? (
          <div
            role='alert'
            className='border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm'
          >
            {submitError}
          </div>
        ) : null}

        <ReviewSection
          title={t('contact')}
          icon={<IconMail className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          <Typography.Text variant='muted'>
            {formValues.email || '—'}
            {formValues.phone ? (
              <>
                <br />
                {formValues.phone}
              </>
            ) : null}
          </Typography.Text>
        </ReviewSection>

        <ReviewSection
          title={t('shippingAddress')}
          icon={<IconMapPin className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          <Typography.Text variant='muted' className='leading-relaxed'>
            <span className='text-foreground font-medium'>
              {formValues.firstName} {formValues.lastName}
            </span>
            <br />
            {formValues.addressLine1}
            {formValues.addressLine2 ? `, ${formValues.addressLine2}` : ''}
            <br />
            {formValues.city}, {formValues.state} {formValues.zip}
            <br />
            {formValues.country}
          </Typography.Text>
        </ReviewSection>

        <ReviewSection
          title={t('shippingMethod')}
          icon={<IconTruck className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          {selectedProvider ? (
            <Flex direction='row' align='center' justify='between'>
              <Flex direction='column' spacing={0.5}>
                <Typography.Text variant='small' className='font-medium'>
                  {selectedProvider.name || 'Standard'} Shipping
                </Typography.Text>
                {selectedProvider.description ? (
                  <Typography.Text variant='subtle'>{selectedProvider.description}</Typography.Text>
                ) : null}
              </Flex>
              <Typography.Text variant='small' className={cn(cartMoneyClassName, 'font-medium')}>
                {shippingPrice === 0 ? (
                  hasFreeShipping && providerRate > 0 ? (
                    <Flex direction='row' align='center' spacing={2}>
                      <span className='text-muted-foreground line-through'>
                        {formatCartMoney(providerRate)}
                      </span>
                      <Typography.Text variant='small' tone='success'>
                        Free
                      </Typography.Text>
                    </Flex>
                  ) : (
                    <Typography.Text variant='small' tone='success'>
                      Free
                    </Typography.Text>
                  )
                ) : (
                  formatCartMoney(shippingPrice)
                )}
              </Typography.Text>
            </Flex>
          ) : (
            <Typography.Text variant='subtle' tone='destructive'>
              {t('noShippingMethod')}
            </Typography.Text>
          )}
        </ReviewSection>

        {isStripeCheckout ? (
          <ReviewSection title={t('paymentMethod')} icon={<IconCreditCard className='h-4 w-4' />}>
            <Flex direction='column' spacing={1}>
              <Typography.Text variant='small' className='font-medium'>
                {t('stripeCheckout')}
              </Typography.Text>
              <Typography.Text variant='muted'>{t('stripeCheckoutHint')}</Typography.Text>
            </Flex>
          </ReviewSection>
        ) : (
          <CheckoutInlinePayment form={form} />
        )}

        <ReviewSection
          title={t('items', { count: itemCount })}
          icon={<IconPackage className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          <ul className='space-y-3'>
            {items.map((item) => (
              <li key={`${item.id}-${item.color}-${item.size}`}>
                <Flex direction='row' align='center' spacing={3}>
                  <div className='bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg'>
                    {item.image ? (
                      <Image src={item.image} alt={item.name || ''} fill className='object-cover' />
                    ) : null}
                    <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                      {item.quantity}
                    </span>
                  </div>
                  <Flex direction='column' className='min-w-0 flex-1'>
                    <Typography.Text variant='small' className='truncate font-medium'>
                      {item.name}
                    </Typography.Text>
                    {(item.color || item.size) && (
                      <Typography.Text variant='subtle'>
                        {[item.color, item.size].filter(Boolean).join(' / ')}
                      </Typography.Text>
                    )}
                  </Flex>
                  <Typography.Text
                    variant='small'
                    className={cn(cartMoneyClassName, 'font-medium')}
                  >
                    {formatCartMoney((item.price ?? 0) * (item.quantity ?? 0))}
                  </Typography.Text>
                </Flex>
              </li>
            ))}
          </ul>
        </ReviewSection>

        {!isStripeCheckout && requiresCard ? (
          <Typography.Text variant='subtle' className='text-center'>
            {getPaymentMethodLabel(formValues.paymentMethod)} ·{' '}
            {maskCardNumber(formValues.cardNumber ?? '')}
            {cardBrand !== 'unknown' ? ` · ${getCardBrandLabel(cardBrand)}` : ''}
          </Typography.Text>
        ) : null}

        <CheckoutTermsConsent className='hidden lg:flex' />

        <Typography.Text
          variant='subtle'
          className='flex items-center justify-center gap-1.5 text-center'
        >
          <IconShieldLock className='h-3.5 w-3.5' />
          {isStripeCheckout ? t('secureStripe') : t('secureDefault')}
        </Typography.Text>
      </motion.div>
    );
  }
});
