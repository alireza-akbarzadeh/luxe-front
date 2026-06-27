// app/checkout/store/checkout.store.ts
import { create } from 'zustand';

import type { CheckoutStepId } from '../checkout.schema';

interface CheckoutState {
  // Wizard
  currentStep: CheckoutStepId;
  completedSteps: CheckoutStepId[];

  // Coupon
  couponDiscount: number;
  appliedCouponCode: string;

  // Legal
  agreedToTerms: boolean;

  // Submit
  submitError: string | null;
  /** True after a successful checkout while navigating away — prevents empty-cart flash. */
  isRedirecting: boolean;
  /** Distinguishes Stripe payment redirect from post-order navigation. */
  redirectMode: 'payment' | 'confirmed' | null;
}

interface CheckoutActions {
  setCurrentStep: (step: CheckoutStepId) => void;
  markStepCompleted: (step: CheckoutStepId) => void;

  setCouponDiscount: (value: number) => void;
  setAppliedCouponCode: (value: string) => void;
  resetCoupon: () => void;

  setAgreedToTerms: (value: boolean) => void;
  setSubmitError: (value: string | null) => void;
  setIsRedirecting: (value: boolean) => void;
  setRedirectMode: (mode: CheckoutState['redirectMode']) => void;

  /** Clears all checkout-only UI state (call after a successful order). */
  reset: () => void;
}

type CheckoutStore = CheckoutState & CheckoutActions;

const initialState: CheckoutState = {
  currentStep: 'shipping',
  completedSteps: [],
  couponDiscount: 0,
  appliedCouponCode: '',
  agreedToTerms: false,
  submitError: null,
  isRedirecting: false,
  redirectMode: null
};

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  ...initialState,

  setCurrentStep: (step) => set({ currentStep: step }),
  markStepCompleted: (step) =>
    set((state) =>
      state.completedSteps.includes(step)
        ? state
        : { completedSteps: [...state.completedSteps, step] }
    ),

  setCouponDiscount: (value) => set({ couponDiscount: value }),
  setAppliedCouponCode: (value) => set({ appliedCouponCode: value }),
  resetCoupon: () => set({ couponDiscount: 0, appliedCouponCode: '' }),

  setAgreedToTerms: (value) => set({ agreedToTerms: value }),
  setSubmitError: (value) => set({ submitError: value }),
  setIsRedirecting: (value) => set({ isRedirecting: value }),
  setRedirectMode: (mode) => set({ redirectMode: mode }),

  reset: () => set({ ...initialState })
}));
