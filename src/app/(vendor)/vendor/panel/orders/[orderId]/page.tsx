import { VendorOrderDetailDomain } from '@/domains/vendor/panel/vendor-order-detail.domain';

interface VendorOrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default async function VendorOrderDetailPage({ params }: VendorOrderDetailPageProps) {
  const { orderId } = await params;
  const id = Number.parseInt(orderId, 10);

  return <VendorOrderDetailDomain orderId={Number.isFinite(id) ? id : 0} />;
}
