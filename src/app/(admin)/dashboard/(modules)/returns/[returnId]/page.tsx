import { ReturnDetailDomain } from '@/domains/returns-admin/containers/return-detail';

interface ReturnDetailPageProps {
  params: Promise<{ returnId: string }>;
}

export default async function ReturnDetailPage(props: ReturnDetailPageProps) {
  const { returnId } = await props.params;
  return <ReturnDetailDomain returnId={returnId} />;
}
