import type { DtoCheckoutRequestPaymentMethod } from '@/services/-checkout-post.schemas';
import type { DtoPaymentProviderResponse } from '@/services/-payment-providers-get.schemas';
import type { DtoSettingResponse } from '@/services/-settings-get.schemas';

/** Settings key — Admin → Systems can override the checkout default payment method. */
export const CHECKOUT_DEFAULT_PAYMENT_SETTING_KEY = 'checkout.default_payment_method';

export type CheckoutPaymentMethodId =
  | 'stripe'
  | 'paypal'
  | 'apple_pay'
  | 'google_pay'
  | 'credit_card'
  | 'debit_card'
  | 'gift_card'
  | 'store_credit';

export interface CheckoutPaymentMethodOption {
  id: CheckoutPaymentMethodId | string;
  displayName: string;
  description?: string;
  iconUrl?: string;
  /** Brand mark for icon button when no iconUrl. */
  brand: 'stripe' | 'paypal' | 'apple' | 'google' | 'card' | 'wallet' | 'generic';
  requiresCard: boolean;
  /** Maps to checkout API `payment_method` when selected. */
  apiMethod: DtoCheckoutRequestPaymentMethod;
  /** Soft-disable until gateway is wired (still selectable for UI demos). */
  comingSoon?: boolean;
}

/**
 * Frontend catalog — extend here to surface new methods instantly.
 * API `/payment-providers` rows merge on top by `name` when present.
 */
export const CHECKOUT_PAYMENT_METHOD_CATALOG: CheckoutPaymentMethodOption[] = [
  {
    id: 'stripe',
    displayName: 'Stripe',
    description: 'Pay securely with card via Stripe Checkout',
    brand: 'stripe',
    requiresCard: false,
    apiMethod: 'stripe'
  },
  {
    id: 'paypal',
    displayName: 'PayPal',
    description: 'Pay with your PayPal account',
    brand: 'paypal',
    requiresCard: false,
    apiMethod: 'mock',
    comingSoon: true
  },
  {
    id: 'apple_pay',
    displayName: 'Apple Pay',
    description: 'Fast checkout with Apple Pay',
    brand: 'apple',
    requiresCard: false,
    apiMethod: 'mock',
    comingSoon: true
  },
  {
    id: 'google_pay',
    displayName: 'Google Pay',
    description: 'Fast checkout with Google Pay',
    brand: 'google',
    requiresCard: false,
    apiMethod: 'mock',
    comingSoon: true
  },
  {
    id: 'credit_card',
    displayName: 'Card',
    description: 'Credit or debit card',
    brand: 'card',
    requiresCard: true,
    apiMethod: 'mock'
  }
];

const DEFAULT_PAYMENT_METHOD_ID: CheckoutPaymentMethodId = 'stripe';

function catalogBrandForName(name: string): CheckoutPaymentMethodOption['brand'] {
  if (name === 'stripe') return 'stripe';
  if (name === 'paypal') return 'paypal';
  if (name === 'apple_pay') return 'apple';
  if (name === 'google_pay') return 'google';
  if (name === 'gift_card' || name === 'store_credit' || name === 'wallet') return 'wallet';
  if (name === 'credit_card' || name === 'debit_card') return 'card';
  return 'generic';
}

function apiMethodForName(name: string, requiresCard: boolean): DtoCheckoutRequestPaymentMethod {
  if (name === 'stripe') return 'stripe';
  if (name === 'gift_card' || name === 'store_credit' || name === 'wallet') return 'wallet';
  if (requiresCard) return 'mock';
  return 'mock';
}

