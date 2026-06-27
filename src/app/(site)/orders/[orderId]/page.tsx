import { redirect } from 'next/navigation';

interface OrderLegacyRedirectPageProps {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Legacy Stripe success URL (`/orders/:id`) — forwards to order-confirmed with the same query.
 */
export default async function OrderLegacyRedirectPage(props: OrderLegacyRedirectPageProps) {
  const { orderId } = await props.params;
  const searchParams = await props.searchParams;

  const query = new URLSearchParams();
  const payment = searchParams['payment'];
  const sessionId = searchParams['session_id'];

  if (typeof payment === 'string') query.set('payment', payment);
  if (typeof sessionId === 'string') query.set('session_id', sessionId);

  const qs = query.toString();
  redirect(qs ? `/order-confirmed/${orderId}?${qs}` : `/order-confirmed/${orderId}`);
}
