/** Primary CTA for sellers — panel if they already have a store, otherwise onboarding. */
export function getVendorStartHref(hasStore: boolean): string {
  return hasStore ? '/vendor/panel' : '/vendor/apply';
}

export const VENDOR_APPLY_PATH = '/vendor/apply';
export const VENDOR_ONBOARDING_PATH = '/vendor/onboarding';
export const VENDOR_APPLY_SUCCESS_PATH = '/vendor/apply/success';

export function getVendorApplySuccessHref(storeName: string): string {
  return `${VENDOR_APPLY_SUCCESS_PATH}?store=${encodeURIComponent(storeName)}`;
}
