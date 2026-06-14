import type { DtoSettingResponse } from '@/services/-settings-get.schemas';

/** Settings keys managed in Admin → Systems and read by the storefront cart/checkout. */
export const CART_COMMERCE_SETTING_KEYS = {
  freeShippingThreshold: 'cart.free_shipping_threshold',
  defaultShippingRate: 'cart.default_shipping_rate',
  estimatedTaxRate: 'cart.estimated_tax_rate'
} as const;

export interface CartCommerceSettings {
  freeShippingThreshold: number;
  defaultShippingRate: number;
  estimatedTaxRate: number;
  estimatedTaxEnabled: boolean;
}

export const DEFAULT_CART_COMMERCE_SETTINGS: CartCommerceSettings = {
  freeShippingThreshold: 100,
  defaultShippingRate: 12,
  estimatedTaxRate: 0.08,
  estimatedTaxEnabled: true
};

function parseSettingAmount(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (value && typeof value === 'object' && 'amount' in value) {
    const parsed = Number((value as { amount?: unknown }).amount);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function parseSettingTax(
  value: unknown
): Pick<CartCommerceSettings, 'estimatedTaxRate' | 'estimatedTaxEnabled'> {
  if (!value || typeof value !== 'object') {
    return {
      estimatedTaxRate: DEFAULT_CART_COMMERCE_SETTINGS.estimatedTaxRate,
      estimatedTaxEnabled: DEFAULT_CART_COMMERCE_SETTINGS.estimatedTaxEnabled
    };
  }

  const record = value as { rate?: unknown; enabled?: unknown };
  const rawRate = Number(record.rate);
  const estimatedTaxRate = Number.isFinite(rawRate)
    ? rawRate
    : DEFAULT_CART_COMMERCE_SETTINGS.estimatedTaxRate;

  return {
    estimatedTaxRate,
    estimatedTaxEnabled:
      typeof record.enabled === 'boolean'
        ? record.enabled
        : DEFAULT_CART_COMMERCE_SETTINGS.estimatedTaxEnabled
  };
}

function findSettingValue(
  settings: DtoSettingResponse[],
  key: string
): Record<string, unknown> | undefined {
  return settings.find((setting) => setting.key === key)?.value;
}

/** Maps `/settings` API rows into cart commerce estimate config with safe fallbacks. */
export function resolveCartCommerceSettings(
  settings: DtoSettingResponse[] | undefined
): CartCommerceSettings {
  const rows = settings ?? [];
  const tax = parseSettingTax(findSettingValue(rows, CART_COMMERCE_SETTING_KEYS.estimatedTaxRate));

  return {
    freeShippingThreshold: parseSettingAmount(
      findSettingValue(rows, CART_COMMERCE_SETTING_KEYS.freeShippingThreshold),
      DEFAULT_CART_COMMERCE_SETTINGS.freeShippingThreshold
    ),
    defaultShippingRate: parseSettingAmount(
      findSettingValue(rows, CART_COMMERCE_SETTING_KEYS.defaultShippingRate),
      DEFAULT_CART_COMMERCE_SETTINGS.defaultShippingRate
    ),
    ...tax
  };
}

/** Human-readable tax label for summary rows, e.g. "8%" or "7.5%". */
export function formatEstimatedTaxLabel(rate: number): string {
  const percent = rate * 100;
  return Number.isInteger(percent) ? `${percent}%` : `${percent.toFixed(1)}%`;
}
