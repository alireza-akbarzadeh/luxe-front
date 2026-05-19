// app/checkout/components/checkout-review.tsx
import { Button } from '@/components/ui/button';
import {
  IconCreditCard,
  IconPackage,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '~/src/hooks/useCartController';
import type { CheckoutFormValues } from '../checkout.schema';


interface CheckoutReviewProps {
  formValues: CheckoutFormValues;
  onBack: () => void;
}

export function CheckoutReview(props: CheckoutReviewProps) {
  const { formValues, onBack } = props
  const { items } = useCart();


  return (
    <motion.div
      key='review'
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className='space-y-6'
    >
      <h2 className='mb-6 text-2xl font-bold'>Review Your Order</h2>

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
          {formValues.firstName} {formValues.lastName}
          <br />
          {formValues.addressLine1}
          {formValues.addressLine2 && `, ${formValues.addressLine2}`}
          <br />
          {formValues.city}, {formValues.state} {formValues.zip}
          <br />
          {formValues.phone}
        </p>
        <p className='mt-2 text-sm'>
          <span className='text-muted-foreground'>Shipping Method:</span>{' '}
          {formValues.shippingMethod}
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
          Card ending in {formValues.cardNumber.slice(-4) || '****'}
          <br />
          {formValues.cardName || 'Name on card'}
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
                <Image src={item.image || ""} alt={item.name || ""} fill className='object-cover' />
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
              <p className='text-sm font-medium'>${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
