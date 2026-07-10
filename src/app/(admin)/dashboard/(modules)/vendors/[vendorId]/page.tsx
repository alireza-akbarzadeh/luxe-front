import { VendorDetailDomain } from '@/domains/vendors-admin/containers/vendor-detail';

interface VendorDetailPageProps {
  params: Promise<{ vendorId: string }>;
}

export default async function VendorDetailPage(props: VendorDetailPageProps) {
  const { vendorId } = await props.params;
  return <VendorDetailDomain vendorId={vendorId} />;
}
