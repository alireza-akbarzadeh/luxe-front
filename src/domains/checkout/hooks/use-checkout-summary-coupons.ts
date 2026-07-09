'use client';

import { useStore } from '@tanstack/react-form';
import { type KeyboardEvent, useEffect, useRef } from 'react';

import { useTypedAppFormContext } from '@/components/forms/useAppForm';
import { useGetCouponsBestAutomatic } from '@/services/-coupons-best-automatic-get';
import { useGetCouponsMy } from '@/services/-coupons-my-get';
import { useCartController } from '~/src/hooks/useCartController';

import { checkoutDefaultValues } from '../schemas/checkout.schema';
import { useCheckoutStore } from '../store/checkout.store';
import { useCheckoutTotals } from './useCartTotal';
import { useCheckoutCoupon } from './useCheckoutCoupon';

/** Coupon apply/clear state for checkout summary panels. */
export function useCheckoutSummaryCoupons() {
  const form = useTypedAppFormContext({ defaultValues: checkoutDefaultValues });
  const shippingProviderId = useStore(form.store, (s) => s.values.shippingProviderId);
  const couponCode = useStore(form.store, (s) => s.values.couponCode);
  const { items } = useCartController();
  const { subtotal, couponDiscount } = useCheckoutTotals(shippingProviderId);
  const appliedCouponCode = useCheckoutStore((s) => s.appliedCouponCode);
  const itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);

  const { data: couponsData, isLoading: couponsLoading } = useGetCouponsMy({
    order_total: subtotal > 0 ? subtotal : undefined
  });
  const applicableCoupons = couponsData?.data ?? [];

  const {
    applyCoupon,
    applyCouponResult,
    isApplyingCoupon,
    error: couponError
  } = useCheckoutCoupon({
    subtotal: subtotal ?? 0,
    itemCount,
    setCouponCode: (code) => form.setFieldValue('couponCode', code)
  });

  const hasAutoAppliedRef = useRef(false);

  const { data: automaticPromo } = useGetCouponsBestAutomatic(
    {
      order_total: subtotal > 0 ? subtotal : 0,
      item_count: itemCount > 0 ? itemCount : 1
    },
    {
      query: {
        enabled: subtotal > 0 && !appliedCouponCode && !couponCode?.trim(),
        retry: false
      }
    }
  );

  useEffect(() => {
    if (hasAutoAppliedRef.current || appliedCouponCode || couponCode?.trim()) return;

    const promo = automaticPromo?.data;
    const code = promo?.coupon?.code;
    const discount = promo?.discount_amount ?? 0;

    if (!code || discount <= 0) return;

    hasAutoAppliedRef.current = true;
    applyCouponResult(code, discount, { silent: true });
  }, [automaticPromo, appliedCouponCode, couponCode, applyCouponResult]);

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
    hasAutoAppliedRef.current = true;
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
