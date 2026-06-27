import { OrderStatus } from '@/lib/constants/enum-statuses';

type OrderPaymentFields = {
  payment_status?: string;
  payment?: { status?: string };
  status?: string;
};

/** User order API exposes nested `payment.status`, not top-level `payment_status`. */
export function resolveOrderPaymentStatus(order: OrderPaymentFields): string | undefined {
  return order.payment_status ?? order.payment?.status;
}

export function isOrderPaymentComplete(order: OrderPaymentFields): boolean {
  const paymentStatus = resolveOrderPaymentStatus(order)?.toLowerCase();
  if (paymentStatus === 'succeeded' || paymentStatus === 'completed') {
    return true;
  }
  return order.status?.toLowerCase() === OrderStatus.Paid;
}
