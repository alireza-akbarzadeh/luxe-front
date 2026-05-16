// app/checkout/components/checkout-payment.tsx
import { motion } from 'framer-motion';
import { IconChevronLeft, IconChevronRight, IconCreditCard, IconLock } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface CheckoutPaymentProps {
  form: any;
  onNext: () => void;
  onBack: () => void;
}

export function CheckoutPayment({ form, onNext, onBack }: CheckoutPaymentProps) {
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
          <form.AppField name='cardNumber'>
            {(field) => (
              <div className='relative'>
                <field.TextField
                  label='Card Number'
                  placeholder='1234 5678 9012 3456'
                  className='pl-10'
                />
                <IconCreditCard className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
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
              {(field) => <field.Checkbox id='saveInfo' />}
            </form.AppField>
            <Label htmlFor='saveInfo' className='text-sm font-normal'>
              Save this information for next time
            </Label>
          </div>
          <form.AppField name='couponCode'>
            {(field) => <field.TextField label='Coupon Code (optional)' placeholder='SAVE10' />}
          </form.AppField>
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
