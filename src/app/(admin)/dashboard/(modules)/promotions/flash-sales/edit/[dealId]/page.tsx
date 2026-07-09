import { FlashDealForm } from '@/domains/promotions-admin/sections/flash-deal-form';

interface EditFlashSalePageProps {
  params: Promise<{ dealId: string }>;
}

export default async function EditFlashSalePage(props: EditFlashSalePageProps) {
  const { dealId } = await props.params;

  return <FlashDealForm isEdit dealId={dealId} />;
}
