import { OrderTrackingDomain } from "~/src/domains/order-tracking/order-tracking.domain";

interface OrderConfirmationPageProps {
  params: Promise<{ orderId: string }>;
}


export default async function OrderConfirmationPage(props: OrderConfirmationPageProps) {
  const { params } = props;
  const { orderId } = await params;

  return <OrderTrackingDomain orderId={orderId} />;
}
