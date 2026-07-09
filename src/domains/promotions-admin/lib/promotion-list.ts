import type { DtoCampaignListResponse } from '@/services/-admin-campaigns-get.schemas';
import type { DtoFlashDealListResponse } from '@/services/-admin-flash-deals-get.schemas';
import type { DtoHomepageSectionListResponse } from '@/services/-admin-homepage-sections-get.schemas';

export function getFlashDealsFromList(data: DtoFlashDealListResponse | undefined) {
  return data?.data?.deals ?? [];
}

export function getFlashDealsTotal(data: DtoFlashDealListResponse | undefined) {
  return data?.data?.total ?? 0;
}

export function getBannersFromList(data: DtoHomepageSectionListResponse | undefined) {
  return data?.data?.sections ?? [];
}

export function getBannersTotal(data: DtoHomepageSectionListResponse | undefined) {
  return data?.data?.total ?? 0;
}

export function getCampaignsFromList(data: DtoCampaignListResponse | undefined) {
  return data?.data?.campaigns ?? [];
}

export function getCampaignsTotal(data: DtoCampaignListResponse | undefined) {
  return data?.data?.total ?? 0;
}
