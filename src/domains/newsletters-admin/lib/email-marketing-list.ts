import type { DtoEmailCampaignListResponse } from '@/services/-admin-email-campaigns-get.schemas';
import type { DtoEmailTemplateListResponse } from '@/services/-admin-email-templates-get.schemas';
import type { DtoSubscriberListResponse } from '@/services/-admin-newsletter-subscribers-get.schemas';

export function getSubscribersFromList(data: DtoSubscriberListResponse | undefined) {
  return data?.data?.subscribers ?? [];
}

export function getSubscribersTotal(data: DtoSubscriberListResponse | undefined) {
  return data?.data?.total ?? 0;
}

export function getTemplatesFromList(data: DtoEmailTemplateListResponse | undefined) {
  return data?.data?.templates ?? [];
}

export function getTemplatesTotal(data: DtoEmailTemplateListResponse | undefined) {
  return data?.data?.total ?? 0;
}

export function getEmailCampaignsFromList(data: DtoEmailCampaignListResponse | undefined) {
  return data?.data?.campaigns ?? [];
}

export function getEmailCampaignsTotal(data: DtoEmailCampaignListResponse | undefined) {
  return data?.data?.total ?? 0;
}
