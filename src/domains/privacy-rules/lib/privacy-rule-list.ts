import type {
  DtoPrivacyRuleListResponse,
  DtoPrivacyRuleResponse
} from '@/services/-admin-privacy-rules-get.schemas';

/** Normalizes admin privacy rule list payloads into rows. */
export function getPrivacyRulesFromListResponse(
  data: DtoPrivacyRuleListResponse | undefined
): DtoPrivacyRuleResponse[] {
  return data?.data?.rules ?? [];
}

/** Returns server total when available. */
export function getPrivacyRulesTotalFromListResponse(
  data: DtoPrivacyRuleListResponse | undefined
): number | undefined {
  return data?.data?.total;
}
