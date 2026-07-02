'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import type { DtoCartItemDetail } from '@/services/-cart-get.schemas';

import {
  buildVariantCheckoutMessage,
  cartHasIncompleteVariants,
  getItemsNeedingVariantSelection,
  scrollToCartItem
} from '../lib/cart-utils';

/**
 * Validates variant selections before navigating to checkout.
 * Shows a toast and scrolls to the first incomplete item when blocked.
 */
export function useCartCheckoutAction(
  items: DtoCartItemDetail[],
  options?: { redirectToCartOnBlock?: boolean }
) {
  const router = useRouter();
  const hasIncompleteVariants = cartHasIncompleteVariants(items);
  const incompleteItems = getItemsNeedingVariantSelection(items);

  const proceedToCheckout = (onSuccess?: () => void) => {
    if (items.length === 0) {
      toast.error('Your cart is empty.');
      return false;
    }

    if (hasIncompleteVariants) {
      toast.error(buildVariantCheckoutMessage(items), {
        action: options?.redirectToCartOnBlock
          ? {
              label: 'Open cart',
              onClick: () => router.push('/cart')
            }
          : undefined
      });

      if (options?.redirectToCartOnBlock) {
        onSuccess?.();
        router.push('/cart');
        return false;
      }

      const firstIncomplete = incompleteItems[0];
      if (firstIncomplete?.id != null) {
        scrollToCartItem(firstIncomplete.id);
      }
      return false;
    }

    onSuccess?.();
    router.push('/checkout');
    return true;
  };

  return {
    hasIncompleteVariants,
    incompleteItems,
    proceedToCheckout
  };
}
