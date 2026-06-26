/** Primary CTA for sellers — panel if they already have a store, otherwise onboarding. */
export function getVendorStartHref(hasStore: boolean): string {
  return hasStore ? '/vendor/panel' : '/vendor/apply';
}
