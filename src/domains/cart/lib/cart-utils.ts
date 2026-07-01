import { formatCurrency } from '@/lib/format';
import { IMAGE_FALLBACK } from '@/lib/images';
import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

import type { CartCommerceSettings } from './cart-commerce-settings';
import { DEFAULT_CART_COMMERCE_SETTINGS } from './cart-commerce-settings';

export const LOW_STOCK_THRESHOLD = 5;

/** Shared typography for currency values in cart UI (avoid display serif on numbers). */
export const cartMoneyClassName = 'font-sans tabular-nums tracking-tight';

export function formatCartMoney(value?: number | null): string {
  if (value == null || Number.isNaN(value)) {
    return formatCurrency(0);
  }

  return formatCurrency(value);
}

export function getCartItemImage(item: DtoCartItemDetail): string {
  if (typeof item.image === 'string' && item.image.length > 0) return item.image;
  if (Array.isArray(item.image) && item.image[0]) return String(item.image[0]);
  return IMAGE_FALLBACK;
}

export function getCartItemName(item: DtoCartItemDetail): string {
  return item.name || item.product_name || 'Product';
}

export function itemNeedsVariantSelection(item: DtoCartItemDetail): boolean {
  const needsColor =
    (item.color?.length ?? 0) > 0 && (!item.selected_color || item.selected_color === '');
  const needsSize =
    (item.size?.length ?? 0) > 0 && (!item.selected_size || item.selected_size === '');
  return needsColor || needsSize;
}

export function cartHasIncompleteVariants(items: DtoCartItemDetail[]): boolean {
  return items.some(itemNeedsVariantSelection);
}

export function getItemsNeedingVariantSelection(items: DtoCartItemDetail[]): DtoCartItemDetail[] {
  return items.filter(itemNeedsVariantSelection);
}

/** Describes which variant fields are still required for one cart line item. */
export function describeVariantSelectionGap(item: DtoCartItemDetail): string {
  const needsColor =
    (item.color?.length ?? 0) > 0 && (!item.selected_color || item.selected_color === '');
  const needsSize =
    (item.size?.length ?? 0) > 0 && (!item.selected_size || item.selected_size === '');

  if (needsColor && needsSize) return 'color and size';
  if (needsColor) return 'color';
  if (needsSize) return 'size';
  return 'options';
}

/** Builds a user-facing checkout guard message for incomplete variant selections. */
export function buildVariantCheckoutMessage(items: DtoCartItemDetail[]): string {
  const incompleteItems = getItemsNeedingVariantSelection(items);
  if (incompleteItems.length === 0) {
    return '';
  }

  const first = incompleteItems[0];
  if (!first) return 'Please select product options before checkout.';

  const name = getCartItemName(first);
  const gap = describeVariantSelectionGap(first);

  if (incompleteItems.length === 1) {
    return `Select ${gap} for "${name}" before checkout.`;
  }

  return `${incompleteItems.length} items still need color or size selected. Start with "${name}".`;
}

export function getCartItemElementId(cartItemId: number): string {
  return `cart-item-${cartItemId}`;
}

export function scrollToCartItem(cartItemId: number): void {
  document.getElementById(getCartItemElementId(cartItemId))?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });
}

export function getStockStatus(stock?: number) {
  const quantity = stock ?? 0;
  if (quantity <= 0) return 'out' as const;
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low' as const;
  return 'in' as const;
}

export function calculateShipping(
  subtotal: number,
  settings: Pick<
    CartCommerceSettings,
    'freeShippingThreshold' | 'defaultShippingRate'
  > = DEFAULT_CART_COMMERCE_SETTINGS
): number {
  return subtotal >= settings.freeShippingThreshold ? 0 : settings.defaultShippingRate;
}

export function calculateEstimatedTax(
  subtotal: number,
  settings: Pick<
    CartCommerceSettings,
    'estimatedTaxRate' | 'estimatedTaxEnabled'
  > = DEFAULT_CART_COMMERCE_SETTINGS
): number {
  if (!settings.estimatedTaxEnabled || settings.estimatedTaxRate <= 0) {
    return 0;
  }

  return subtotal * settings.estimatedTaxRate;
}

export function getFreeShippingRemaining(
  subtotal: number,
  freeShippingThreshold: number = DEFAULT_CART_COMMERCE_SETTINGS.freeShippingThreshold
): number {
  return Math.max(0, freeShippingThreshold - subtotal);
}

/** Whether the cart subtotal qualifies for the configured free-shipping threshold. */
export function qualifiesForFreeShipping(
  subtotal: number,
  freeShippingThreshold: number = DEFAULT_CART_COMMERCE_SETTINGS.freeShippingThreshold
): boolean {
  return subtotal >= freeShippingThreshold;
}

/**
 * Applies commerce free-shipping rules to a provider rate.
 * When the threshold is met, shipping is always $0 regardless of provider list price.
 */
export function getEffectiveShippingPrice(
  providerPrice: number,
  subtotal: number,
  settings: Pick<CartCommerceSettings, 'freeShippingThreshold'> = DEFAULT_CART_COMMERCE_SETTINGS
): number {
  return qualifiesForFreeShipping(subtotal, settings.freeShippingThreshold) ? 0 : providerPrice;
}

export function calculateCartTotals(
  items: DtoCartItemDetail[],
  subtotal: number,
  settings: CartCommerceSettings = DEFAULT_CART_COMMERCE_SETTINGS
) {
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount ?? 0), 0);
  const shipping = calculateShipping(subtotal, settings);
  const tax = calculateEstimatedTax(subtotal, settings);
  const total = subtotal - totalDiscount + shipping + tax;

  return { totalDiscount, shipping, tax, total };
}
