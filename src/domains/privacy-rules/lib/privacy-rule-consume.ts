/**
 * Helpers for consuming privacy rules across storefront / admin / partner apps.
 * Fetch active rules via public Orval hooks, then parse `content_markdown` with your
 * preferred Markdown renderer (e.g. react-markdown, marked).
 */

import type { DtoPrivacyRuleResponse } from '@/services/-privacy-rules-get.schemas';

/** Stable app lookup: prefer key + locale, fall back to provider-scoped lists. */
export function findPrivacyRuleByKey(
  rules: DtoPrivacyRuleResponse[],
  key: string
): DtoPrivacyRuleResponse | undefined {
  return rules.find((rule) => rule.key === key);
}

/** Returns true when a rule should be shown to end users (active + has content). */
export function isPrivacyRuleRenderable(rule: DtoPrivacyRuleResponse | undefined): boolean {
  return Boolean(rule?.status === 'active' && rule.content_markdown?.trim());
}
