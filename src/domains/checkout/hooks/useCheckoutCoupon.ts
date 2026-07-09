// app/checkout/hooks/useCheckoutCoupon.ts
import { useState } from 'react';
import { toast } from 'sonner';

import { usePostCouponsValidate } from '@/services/-coupons-validate-post';

import { useCheckoutStore } from '../store/checkout.store';

interface Props {
  subtotal: number;
  itemCount: number;
  setCouponCode: (code: string) => void;
}

export function useCheckoutCoupon({ subtotal, itemCount, setCouponCode }: Props) {
  const [error, setError] = useState<string>('');

  const { setCouponDiscount, setAppliedCouponCode, resetCoupon } = useCheckoutStore();

  const { mutate, isPending } = usePostCouponsValidate();

  const applyCoupon = (code: string, options?: { silent?: boolean }) => {
    if (!code || code.trim() === '') {
      resetCoupon();
      setCouponCode('');
      setError('');
      if (!options?.silent) {
        toast.info('Coupon removed');
      }
      return;
    }

    setError('');

    mutate(
      {
        data: {
          code: code.trim().toUpperCase(),
          order_total: subtotal,
          item_count: itemCount > 0 ? itemCount : 1
        }
      },
      {
        onSuccess: (res) => {
          if (!res?.data?.discount_amount && res?.data?.discount_amount !== 0) {
            const errorMessage = 'Invalid coupon response';
            setError(errorMessage);
            if (!options?.silent) toast.error(errorMessage);
            resetCoupon();
            setCouponCode('');
            return;
          }

          const discount = res.data.discount_amount;

          setCouponDiscount(discount);
          setAppliedCouponCode(code.trim().toUpperCase());
          setCouponCode(code.trim().toUpperCase());

          setError('');
          if (!options?.silent) {
            toast.success(`Coupon applied! You save $${discount.toFixed(2)}`);
          }
        },

        onError: (err) => {
          const errorMessage = err?.message || err?.error || 'Invalid or expired coupon';

          setError(errorMessage);
          if (!options?.silent) toast.error(errorMessage);

          resetCoupon();
          setCouponCode('');
        }
      }
    );
  };

  const applyCouponResult = (code: string, discount: number, options?: { silent?: boolean }) => {
    setError('');
    setCouponDiscount(discount);
    setAppliedCouponCode(code.trim().toUpperCase());
    setCouponCode(code.trim().toUpperCase());
    if (!options?.silent && discount > 0) {
      toast.success(`Promotion applied! You save $${discount.toFixed(2)}`);
    }
  };

  return {
    applyCoupon,
    applyCouponResult,
    isApplyingCoupon: isPending,
    error
  };
}
