'use client';

import { useStore } from '@tanstack/react-form';
import { type KeyboardEvent, useEffect } from 'react';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { useGetCouponsMy } from '@/services/-coupons-my-get';

import { checkoutDefaultValues } from '../schemas/checkout.schema';
import { useCheckoutStore } from '../store/checkout.store';
import { useCheckoutTotals } from './useCartTotal';
import { useCheckoutCoupon } from './useCheckoutCoupon';

/** Coupon apply/clear state for checkout summary panels. */
export function useCheckoutSummaryCoupons() {
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);
  const couponCode = useStore(form.store, (s) => s.values.couponCode);
  const { subtotal, couponDiscount, total } = useCheckoutTotals(shippingProviderId);
  const appliedCouponCode = useCheckoutStore((s) => s.appliedCouponCode);

  const { data: couponsData, isLoading: couponsLoading } = useGetCouponsMy({
    order_total: total ?? 0
  });
  const applicableCoupons = couponsData?.data ?? [];

  const {
    applyCoupon,
    isApplyingCoupon,
    error: couponError
  } = useCheckoutCoupon({
    subtotal: subtotal ?? 0,
    setCouponCode: (code) => form.setFieldValue('couponCode', code)
  });

  useEffect(() => {
    if (appliedCouponCode && appliedCouponCode !== couponCode) {
      form.setFieldValue('couponCode', appliedCouponCode);
    }
  }, [appliedCouponCode, couponCode, form]);

  const trimmedCode = couponCode?.trim() ?? '';
  const isApplied = Boolean(appliedCouponCode && couponDiscount > 0);
  const isDuplicate = trimmedCode.toUpperCase() === appliedCouponCode;

  const handleApply = (code?: string) => {
    const codeToApply = (code ?? trimmedCode).trim();
    if (!codeToApply || codeToApply.toUpperCase() === appliedCouponCode) return;
    applyCoupon(codeToApply.toUpperCase());
  };

  const handleClear = () => {
    form.setFieldValue('couponCode', '');
    applyCoupon('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    handleApply();
  };

  const setCouponInput = (value: string) => form.setFieldValue('couponCode', value);

  return {
    applicableCoupons,
    couponsLoading,
    appliedCouponCode,
    couponCode: couponCode ?? '',
    couponDiscount,
    couponError,
    isApplyingCoupon,
    isApplied,
    isDuplicate,
    trimmedCode,
    handleApply,
    handleClear,
    handleKeyDown,
    setCouponInput
  };
}
