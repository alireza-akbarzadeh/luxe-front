import { CustomerDetailDomain } from '@/domains/customers-admin/containers/customer-detail';

interface CustomerDetailPageProps {
  params: Promise<{ userId: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { userId } = await params;
  return <CustomerDetailDomain userId={userId} />;
}
