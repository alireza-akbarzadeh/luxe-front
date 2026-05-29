// app/checkout/hooks/useCheckoutCoupon.ts
import { useState } from 'react';
import { toast } from 'sonner';

import { usePostCouponsValidate } from '@/services/-coupons-validate-post';

import { useCheckoutStore } from '../store/checkout.store';

interface Props {
  subtotal: number;
  setCouponCode: (code: string) => void;
}

export function useCheckoutCoupon({ subtotal, setCouponCode }: Props) {
  const [error, setError] = useState<string>('');

  const { setCouponDiscount, setAppliedCouponCode, resetCoupon } = useCheckoutStore();

  const { mutate, isPending } = usePostCouponsValidate();

  const applyCoupon = (code: string) => {
    if (!code || code.trim() === '') {
      resetCoupon();
      setCouponCode('');
      setError('');
      toast.info('Coupon removed');
      return;
    }

    setError('');

    mutate(
      {
        data: {
          code: code.trim().toUpperCase(),
          order_total: subtotal
        }
      },
      {
        onSuccess: (res) => {
          if (!res?.data?.discount_amount && res?.data?.discount_amount !== 0) {
            const errorMessage = 'Invalid coupon response';
            setError(errorMessage);
            toast.error(errorMessage);
            resetCoupon();
            setCouponCode('');
            return;
          }

          const discount = res.data.discount_amount;

          setCouponDiscount(discount);
          setAppliedCouponCode(code.trim().toUpperCase());
          setCouponCode(code.trim().toUpperCase());

          setError('');
          toast.success(`Coupon applied! You save $${discount.toFixed(2)}`);
        },

        onError: (err) => {
          const errorMessage = err?.message || err?.error || 'Invalid or expired coupon';

          setError(errorMessage);
          toast.error(errorMessage);

          resetCoupon();
          setCouponCode('');
        }
      }
    );
  };

  return {
    applyCoupon,
    isApplyingCoupon: isPending,
    error
  };
}
