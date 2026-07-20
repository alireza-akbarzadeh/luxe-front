import { PaymentDetailDomain } from '@/domains/transactions-admin/containers/payment-detail';

interface PaymentDetailPageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function PaymentDetailPage({ params }: PaymentDetailPageProps) {
  const { paymentId } = await params;
  return <PaymentDetailDomain paymentId={paymentId} />;
}
