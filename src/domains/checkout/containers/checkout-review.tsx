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
import type { ReactNode } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCartCommerceSettings } from '@/domains/cart/hooks/use-cart-commerce-settings';
import { formatEstimatedTaxLabel } from '@/domains/cart/lib/cart-commerce-settings';
import { cartMoneyClassName, formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { checkoutDefaultValues, type CheckoutStepId } from '@/domains/checkout/checkout.schema';
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
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='flex items-center gap-2 text-sm font-semibold'>
          <span className='text-muted-foreground'>{icon}</span>
          {title}
        </h3>
        {onEdit && (
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
        )}
      </div>
      {children}
    </section>
  );
}

export const CheckoutReview = withForm({
  defaultValues: checkoutDefaultValues,

  render: function ReviewRender({ form }) {
    const { items } = useCartController();
    const { settings } = useCartCommerceSettings();
    const setCurrentStep = useCheckoutStore((s) => s.setCurrentStep);
    const agreedToTerms = useCheckoutStore((s) => s.agreedToTerms);
    const setAgreedToTerms = useCheckoutStore((s) => s.setAgreedToTerms);
    const submitError = useCheckoutStore((s) => s.submitError);

    const formValues = form.state.values;
    const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);

    const {
      subtotal,
      shippingPrice,
      tax,
      couponDiscount,
      appliedCouponCode,
      total,
      selectedProvider
    } = useCheckoutTotals(shippingProviderId);

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
        <div>
          <h2 className='text-2xl font-bold'>Review your order</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            Please confirm everything looks right before placing your order.
          </p>
        </div>

        {submitError && (
          <div
            role='alert'
            className='border-destructive/30 bg-destructive/10 text-destructive rounded-xl border px-4 py-3 text-sm'
          >
            {submitError}
          </div>
        )}

        {/* Contact */}
        <ReviewSection
          title='Contact'
          icon={<IconMail className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          <p className='text-muted-foreground text-sm'>
            {formValues.email || '—'}
            {formValues.phone && (
              <>
                <br />
                {formValues.phone}
              </>
            )}
          </p>
        </ReviewSection>

        {/* Shipping address */}
        <ReviewSection
          title='Shipping address'
          icon={<IconMapPin className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          <p className='text-muted-foreground text-sm leading-relaxed'>
            <span className='text-foreground font-medium'>
              {formValues.firstName} {formValues.lastName}
            </span>
            <br />
            {formValues.addressLine1}
            {formValues.addressLine2 && `, ${formValues.addressLine2}`}
            <br />
            {formValues.city}, {formValues.state} {formValues.zip}
            <br />
            {formValues.country}
          </p>
        </ReviewSection>

        {/* Shipping method */}
        <ReviewSection
          title='Shipping method'
          icon={<IconTruck className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          {selectedProvider ? (
            <div className='flex items-center justify-between text-sm'>
              <div>
                <p className='font-medium'>{selectedProvider.name || 'Standard'} Shipping</p>
                {selectedProvider.description && (
                  <p className='text-muted-foreground text-xs'>{selectedProvider.description}</p>
                )}
              </div>
              <span className={cn(cartMoneyClassName, 'font-medium')}>
                {shippingPrice === 0 ? (
                  <span className='text-green-600'>Free</span>
                ) : (
                  formatCartMoney(shippingPrice)
                )}
              </span>
            </div>
          ) : (
            <p className='text-destructive text-sm'>No shipping method selected.</p>
          )}
        </ReviewSection>

        {/* Payment */}
        <ReviewSection
          title='Payment method'
          icon={<IconCreditCard className='h-4 w-4' />}
          onEdit={() => goTo('payment')}
        >
          <div className='text-sm'>
            <p className='font-medium'>{getPaymentMethodLabel(formValues.paymentMethod)}</p>
            {requiresCard && (
              <p className='text-muted-foreground font-mono tracking-wider'>
                {maskCardNumber(formValues.cardNumber ?? '')}
                {cardBrand !== 'unknown' && (
                  <span className='ml-2 font-sans'>{getCardBrandLabel(cardBrand)}</span>
                )}
              </p>
            )}
          </div>
        </ReviewSection>

        {/* Items */}
        <ReviewSection
          title={`Items (${itemCount})`}
          icon={<IconPackage className='h-4 w-4' />}
          onEdit={() => goTo('shipping')}
        >
          <ul className='space-y-3'>
            {items.map((item) => (
              <li key={`${item.id}-${item.color}-${item.size}`} className='flex items-center gap-3'>
                <div className='bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg'>
                  {item.image && (
                    <Image src={item.image} alt={item.name || ''} fill className='object-cover' />
                  )}
                  <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                    {item.quantity}
                  </span>
                </div>
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-medium'>{item.name}</p>
                  {(item.color || item.size) && (
                    <p className='text-muted-foreground text-xs'>
                      {[item.color, item.size].filter(Boolean).join(' / ')}
                    </p>
                  )}
                </div>
                <p className={cn(cartMoneyClassName, 'text-sm font-medium')}>
                  {formatCartMoney((item.price ?? 0) * (item.quantity ?? 0))}
                </p>
              </li>
            ))}
          </ul>
        </ReviewSection>

        {/* Order total */}
        <section className='bg-card border-border/60 rounded-xl border p-4 sm:p-5'>
          <h3 className='mb-3 text-sm font-semibold'>Order total</h3>
          <dl className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>Subtotal</dt>
              <dd className={cartMoneyClassName}>{formatCartMoney(subtotal)}</dd>
            </div>
            {couponDiscount > 0 && (
              <div className='flex justify-between text-green-600'>
                <dt>Discount{appliedCouponCode ? ` (${appliedCouponCode})` : ''}</dt>
                <dd className={cartMoneyClassName}>−{formatCartMoney(couponDiscount)}</dd>
              </div>
            )}
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>Shipping</dt>
              <dd className={cartMoneyClassName}>
                {shippingPrice === 0 ? (
                  <span className='text-green-600'>Free</span>
                ) : (
                  formatCartMoney(shippingPrice)
                )}
              </dd>
            </div>
            <div className='flex justify-between'>
              <dt className='text-muted-foreground'>
                {settings.estimatedTaxEnabled
                  ? `Est. tax (${formatEstimatedTaxLabel(settings.estimatedTaxRate)})`
                  : 'Tax'}
              </dt>
              <dd className={cartMoneyClassName}>{formatCartMoney(tax)}</dd>
            </div>
          </dl>
          <Separator className='my-3' />
          <div className='flex items-center justify-between'>
            <span className='font-semibold'>Total</span>
            <span className={cn(cartMoneyClassName, 'text-xl font-bold')}>
              {formatCartMoney(total)}
            </span>
          </div>
        </section>

        {/* Terms */}
        <div className='bg-muted/40 border-border/60 flex items-start gap-3 rounded-xl border p-4'>
          <Checkbox
            id='agree-terms'
            checked={agreedToTerms}
            onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            className='mt-0.5'
          />
          <Label htmlFor='agree-terms' className='text-muted-foreground text-sm leading-relaxed'>
            I agree to the{' '}
            <a href='/terms' target='_blank' className='text-accent underline'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='/privacy' target='_blank' className='text-accent underline'>
              Privacy Policy
            </a>
            , and confirm my order details are correct.
          </Label>
        </div>

        <p className='text-muted-foreground flex items-center justify-center gap-1.5 text-xs'>
          <IconShieldLock className='h-3.5 w-3.5' />
          Your payment is encrypted and processed securely.
        </p>
      </motion.div>
    );
  }
});
