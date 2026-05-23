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

  // Use the global store instead of local state
  const {
    setCouponDiscount,
    setAppliedCouponCode,
    resetCoupon
  } = useCheckoutStore();

  const { mutate, isPending } = usePostCouponsValidate();

  const applyCoupon = (code: string) => {
    // Clear coupon if no code provided
    if (!code || code.trim() === '') {
      resetCoupon();
      setCouponCode('');
      setError('');
      toast.info('Coupon removed');
      return;
    }

    // Clear previous error
    setError('');

    mutate(
        {
          data: {
            code: code.trim().toUpperCase(),
            order_total: subtotal,
          },
        },
        {
          onSuccess: (res) => {
            const discount = res?.data?.discount_amount || 0;

            // Update global store
            setCouponDiscount(discount);
            setAppliedCouponCode(code.trim().toUpperCase());

            // Update form field
            setCouponCode(code.trim().toUpperCase());

            setError('');
            toast.success(`Coupon applied! You save $${discount.toFixed(2)}`);
          },

          onError: (err: any) => {
            const errorMessage = err?.message || 'Invalid or expired coupon';

            setError(errorMessage);
            toast.error(errorMessage);

            // Clear everything on error
            resetCoupon();
            setCouponCode('');
          },
        }
    );
  };

  return {
    applyCoupon,
    isApplyingCoupon: isPending,
    error,
  };
}
