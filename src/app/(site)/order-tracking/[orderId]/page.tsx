import { OrderTrackingDomain } from "~/src/domains/order-tracking/order-tracking.domain";

interface ProductPagePageProps {
  params: Promise<{ orderId: string }>;
}


export default async function OrderConfirmationPage(props: ProductPagePageProps) {
  const { params } = props;
  const { orderId } = await params;

  return <OrderTrackingDomain orderId={orderId} />;
}
