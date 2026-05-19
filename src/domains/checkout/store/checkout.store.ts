// app/checkout/store/checkout.store.ts
import { create } from 'zustand';

interface CheckoutStore {
  // Coupon
  couponDiscount: number;
  appliedCouponCode: string;
  setCouponDiscount: (value: number) => void;
  setAppliedCouponCode: (value: string) => void;
  resetCoupon: () => void;

  // Shipping
  selectedShippingMethod: string;
  selectedShippingPrice: number;
  setShippingMethod: (method: string, price: number) => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  couponDiscount: 0,
  appliedCouponCode: '',
  setCouponDiscount: (value) => set({ couponDiscount: value }),
  setAppliedCouponCode: (value) => set({ appliedCouponCode: value }),
  resetCoupon: () => set({ couponDiscount: 0, appliedCouponCode: '' }),

  selectedShippingMethod: '',
  selectedShippingPrice: 0,
  setShippingMethod: (method, price) =>
    set({ selectedShippingMethod: method, selectedShippingPrice: price }),
}));
