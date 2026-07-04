import type { ReactNode } from 'react';

import type { ModelsAddress } from '@/services/-addresses-get.schemas';
import type { ModelsCoupon } from '@/services/-coupons-validate-post.schemas';

import type { CheckoutAddressEditFormApi } from '../hooks/use-checkout-address-edit';
import type { CheckoutFormValues } from '../schemas/checkout.schema';
import type { CheckoutAddressEditValues } from '../schemas/checkout-address-edit.schema';

export type { CheckoutFormValues };

export const CHECKOUT_STEP_IDS = ['shipping', 'review'] as const;
export type CheckoutStepId = (typeof CHECKOUT_STEP_IDS)[number];

export type { CheckoutAddressEditValues };

export interface CheckoutAddressEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: ModelsAddress | null;
}

export type CheckoutAddressFields = Pick<
  CheckoutFormValues,
  | 'firstName'
  | 'lastName'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'zip'
  | 'country'
  | 'phone'
  | 'shippingAddressId'
>;

/** Minimal checkout form surface for address field updates. */
export interface CheckoutAddressFormApi {
  setFieldValue(field: keyof CheckoutAddressFields, value: unknown): void;
}

export interface CheckoutAddressEditFormProps {
  form: CheckoutAddressEditFormApi;
  isPending: boolean;
  onPickOnMap: () => void;
  onCancel: () => void;
}

export interface AvailableCouponsProps {
  applicableCoupons: ModelsCoupon[];
  selectedCouponCode: string;
  isApplyingCoupon: boolean;
  onSelectCoupon: (code: string) => void;
  variant?: 'default' | 'compact';
}

export interface CheckoutReviewSectionProps {
  title: string;
  icon: ReactNode;
  onEdit?: () => void;
  children: ReactNode;
}

export interface CheckoutMobileActionBarProps {
  total: number;
  itemCount: number;
  isPending: boolean;
  isFirst: boolean;
  isLast: boolean;
  agreedToTerms: boolean;
  onBack: () => void;
  onNext: () => void;
  onPlaceOrder: () => void;
}