/** Merge static catalog with live `/payment-providers` so new API methods appear instantly. */
export function resolveCheckoutPaymentMethods(
  apiProviders: DtoPaymentProviderResponse[] | undefined,
  options?: { stripeEnabled?: boolean }
): CheckoutPaymentMethodOption[] {
  const stripeEnabled = options?.stripeEnabled === true;
  const byId = new Map<string, CheckoutPaymentMethodOption>();

  for (const item of CHECKOUT_PAYMENT_METHOD_CATALOG) {
    byId.set(item.id, {
      ...item,
      // When Stripe is live, card entry is replaced by Stripe Checkout.
      requiresCard: item.id === 'credit_card' && stripeEnabled ? false : item.requiresCard,
      apiMethod:
        stripeEnabled && (item.id === 'stripe' || item.id === 'credit_card')
          ? 'stripe'
          : item.apiMethod,
      comingSoon:
        item.id === 'stripe' && !stripeEnabled
          ? true
          : item.id === 'credit_card' && stripeEnabled
            ? true
            : item.comingSoon
    });
  }

  for (const provider of apiProviders ?? []) {
    const name = provider.name?.trim();
    if (!name) continue;

    const existing = byId.get(name);
    byId.set(name, {
      id: name,
      displayName: provider.display_name?.trim() || existing?.displayName || name,
      description: provider.description?.trim() || existing?.description,
      iconUrl: provider.icon_url?.trim() || existing?.iconUrl,
      brand: existing?.brand ?? catalogBrandForName(name),
      requiresCard: provider.requires_card ?? existing?.requiresCard ?? false,
      apiMethod: existing?.apiMethod ?? apiMethodForName(name, provider.requires_card === true),
      comingSoon: existing?.comingSoon
    });
  }

  // Prefer Stripe first when enabled; otherwise keep catalog order with API extras appended.
  const ordered = [...byId.values()];
  ordered.sort((a, b) => {
    if (a.id === 'stripe' && stripeEnabled) return -1;
    if (b.id === 'stripe' && stripeEnabled) return 1;
    const aIndex = CHECKOUT_PAYMENT_METHOD_CATALOG.findIndex((item) => item.id === a.id);
    const bIndex = CHECKOUT_PAYMENT_METHOD_CATALOG.findIndex((item) => item.id === b.id);
    if (aIndex === -1 && bIndex === -1) return a.displayName.localeCompare(b.displayName);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return ordered.filter((method) => {
    if (method.id === 'credit_card' && stripeEnabled) return false;
    if (method.id === 'stripe' && !stripeEnabled) return true;
    return true;
  });
}

function parseDefaultPaymentMethod(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (value && typeof value === 'object' && 'method' in value) {
    const method = (value as { method?: unknown }).method;
    if (typeof method === 'string' && method.trim()) return method.trim();
  }
  return null;
}

/** Resolves default payment method id from `/settings`. */
export function resolveDefaultCheckoutPaymentMethod(
  settings: DtoSettingResponse[] | undefined,
  availableIds: string[],
  fallback: string = DEFAULT_PAYMENT_METHOD_ID
): string {
  const raw = settings?.find((row) => row.key === CHECKOUT_DEFAULT_PAYMENT_SETTING_KEY)?.value;
  const configured = parseDefaultPaymentMethod(raw);
  if (configured && availableIds.includes(configured)) return configured;
  if (availableIds.includes(fallback)) return fallback;
  return availableIds[0] ?? fallback;
}

/** Maps UI payment selection to checkout API enum. */
export function mapCheckoutPaymentMethodToApi(
  method: string,
  methods: CheckoutPaymentMethodOption[],
  isStripeCheckout: boolean
): DtoCheckoutRequestPaymentMethod {
  const selected = methods.find((item) => item.id === method);
  if (selected?.apiMethod) {
    if (selected.apiMethod === 'stripe' && !isStripeCheckout) return 'mock';
    return selected.apiMethod;
  }

  if (
    isStripeCheckout &&
    (method === 'stripe' || method === 'credit_card' || method === 'debit_card')
  ) {
    return 'stripe';
  }
  if (method === 'gift_card' || method === 'store_credit' || method === 'wallet') {
    return 'wallet';
  }
  return 'mock';
}

export function checkoutPaymentMethodRequiresCard(
  method: string,
  methods: CheckoutPaymentMethodOption[]
): boolean {
  return methods.find((item) => item.id === method)?.requiresCard === true;
}

export function getCheckoutPaymentMethodLabel(
  method: string,
  methods: CheckoutPaymentMethodOption[]
): string {
  return methods.find((item) => item.id === method)?.displayName ?? method;
}
