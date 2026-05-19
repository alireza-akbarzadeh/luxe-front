'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { IconCreditCard, IconLock, IconTag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useGetCoupons } from '~/src/services/-coupons-get';
import { AvailableCoupons } from '../components/available-coupons';
import { useCheckoutCoupon } from '../hooks/useCheckoutCoupon';
import { useCheckoutStore } from '../store/checkout.store';
import { useCheckoutTotals } from '../hooks/useCartTotal'; // or wherever totals are
import { useCheckoutForm } from '../hooks/useCheckoutForm';

export function CheckoutPayment() {
  const form = useCheckoutForm();
  const { data: couponsData, isLoading: couponsLoading } = useGetCoupons({ is_active: true });
  const allCoupons = couponsData?.data?.coupons || [];

  // Get coupon state from store (optional, for display)
  const { appliedCouponCode, couponDiscount } = useCheckoutStore();

  // Get the applyCoupon logic (handles API + store updates)
  const { applyCoupon, isApplyingCoupon } = useCheckoutCoupon({
    subtotal: useCheckoutTotals().subtotal,
    setCouponCode: (code) => form.setFieldValue('couponCode', code),
  });

  const currentCouponCode = form.getFieldValue('couponCode');
  const applicableCoupons = allCoupons.filter(
    (coupon) => (coupon.minimum_order_amount ?? 0) <= (useCheckoutTotals().subtotal ?? 0)
  );

  const handleApply = (code?: string) => {
    const codeToApply = code || currentCouponCode;
    if (!codeToApply) return;
    applyCoupon(codeToApply);
  };

  const handleClear = () => {
    form.setFieldValue('couponCode', '');
    applyCoupon(''); // removes coupon
  };

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
        <div className='space-y-4'>
          {/* Card fields */}
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
          <form.AppField name='cardName'>
            {(field) => <field.TextField label='Name on Card' placeholder='John Doe' />}
          </form.AppField>
          <div className='grid grid-cols-2 gap-4'>
            <form.AppField name='expiry'>
              {(field) => <field.TextField label='Expiry Date' placeholder='MM/YY' />}
            </form.AppField>
            <form.AppField name='cvc'>
              {(field) => <field.TextField label='CVC' placeholder='123' />}
            </form.AppField>
          </div>
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
                    />
                  )}
                </form.AppField>
              </div>
              {currentCouponCode ? (
                <Button type='button' variant='outline' onClick={handleClear} className='rounded-full'>
                  Remove
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={() => handleApply()}
                  disabled={!currentCouponCode || isApplyingCoupon}
                  className='rounded-full'
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              )}
            </div>
          </div>

          {/* Available Coupons */}
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
