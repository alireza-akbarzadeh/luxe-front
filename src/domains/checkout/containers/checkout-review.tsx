'use client';

import {
  IconCreditCard,
  IconMail,
  IconMapPin,
  IconPackage,
  IconShieldLock,
  IconTruck
} from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import {
  cartMoneyClassName,
  formatCartMoney,
  getCartItemImage,
  getCartItemName
} from '@/domains/cart/lib/cart-utils';
import { CheckoutPaymentBrandIcon } from '@/domains/checkout/components/checkout-payment-brand-icon';
import { CheckoutReviewSection } from '@/domains/checkout/components/checkout-review-section';
import { CheckoutTermsConsent } from '@/domains/checkout/components/checkout-terms-consent';
import { useCheckoutPaymentMethods } from '@/domains/checkout/hooks/use-checkout-payment-methods';
import { useCheckoutTotals } from '@/domains/checkout/hooks/useCartTotal';
import { useStripeCheckoutEnabled } from '@/domains/checkout/hooks/useStripeCheckoutEnabled';
import { getCheckoutPaymentMethodLabel } from '@/domains/checkout/lib/checkout-payment-methods';
import {
  detectCardBrand,
  getCardBrandLabel,
  maskCardNumber,
  paymentMethodRequiresCard
} from '@/domains/checkout/lib/checkout-utils';
import { checkoutDefaultValues } from '@/domains/checkout/schemas/checkout.schema';
import { useCheckoutStore } from '@/domains/checkout/store/checkout.store';
import type { CheckoutStepId } from '@/domains/checkout/types/checkout.types';
import { useCartController } from '@/hooks/useCartController';
import { cn } from '@/lib/utils';

export function CheckoutReview() {
  const t = useTranslations('checkout.review');
  const tPayment = useTranslations('checkout.payment');
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const { isStripeCheckout } = useStripeCheckoutEnabled();
  const { methods } = useCheckoutPaymentMethods();
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
  const selectedPayment = methods.find((method) => method.id === formValues.paymentMethod);
  const paymentLabel = getCheckoutPaymentMethodLabel(formValues.paymentMethod, methods);

  return (
    <motion.div
      key='review'
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className='min-w-0 space-y-5 overflow-x-hidden'
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

      <CheckoutReviewSection
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
      </CheckoutReviewSection>

      <CheckoutReviewSection
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
      </CheckoutReviewSection>

      <CheckoutReviewSection
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
      </CheckoutReviewSection>

      <CheckoutReviewSection
        title={t('paymentMethod')}
        icon={<IconCreditCard className='h-4 w-4' />}
        onEdit={() => goTo('shipping')}
      >
        <Flex direction='row' align='center' spacing={3}>
          {selectedPayment ? (
            <span className='border-border/70 bg-background flex size-11 shrink-0 items-center justify-center rounded-full border'>
              <CheckoutPaymentBrandIcon method={selectedPayment} />
            </span>
          ) : null}
          <Flex direction='column' spacing={0.5} className='min-w-0'>
            <Typography.Text variant='small' className='font-medium'>
              {paymentLabel}
            </Typography.Text>
            <Typography.Text variant='muted'>
              {formValues.paymentMethod === 'stripe' || isStripeCheckout
                ? t('stripeCheckoutHint')
                : requiresCard
                  ? tPayment('secureNotice')
                  : (selectedPayment?.description ?? tPayment('secureNotice'))}
            </Typography.Text>
          </Flex>
        </Flex>
      </CheckoutReviewSection>

      <CheckoutReviewSection
        title={t('items', { count: itemCount })}
        icon={<IconPackage className='h-4 w-4' />}
        onEdit={() => goTo('shipping')}
      >
        <ul className='space-y-3'>
          {items.map((item) => (
            <li key={`${item.id}-${item.color}-${item.size}`}>
              <Flex direction='row' align='center' spacing={3}>
                <div className='bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg'>
                  <AppImage
                    src={getCartItemImage(item)}
                    alt={getCartItemName(item)}
                    fill
                    sizes='48px'
                    className='object-cover'
                  />
                  <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                    {item.quantity}
                  </span>
                </div>
                <Flex direction='column' className='min-w-0 flex-1'>
                  <Typography.Text variant='small' className='truncate font-medium'>
                    {getCartItemName(item)}
                  </Typography.Text>
                  {(item.color || item.size) && (
                    <Typography.Text variant='subtle'>
                      {[item.color, item.size].filter(Boolean).join(' / ')}
                    </Typography.Text>
                  )}
                </Flex>
                <Typography.Text variant='small' className={cn(cartMoneyClassName, 'font-medium')}>
                  {formatCartMoney((item.price ?? 0) * (item.quantity ?? 0))}
                </Typography.Text>
              </Flex>
            </li>
          ))}
        </ul>
      </CheckoutReviewSection>

      {!isStripeCheckout && requiresCard ? (
        <Typography.Text variant='subtle' className='text-center'>
          {paymentLabel} · {maskCardNumber(formValues.cardNumber ?? '')}
          {cardBrand !== 'unknown' ? ` · ${getCardBrandLabel(cardBrand)}` : ''}
        </Typography.Text>
      ) : null}

      <CheckoutTermsConsent className='mt-1' />

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
