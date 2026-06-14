import type { DtoCartItemDetail } from '~/src/services/-cart-get.schemas';

export const FREE_SHIPPING_THRESHOLD = 100;
export const FLAT_SHIPPING_RATE = 12;
export const LOW_STOCK_THRESHOLD = 5;

export function getCartItemImage(item: DtoCartItemDetail): string {
  if (typeof item.image === 'string' && item.image.length > 0) return item.image;
  if (Array.isArray(item.image) && item.image[0]) return String(item.image[0]);
  return '/placeholder.png';
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

export function getStockStatus(stock?: number) {
  const quantity = stock ?? 0;
  if (quantity <= 0) return 'out' as const;
  if (quantity <= LOW_STOCK_THRESHOLD) return 'low' as const;
  return 'in' as const;
}

export function calculateShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
}

export function getFreeShippingRemaining(subtotal: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
}

export function calculateCartTotals(items: DtoCartItemDetail[], subtotal: number) {
  const totalDiscount = items.reduce((sum, item) => sum + (item.discount ?? 0), 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal - totalDiscount + shipping;

  return { totalDiscount, shipping, total };
}
