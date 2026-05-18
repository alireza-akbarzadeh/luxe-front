'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  IconArrowRight,
  IconRotateClockwise,
  IconShieldCheck,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '~/src/hooks/useCartController';

export function OrderSummary() {
  const { subtotal, items } = useCart();

  const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);

  const shipping = subtotal > 100 ? 0 : 12;
  // FIXME:move this to backend
  const total = subtotal - totalDiscount + shipping;

  return (
    <div className='lg:col-span-1'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className='bg-card border-border/50 sticky top-24 rounded-2xl border p-6'
      >
        <h2 className='mb-4 text-lg font-semibold'>Order Summary</h2>

        <div className='space-y-3 text-sm'>
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {totalDiscount > 0 && (
            <div className='flex justify-between text-green-600'>
              <span>Product Discount</span>
              <span>-${totalDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className='flex justify-between'>
            <span className='text-muted-foreground'>Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className='text-green-600'>Free</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
        </div>

        <Separator className='my-4' />

        <div className='mb-6 flex items-center justify-between'>
          <span className='font-semibold'>Total</span>
          <span className='text-2xl font-bold'>${total.toFixed(2)}</span>
        </div>

        <Link href='/checkout' className='block'>
          <Button className='w-full rounded-full' size='lg'>
            Proceed to Checkout
            <IconArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </Link>

        {/* Trust Badges */}
        <div className='mt-6 grid grid-cols-3 gap-2'>
          <div className='p-2 text-center'>
            <IconTruck className='text-muted-foreground mx-auto mb-1 h-5 w-5' />
            <p className='text-muted-foreground text-xs'>Free Shipping</p>
          </div>
          <div className='p-2 text-center'>
            <IconShieldCheck className='text-muted-foreground mx-auto mb-1 h-5 w-5' />
            <p className='text-muted-foreground text-xs'>Secure Pay</p>
          </div>
          <div className='p-2 text-center'>
            <IconRotateClockwise className='text-muted-foreground mx-auto mb-1 h-5 w-5' />
            <p className='text-muted-foreground text-xs'>30-Day Return</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
