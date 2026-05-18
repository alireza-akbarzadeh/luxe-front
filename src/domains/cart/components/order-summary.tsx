'use client';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  IconArrowRight,
  IconRotateClockwise,
  IconShieldCheck,
  IconTag,
  IconTruck
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useCart } from '~/src/hooks/useCartController';
import { usePostCouponsValidate } from '~/src/services/-coupons-validate-post';
import { toast } from 'sonner';

export function OrderSummary() {
  const { items, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);

  const { mutate: validateCoupon, isPending: isValidating } = usePostCouponsValidate();

  const totalDiscount = items.reduce((sum, item) => sum + (item.discount || 0), 0);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    validateCoupon(
      { data: { code: promoCode, order_total: subtotal } },
      {
        onSuccess: (response) => {
          const data = response.data;
          setPromoDiscount(data?.discount_amount as number);
          setPromoApplied(true);
          toast.success(`Coupon applied! You saved $${data?.discount_amount?.toFixed(2)}`);
        },
        onError: (error: any) => {
          const message = error?.response?.data?.message || 'Invalid or expired coupon';
          toast.error(message);
          setPromoApplied(false);
          setPromoDiscount(0);
        }
      }
    );
  };
  const shipping = subtotal > 100 ? 0 : 12;
  const total = subtotal - totalDiscount - promoDiscount + shipping;

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
          {promoApplied && (
            <div className='flex justify-between text-green-600'>
              <span>Promo Code ({promoCode.toUpperCase()})</span>
              <span>-${promoDiscount.toFixed(2)}</span>
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

        {/* Promo Code */}
        <div className='mb-4'>
          <label className='mb-2 block text-sm font-medium'>Promo Code</label>
          <div className='flex gap-2'>
            <div className='relative flex-1'>
              <IconTag className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
              <Input
                placeholder='Enter code'
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className='rounded-full pl-9'
                disabled={promoApplied || isValidating}
              />
            </div>
            <Button
              variant='outline'
              onClick={handleApplyPromo}
              disabled={promoApplied || !promoCode || isValidating}
              className='rounded-full'
            >
              {isValidating ? 'Validating...' : promoApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
          <p className='text-muted-foreground mt-1 pt-2 text-xs'>
            Try &quot;LUXE10&quot; for 10% off
          </p>
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
