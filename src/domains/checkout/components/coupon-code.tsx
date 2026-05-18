import { IconTag } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePostCouponsValidate } from '~/src/services/-coupons-validate-post';
import { useCart } from '~/src/hooks/useCartController';
import { useState } from 'react';
import { toast } from 'sonner';

export function CouponCode() {
  const { mutate: validateCoupon, isPending: isValidating } = usePostCouponsValidate();
  const { items, subtotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
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

  return (
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
      <p className='text-muted-foreground mt-1 pt-2 text-xs'>Try &quot;LUXE10&quot; for 10% off</p>
      {totalDiscount}
      {promoDiscount}
    </div>
  );
}
