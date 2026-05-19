// app/checkout/hooks/useCartTotal.ts (or rename to useCheckoutTotals)
import { useCart } from '~/src/hooks/useCartController';
import { useCheckoutStore } from '../store/checkout.store';

export function useCheckoutTotals() {
  const { items } = useCart();
  const { selectedShippingPrice, couponDiscount } = useCheckoutStore();

  const subtotal = items.reduce(
    (sum, item) => sum + (item.price ?? 0) * (item.quantity ?? 0),
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + selectedShippingPrice + tax - couponDiscount;

  return { subtotal, tax, total, shippingPrice: selectedShippingPrice, couponDiscount };
}
