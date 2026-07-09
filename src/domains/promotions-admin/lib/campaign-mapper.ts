import type { CampaignFormValues } from '@/domains/promotions-admin/schemas/promotions.schema';
import type { ModelsCampaign } from '@/services/-admin-campaigns-get.schemas';
import type {
  DtoCampaignPlacementsRequest,
  DtoCreateCampaignRequest
} from '@/services/-admin-campaigns-post.schemas';

function toDateFieldValue(value?: string): string {
  if (!value) return '';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '' : parsed.toISOString();
}

function parseIdList(value?: string): number[] | undefined {
  if (!value?.trim()) return undefined;
  const ids = value
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isFinite(id) && id > 0);
  return ids.length > 0 ? ids : undefined;
}

function parsePlacementsFromApi(
  raw: unknown
): Pick<CampaignFormValues, 'flash_deal_ids' | 'section_ids' | 'collection_ids'> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { flash_deal_ids: '', section_ids: '', collection_ids: '' };
  }
  const placements = raw as DtoCampaignPlacementsRequest;
  return {
    flash_deal_ids: placements.flash_deal_ids?.join(', ') ?? '',
    section_ids: placements.section_ids?.join(', ') ?? '',
    collection_ids: placements.collection_ids?.join(', ') ?? ''
  };
}

export function mapCampaignToFormValues(campaign: ModelsCampaign): CampaignFormValues {
  const placements = parsePlacementsFromApi(campaign.placements);
  const status =
    campaign.status === 'scheduled' ||
    campaign.status === 'active' ||
    campaign.status === 'ended' ||
    campaign.status === 'archived'
      ? campaign.status
      : 'draft';

  return {
    name: campaign.name ?? '',
    slug: campaign.slug ?? '',
    description: campaign.description ?? '',
    starts_at: toDateFieldValue(campaign.starts_at),
    ends_at: toDateFieldValue(campaign.ends_at),
    status,
    ...placements
  };
}

export function mapCampaignFormToPayload(value: CampaignFormValues): DtoCreateCampaignRequest {
  const placements: DtoCampaignPlacementsRequest = {
    flash_deal_ids: parseIdList(value.flash_deal_ids),
    section_ids: parseIdList(value.section_ids),
    collection_ids: parseIdList(value.collection_ids)
  };

  const hasPlacements =
    (placements.flash_deal_ids?.length ?? 0) > 0 ||
    (placements.section_ids?.length ?? 0) > 0 ||
    (placements.collection_ids?.length ?? 0) > 0;

  return {
    name: value.name.trim(),
    slug: value.slug?.trim() || undefined,
    description: value.description?.trim() || undefined,
    starts_at: value.starts_at || undefined,
    ends_at: value.ends_at || undefined,
    status: value.status,
    placements: hasPlacements ? placements : undefined
  };
}
