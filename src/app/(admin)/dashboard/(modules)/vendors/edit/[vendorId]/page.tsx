import { VendorStoreForm } from '@/domains/vendors-admin/sections/vendor-store-form';

interface EditVendorPageProps {
  params: Promise<{ vendorId: string }>;
}

export default async function EditVendorPage({ params }: EditVendorPageProps) {
  const { vendorId } = await params;
  return <VendorStoreForm isEdit vendorId={vendorId} />;
}
