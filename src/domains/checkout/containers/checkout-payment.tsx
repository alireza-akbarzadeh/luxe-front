'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { IconCreditCard, IconLock, IconTag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { AvailableCoupons } from '../components/available-coupons';
import { useCheckoutTotals } from '../hooks/useCartTotal';
import { useCheckoutCoupon } from '../hooks/useCheckoutCoupon';
import { useCheckoutStore } from '../store/checkout.store';
import { useEffect } from 'react';
import { useGetCouponsMy } from '@/services/-coupons-my-get';
import type { CheckoutFormApi } from '@/domains/checkout/hooks/useCheckoutForm';
import type { CheckoutFormValues } from '../checkout.schema';

interface CheckoutPaymentProps {
  form: CheckoutFormApi;
}

export function CheckoutPayment(props: CheckoutPaymentProps) {
  const { form } = props;
  const { subtotal, couponDiscount, total } = useCheckoutTotals();
  const couponCode = form.getFieldValue('couponCode');

  const { data: couponsData, isLoading: couponsLoading } = useGetCouponsMy({
    order_total: total ?? 0,
  });
  const applicableCoupons = couponsData?.data || [];

  const { appliedCouponCode } = useCheckoutStore();

  const { applyCoupon, isApplyingCoupon, error: couponError } = useCheckoutCoupon({
    subtotal: subtotal ?? 0,
    setCouponCode: (code) => form.setFieldValue('couponCode', code),
  });

  const currentCouponCode = couponCode || '';

  useEffect(() => {
    if (appliedCouponCode && appliedCouponCode !== currentCouponCode) {
      form.setFieldValue('couponCode', appliedCouponCode);
    }
  }, [appliedCouponCode, currentCouponCode, form]);

  const handleApply = (code?: string) => {
    const codeToApply = code || currentCouponCode;
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
        <div className='bg-muted/50 border-border mb-6 flex items-center gap-3 rounded-xl border p-4'>
          <IconLock className='text-muted-foreground h-5 w-5' />
          <p className='text-muted-foreground text-sm'>
            Your payment information is encrypted and secure
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="mb-6">
          <Label className="mb-3 block font-medium">Payment Method</Label>
          <form.AppField name="paymentMethod">
            {(field) => (
              <RadioGroup
                value={field.state.value}
                onValueChange={(value) => field.handleChange(value as CheckoutFormValues["paymentMethod"])}
                className="flex gap-4"
              >
                <Label
                  htmlFor="payment-credit"
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-colors ${field.state.value === 'credit_card' ? 'border-accent bg-accent/5' : 'border-border'
                    }`}
                >
                  <RadioGroupItem value="credit_card" id="payment-credit" />
                  <span>Credit Card</span>
                </Label>
                <Label
                  htmlFor="payment-debit"
                  className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 transition-colors ${field.state.value === 'debit_card' ? 'border-accent bg-accent/5' : 'border-border'
                    }`}
                >
                  <RadioGroupItem value="debit_card" id="payment-debit" />
                  <span>Debit Card</span>
                </Label>
              </RadioGroup>
            )}
          </form.AppField>
        </div>

        <div className='space-y-4'>
          {/* Card Number */}
          <form.AppField name='cardNumber'>
            {(field) => (
              <div className='relative'>
                <field.TextField
                  startIcon={IconCreditCard}
                  label='Card Number'
                  placeholder='1234 5678 9012 3456'
                  className='pl-10'
                />
              </div>
            )}
          </form.AppField>

          {/* Expiry Fields (split) */}
          <div className='grid grid-cols-2 gap-4'>
            <form.AppField name='expiryMonth'>
              {(field) => (
                <field.TextField label='Expiry Month' placeholder='MM' maxLength={2} />
              )}
            </form.AppField>
            <form.AppField name='expiryYear'>
              {(field) => (
                <field.TextField label='Expiry Year' placeholder='YYYY' maxLength={4} />
              )}
            </form.AppField>
          </div>

          {/* CVC */}
          <form.AppField name='cvv'>
            {(field) => (
              <field.TextField label='CVC' placeholder='123' maxLength={4} />
            )}
          </form.AppField>

          {/* Save info toggle (UI only) */}
          <div className='flex items-center gap-2 pt-2'>
            <form.AppField name='saveInfo'>
              {(field) => (
                <field.Checkbox label='Save this information for next time' id='saveInfo' />
              )}
            </form.AppField>
          </div>

          {/* Coupon Section (unchanged) */}
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
                <form.Subscribe
                  selector={(state) => state.values.couponCode}
                >
                  {(couponCode) => {
                    const trimmedCode = (couponCode || '').trim();
                    const isSameCoupon = trimmedCode.toUpperCase() === appliedCouponCode;
                    const isButtonDisabled = !trimmedCode || isSameCoupon || isApplyingCoupon;

                    return (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          if (trimmedCode && !isSameCoupon) {
                            applyCoupon(trimmedCode);
                          }
                        }}
                        disabled={isButtonDisabled}
                        loading={isApplyingCoupon}
                      >
                        Apply
                      </Button>
                    );
                  }}
                </form.Subscribe>
              )}
            </div>

            {/* Success/Error Messages */}
            {isApplied && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className='mt-2 text-sm text-green-600'
              >
                ✓ Coupon applied! You saved ${couponDiscount.toFixed(2)}
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
