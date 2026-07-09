import type { EmailCampaignFormValues } from '@/domains/newsletters-admin/schemas/newsletters.schema';
import type { ModelsEmailCampaign } from '@/services/-admin-email-campaigns-get.schemas';
import type { DtoCreateEmailCampaignRequest } from '@/services/-admin-email-campaigns-post.schemas';

function toIsoOrUndefined(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? new Date(trimmed).toISOString() : undefined;
}

export function mapEmailCampaignToFormValues(
  campaign: ModelsEmailCampaign
): EmailCampaignFormValues {
  return {
    name: campaign.name ?? '',
    subject: campaign.subject ?? '',
    body_html: campaign.body_html ?? '',
    template_id: campaign.template_id ?? null,
    segment: (campaign.segment as EmailCampaignFormValues['segment']) ?? 'all',
    status: campaign.status === 'scheduled' ? 'scheduled' : 'draft',
    scheduled_at: campaign.scheduled_at ? campaign.scheduled_at.slice(0, 16) : ''
  };
}

export function mapEmailCampaignFormToPayload(
  values: EmailCampaignFormValues
): DtoCreateEmailCampaignRequest {
  return {
    name: values.name,
    subject: values.subject,
    body_html: values.body_html || undefined,
    template_id: values.template_id ?? undefined,
    segment: values.segment,
    status: values.status,
    scheduled_at: values.status === 'scheduled' ? toIsoOrUndefined(values.scheduled_at) : undefined
  };
}
