// app/checkout/components/checkout-review.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  IconChevronLeft,
  IconCreditCard,
  IconLock,
  IconPackage,
  IconTruck
} from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { useCart } from '~/src/hooks/useCartController';

const shippingMethods = {
  standard: { name: 'Standard Shipping', price: 0 },
  express: { name: 'Express Shipping', price: 15 },
  overnight: { name: 'Overnight Shipping', price: 30 }
};

interface CheckoutReviewProps {
  form: any;
  onBack: () => void;
  isSubmitting: boolean;
}

export function CheckoutReview({ form, onBack, isSubmitting }: CheckoutReviewProps) {
  const { items, subtotal } = useCart();
  const values = form.getFieldValues();
  const shippingCost = shippingMethods[values.shippingMethod]?.price || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  return (
    <motion.div
      key='review'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='space-y-6'
    >
      <h2 className='mb-6 text-2xl font-bold'>Review Your Order</h2>

      {/* Shipping Address Summary */}
      <div className='bg-card border-border/50 rounded-xl border p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='flex items-center gap-2 font-medium'>
            <IconTruck className='h-4 w-4' /> Shipping Address
          </h3>
          <Button variant='ghost' size='sm' onClick={onBack} className='text-accent'>
            Edit
          </Button>
        </div>
        <p className='text-muted-foreground text-sm'>
          {values.firstName} {values.lastName}
          <br />
          {values.addressLine1}
          {values.addressLine2 && `, ${values.addressLine2}`}
          <br />
          {values.city}, {values.state} {values.zip}
          <br />
          {values.phone}
        </p>
        <p className='mt-2 text-sm'>
          <span className='text-muted-foreground'>Shipping Method:</span>{' '}
          {shippingMethods[values.shippingMethod]?.name}
        </p>
      </div>

      {/* Payment Summary */}
      <div className='bg-card border-border/50 rounded-xl border p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='flex items-center gap-2 font-medium'>
            <IconCreditCard className='h-4 w-4' /> Payment Method
          </h3>
          <Button variant='ghost' size='sm' onClick={onBack} className='text-accent'>
            Edit
          </Button>
        </div>
        <p className='text-muted-foreground text-sm'>
          Card ending in {values.cardNumber.slice(-4) || '****'}
          <br />
          {values.cardName || 'Name on card'}
        </p>
      </div>

      {/* Items Summary */}
      <div className='bg-card border-border/50 rounded-xl border p-4'>
        <h3 className='mb-4 flex items-center gap-2 font-medium'>
          <IconPackage className='h-4 w-4' /> Items ({items.length})
        </h3>
        <div className='space-y-3'>
          {items.map((item) => (
            <div key={`${item.id}-${item.color}-${item.size}`} className='flex items-center gap-3'>
              <div className='bg-muted relative h-12 w-12 shrink-0 overflow-hidden rounded-lg'>
                <Image src={item.image} alt={item.name} fill className='object-cover' />
                <span className='bg-accent text-accent-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs'>
                  {item.quantity}
                </span>
              </div>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{item.name}</p>
                {(item.color || item.size) && (
                  <p className='text-muted-foreground text-xs'>
                    {item.color && `${item.color}`}
                    {item.color && item.size && ' / '}
                    {item.size && `${item.size}`}
                  </p>
                )}
              </div>
              <p className='text-sm font-medium'>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-between pt-6'>
        <Button variant='ghost' onClick={onBack} className='rounded-full'>
          <IconChevronLeft className='mr-2 h-4 w-4' /> Back
        </Button>
        <Button type='submit' disabled={isSubmitting} className='min-w-[200px] rounded-full'>
          {isSubmitting ? (
            <span className='flex items-center gap-2'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className='h-4 w-4 rounded-full border-2 border-current border-t-transparent'
              />
              Processing...
            </span>
          ) : (
            <>
              <IconLock className='mr-2 h-4 w-4' />
              Place Order - ${total.toFixed(2)}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
