import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  IconChevronLeft,
  IconChevronRight,
  IconCreditCard,
  IconLock,
  IconTag
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { useGetCoupons } from '~/src/services/-coupons-get';
import { AvailableCoupons } from '../components/available-coupons';

interface CheckoutPaymentProps {
  form: any;
  onNext: () => void;
  onBack: () => void;
  onApplyCoupon: (code: string) => void;
  isApplyingCoupon: boolean;
  subtotal: number;
}

export function CheckoutPayment({
  form,
  onNext,
  onBack,
  onApplyCoupon,
  isApplyingCoupon,
  subtotal
}: CheckoutPaymentProps) {
  const couponFieldValue = form.getFieldValue('couponCode') || '';
  const { data: couponsData, isLoading: couponsLoading } = useGetCoupons({ is_active: true });
  const allCoupons = couponsData?.data?.coupons || [];

  const applicableCoupons = allCoupons.filter(
    (coupon) => (coupon.minimum_order_amount ?? 0) <= subtotal
  );

  const handleApply = (code?: string) => {
    const codeToApply = code || couponFieldValue;
    if (!codeToApply) return;
    onApplyCoupon(codeToApply);
    form.setFieldValue('couponCode', codeToApply);
  };

  const handleClear = () => {
    form.setFieldValue('couponCode', '');
    onApplyCoupon(''); // removes discount
  };

  const handleSelectCoupon = (code: string) => {
    if (form.getFieldValue('couponCode') === code) return;
    handleApply(code);
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
          {/* ... card fields ... */}
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

          {/* Coupon Code Section */}
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
              {form.getFieldValue('couponCode') ? (
                <Button
                  type='button'
                  variant='outline'
                  onClick={handleClear}
                  className='rounded-full'
                >
                  Remove
                </Button>
              ) : (
                <Button
                  type='button'
                  onClick={() => handleApply()}
                  disabled={!couponFieldValue || isApplyingCoupon}
                  className='rounded-full'
                >
                  {isApplyingCoupon ? 'Applying...' : 'Apply'}
                </Button>
              )}
            </div>
          </div>

          {/* Available Coupons Section */}
          {!couponsLoading && applicableCoupons.length > 0 && (
            <AvailableCoupons
              applicableCoupons={applicableCoupons}
              selectedCouponCode={form.getFieldValue('couponCode')}
              isApplyingCoupon={isApplyingCoupon}
              onSelectCoupon={(code) => handleApply(code)}
            />
          )}
        </div>
      </div>
      <div className='flex justify-between pt-6'>
        <Button variant='ghost' onClick={onBack} className='rounded-full'>
          <IconChevronLeft className='mr-2 h-4 w-4' /> Back
        </Button>
        <Button onClick={onNext} className='rounded-full'>
          Review Order <IconChevronRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </motion.div>
  );
}
