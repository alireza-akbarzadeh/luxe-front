'use client';

import { IconCreditCard, IconLock, IconTag } from '@tabler/icons-react';
import { useStore } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import { withForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatCartMoney } from '@/domains/cart/lib/cart-utils';
import { checkoutDefaultValues } from '@/domains/checkout/checkout.schema';
import {
  detectCardBrand,
  formatCardNumber,
  getCardBrandLabel,
  paymentMethodRequiresCard
} from '@/domains/checkout/lib/checkout-utils';
import { useGetCouponsMy } from '@/services/-coupons-my-get';

import { AvailableCoupons } from '../components/available-coupons';
import { PaymentMethodSelector } from '../components/payment-providers';
import { useCheckoutTotals } from '../hooks/useCartTotal';
import { useCheckoutCoupon } from '../hooks/useCheckoutCoupon';
import { useCheckoutStore } from '../store/checkout.store';

const onlyDigits = (max: number) => (value: string) => value.replace(/\D/g, '').slice(0, max);

export const CheckoutPayment = withForm({
  defaultValues: checkoutDefaultValues,

  render: function PaymentRender({ form }) {
    const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);
    const paymentMethod = useStore(form.store, (s) => s.values.paymentMethod);
    const cardNumberValue = useStore(form.store, (s) => s.values.cardNumber);
    const { subtotal, couponDiscount, total } = useCheckoutTotals(shippingProviderId);
    const couponCode = form.state.values.couponCode; // reactive value

    const requiresCard = paymentMethodRequiresCard(paymentMethod);
    const cardBrand = detectCardBrand(cardNumberValue ?? '');

    const { data: couponsData, isLoading: couponsLoading } = useGetCouponsMy({
      order_total: total ?? 0
    });
    const applicableCoupons = couponsData?.data || [];

    const { appliedCouponCode } = useCheckoutStore();

    const {
      applyCoupon,
      isApplyingCoupon,
      error: couponError
    } = useCheckoutCoupon({
      subtotal: subtotal ?? 0,
      setCouponCode: (code) => form.setFieldValue('couponCode', code)
    });

    useEffect(() => {
      if (appliedCouponCode && appliedCouponCode !== couponCode) {
        form.setFieldValue('couponCode', appliedCouponCode);
      }
    }, [appliedCouponCode, couponCode, form]);

    const handleApply = (code?: string) => {
      const codeToApply = code || couponCode;
      if (!codeToApply || codeToApply.trim() === '') return;
      applyCoupon(codeToApply.trim().toUpperCase());
    };

    const handleClear = () => {
      form.setFieldValue('couponCode', '');
      applyCoupon('');
    };

    const isApplied = appliedCouponCode && couponDiscount > 0;

    return (
      <motion.div
        key='payment'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className='space-y-6'
      >
        <div>
          <h2 className='mb-6 text-2xl font-bold'>Payment Details</h2>
          <div className='bg-muted/50 border-border mb-4 flex items-center gap-3 rounded-xl border p-4'>
            <IconLock className='text-muted-foreground h-5 w-5 shrink-0' />
            <p className='text-muted-foreground text-sm'>
              Your payment information is encrypted and secure
            </p>
          </div>
          <div className='border-accent/30 bg-accent/5 text-muted-foreground mb-6 rounded-xl border px-4 py-3 text-sm'>
            Demo checkout: card details are validated locally and processed through our checkout API.
            No real charge is made in development environments.
          </div>

          {/* Payment Method Selector */}
          <div className='mb-6'>
            <Label className='mb-3 block font-medium'>Payment Method</Label>
            <form.AppField name='paymentMethod'>
              {(field) => (
                <PaymentMethodSelector
                  value={field.state.value}
                  onChange={(val) => field.handleChange(val)}
                />
              )}
            </form.AppField>
          </div>

          <div className='space-y-4'>
            {requiresCard && (
              <>
                {/* Card Number */}
                <form.AppField name='cardNumber'>
                  {(field) => (
                    <div className='relative'>
                      <field.TextField
                        startIcon={IconCreditCard}
                        label='Card Number'
                        placeholder='1234 5678 9012 3456'
                        inputMode='numeric'
                        autoComplete='cc-number'
                        transform={formatCardNumber}
                      />
                      {cardBrand !== 'unknown' && (
                        <span className='text-muted-foreground absolute top-9 right-4 text-xs font-medium'>
                          {getCardBrandLabel(cardBrand)}
                        </span>
                      )}
                    </div>
                  )}
                </form.AppField>

                {/* Expiry Fields (split) */}
                <div className='grid grid-cols-2 gap-4'>
                  <form.AppField name='expiryMonth'>
                    {(field) => (
                      <field.TextField
                        label='Expiry Month'
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
                        label='Expiry Year'
                        placeholder='YYYY'
                        inputMode='numeric'
                        autoComplete='cc-exp-year'
                        maxLength={4}
                        transform={onlyDigits(4)}
                      />
                    )}
                  </form.AppField>
                </div>

                {/* CVC */}
                <form.AppField name='cvv'>
                  {(field) => (
                    <field.TextField
                      label='CVC'
                      placeholder='123'
                      inputMode='numeric'
                      autoComplete='cc-csc'
                      maxLength={4}
                      transform={onlyDigits(4)}
                    />
                  )}
                </form.AppField>
              </>
            )}

            {/* Save info toggle (UI only) */}
            <div className='flex items-center gap-2 pt-2'>
              <form.AppField name='saveInfo'>
                {(field) => (
                  <field.Checkbox label='Save this information for next time' id='saveInfo' />
                )}
              </form.AppField>
            </div>

            {/* Coupon Section */}
            <div className='pt-2'>
              <Label className='mb-2 block text-sm font-medium'>Coupon Code (optional)</Label>
              <div className='flex gap-2'>
                <div className='relative flex-1'>
                  <IconTag className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                  <form.AppField name='couponCode'>
                    {(field) => (
                      <field.TextField
                        placeholder='Enter coupon code'
                        className='pl-9'
                        disabled={isApplyingCoupon}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const trimmedCode = field.state.value?.trim() || '';
                            const isSameCoupon = trimmedCode.toUpperCase() === appliedCouponCode;
                            if (trimmedCode && !isSameCoupon) {
                              applyCoupon(trimmedCode);
                            }
                          }
                        }}
                      />
                    )}
                  </form.AppField>
                </div>
                {isApplied ? (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleClear}
                    className='rounded-full'
                    disabled={isApplyingCoupon}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      const trimmedCode = couponCode?.trim() || '';
                      const isSameCoupon = trimmedCode.toUpperCase() === appliedCouponCode;
                      if (trimmedCode && !isSameCoupon) {
                        applyCoupon(trimmedCode);
                      }
                    }}
                    disabled={
                      !couponCode?.trim() ||
                      couponCode.trim().toUpperCase() === appliedCouponCode ||
                      isApplyingCoupon
                    }
                    loading={isApplyingCoupon}
                  >
                    Apply
                  </Button>
                )}
              </div>

              {/* Success/Error Messages */}
              {isApplied && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-2 text-sm text-green-600'
                >
                  ✓ Coupon applied! You saved {formatCartMoney(couponDiscount)}
                </motion.p>
              )}
              {couponError && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-2 text-sm text-red-600'
                >
                  {couponError}
                </motion.p>
              )}
            </div>

            {/* Available Coupons Accordion */}
            {!couponsLoading && applicableCoupons.length > 0 && (
              <AvailableCoupons
                applicableCoupons={applicableCoupons}
                selectedCouponCode={appliedCouponCode}
                isApplyingCoupon={isApplyingCoupon}
                onSelectCoupon={handleApply}
              />
            )}
          </div>
        </div>
      </motion.div>
    );
  }
});
