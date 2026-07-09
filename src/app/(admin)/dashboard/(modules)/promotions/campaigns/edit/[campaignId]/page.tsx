import { CampaignForm } from '@/domains/promotions-admin/sections/campaign-form';

interface EditCampaignPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function EditCampaignPage(props: EditCampaignPageProps) {
  const { campaignId } = await props.params;

  return <CampaignForm isEdit campaignId={campaignId} />;
}
