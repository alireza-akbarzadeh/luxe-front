import { OrderDetailsDomain } from '@/domains/orders/containers/order-details';

interface OrderDetailsPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderDetailsPage(props: OrderDetailsPageProps) {
  const { params } = props;
  const { orderId } = await params;

  return <OrderDetailsDomain orderId={orderId} />;
}
