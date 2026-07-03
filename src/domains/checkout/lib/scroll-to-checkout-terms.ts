'use client';

/** Scrolls to the terms consent block (mobile sticky bar or desktop review section). */
export function scrollToCheckoutTerms() {
  const target =
    document.querySelector('[data-checkout-terms]') ??
    document.getElementById('checkout-agree-terms-mobile') ??
    document.getElementById('checkout-agree-terms');

  target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  const checkbox = target?.querySelector<HTMLButtonElement>('button[role="checkbox"]');
  checkbox?.focus();
}
