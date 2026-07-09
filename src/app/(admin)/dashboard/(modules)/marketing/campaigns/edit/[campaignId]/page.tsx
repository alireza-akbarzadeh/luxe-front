import { EmailCampaignForm } from '@/domains/newsletters-admin/sections/email-campaign-form';

interface EditEmailCampaignPageProps {
  params: Promise<{ campaignId: string }>;
}

export default async function EditEmailCampaignPage(props: EditEmailCampaignPageProps) {
  const { campaignId } = await props.params;
  return <EmailCampaignForm isEdit campaignId={campaignId} />;
}
