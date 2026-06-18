import { ShipmentDetailDomain } from '@/domains/shipments-admin/containers/shipment-detail';

interface ShipmentDetailPageProps {
  params: Promise<{ shipmentId: string }>;
}

export default async function ShipmentDetailPage(props: ShipmentDetailPageProps) {
  const { shipmentId } = await props.params;
  return <ShipmentDetailDomain shipmentId={shipmentId} />;
}
