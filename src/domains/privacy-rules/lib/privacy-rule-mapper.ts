import type { PrivacyRuleFormValues } from '@/domains/privacy-rules/schemas/privacy-rule-schema';
import type { DtoUpdatePrivacyRuleRequest } from '@/services/-admin-privacy-rules-{id}-put.schemas';
import type { DtoPrivacyRuleResponse } from '@/services/-admin-privacy-rules-get.schemas';
import type { DtoCreatePrivacyRuleRequest } from '@/services/-admin-privacy-rules-post.schemas';

function optionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/** Maps admin form values to the JSON create payload. */
export function mapFormToCreatePrivacyRuleRequest(
  values: PrivacyRuleFormValues
): DtoCreatePrivacyRuleRequest {
  return {
    name: values.name.trim(),
    key: values.key.trim(),
    provider: values.provider,
    content_markdown: values.content_markdown,
    summary: optionalText(values.summary),
    locale: values.locale.trim() || 'en',
    status: values.status
  };
}

/** Maps admin form values to the JSON update payload. */
export function mapFormToUpdatePrivacyRuleRequest(
  values: PrivacyRuleFormValues
): DtoUpdatePrivacyRuleRequest {
  return {
    name: values.name.trim(),
    key: values.key.trim(),
    provider: values.provider,
    content_markdown: values.content_markdown,
    summary: optionalText(values.summary),
    locale: values.locale.trim() || 'en',
    status: values.status,
    bump_version: values.bump_version ?? false
  };
}

/** Maps an API privacy rule into admin form values for edit mode. */
export function mapPrivacyRuleToFormValues(rule: DtoPrivacyRuleResponse): PrivacyRuleFormValues {
  const status = rule.status;
  const validStatus =
    status === 'draft' || status === 'active' || status === 'inactive' || status === 'archived'
      ? status
      : 'draft';

  const provider = rule.provider;
  const validProvider =
    provider === 'platform' ||
    provider === 'stripe' ||
    provider === 'paypal' ||
    provider === 'wallet' ||
    provider === 'gift_card' ||
    provider === 'shipping' ||
    provider === 'ai' ||
    provider === 'all'
      ? provider
      : 'platform';

  return {
    name: rule.name ?? '',
    key: rule.key ?? '',
    provider: validProvider,
    content_markdown: rule.content_markdown ?? '',
    summary: rule.summary ?? '',
    locale: rule.locale ?? 'en',
    status: validStatus,
    bump_version: false
  };
}
