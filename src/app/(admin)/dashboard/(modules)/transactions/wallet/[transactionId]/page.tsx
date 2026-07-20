import { WalletDetailDomain } from '@/domains/transactions-admin/containers/wallet-detail';

interface WalletDetailPageProps {
  params: Promise<{ transactionId: string }>;
}

export default async function WalletDetailPage({ params }: WalletDetailPageProps) {
  const { transactionId } = await params;
  return <WalletDetailDomain transactionId={transactionId} />;
}
