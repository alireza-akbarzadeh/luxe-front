import { useState } from 'react';

import { toast } from 'sonner';

import { usePostCouponsValidate }
  from '@/services/-coupons-validate-post';

interface Props {
  subtotal: number;
  setCouponCode: (code: string) => void;
}

export function useCheckoutCoupon({
  subtotal,
  setCouponCode
}: Props) {
  const [couponDiscount, setCouponDiscount] =
    useState(0);

  const [appliedCouponCode, setAppliedCouponCode] =
    useState('');

  const { mutate, isPending } =
    usePostCouponsValidate();

  const applyCoupon = (code: string) => {
    if (!code) {
      setCouponDiscount(0);

      setAppliedCouponCode('');

      setCouponCode('');

      toast.info('Coupon removed');

      return;
    }

    mutate(
      {
        data: {
          code,
          order_total: subtotal
        }
      },
      {
        onSuccess: (res) => {
          const discount =
            res?.data?.discount_amount || 0;

          setCouponDiscount(discount);

          setAppliedCouponCode(code);

          setCouponCode(code);

          toast.success(
            `Coupon applied! You save $${discount.toFixed(2)}`
          );
        },

        onError: (err) => {
          toast.error(
            err?.message ||
              'Invalid or expired coupon'
          );

          setCouponDiscount(0);

          setAppliedCouponCode('');

          setCouponCode('');
        }
      }
    );
  };

  return {
    couponDiscount,
    appliedCouponCode,
    applyCoupon,
    isApplyingCoupon: isPending
  };
}
