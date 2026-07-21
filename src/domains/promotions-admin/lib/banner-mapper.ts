import type { BannerFormValues } from '@/domains/promotions-admin/schemas/promotions.schema';
import type { ModelsHomepageSection } from '@/services/-admin-homepage-sections-get.schemas';
import type { DtoCreateHomepageSectionRequest } from '@/services/-admin-homepage-sections-post.schemas';

function readFilterString(filters: Record<string, unknown> | undefined, key: string): string {
  const value = filters?.[key];
  return typeof value === 'string' ? value : '';
}

function readFilterFlashDealIds(filters: Record<string, unknown> | undefined): string {
  const value = filters?.['flash_deal_ids'];
  if (!Array.isArray(value)) return '';
  return value
    .map((item) => (typeof item === 'number' ? item : Number(item)))
    .filter((id) => Number.isFinite(id) && id > 0)
    .join(', ');
}

function readFilterTheme(filters: Record<string, unknown> | undefined): 'dark' | 'light' {
  const value = filters?.['theme'];
  return value === 'light' ? 'light' : 'dark';
}

function parseFlashDealIds(raw: string | undefined): number[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/[,\s]+/)
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((id) => Number.isFinite(id) && id > 0);
}

function buildBannerFilters(value: BannerFormValues): Record<string, unknown> | undefined {
  const filters: Record<string, unknown> = {};
  if (value.eyebrow?.trim()) filters['eyebrow'] = value.eyebrow.trim();
  if (value.description?.trim()) filters['description'] = value.description.trim();
  if (value.badge?.trim()) filters['badge'] = value.badge.trim();
  if (value.cta_label?.trim()) filters['cta_label'] = value.cta_label.trim();
  if (value.ends_at?.trim()) filters['ends_at'] = value.ends_at.trim();
  if (value.theme) filters['theme'] = value.theme;
  const dealIds = parseFlashDealIds(value.flash_deal_ids);
  if (dealIds.length > 0) filters['flash_deal_ids'] = dealIds;
  return Object.keys(filters).length > 0 ? filters : undefined;
}

export function mapBannerToFormValues(section: ModelsHomepageSection): BannerFormValues {
  const status =
    section.status === 'published' || section.status === 'archived' ? section.status : 'draft';
  const filters = section.filters as Record<string, unknown> | undefined;

  return {
    section_key: section.section_key ?? '',
    title: section.title ?? '',
    href: section.href ?? '/shop',
    image_url: section.image_url ?? '',
    sort_order: section.sort_order ?? 0,
    status,
    eyebrow: readFilterString(filters, 'eyebrow'),
    description: readFilterString(filters, 'description'),
    badge: readFilterString(filters, 'badge'),
    cta_label: readFilterString(filters, 'cta_label'),
    ends_at: readFilterString(filters, 'ends_at'),
    theme: readFilterTheme(filters),
    flash_deal_ids: readFilterFlashDealIds(filters)
  };
}

export function mapBannerFormToPayload(value: BannerFormValues): DtoCreateHomepageSectionRequest {
  return {
    section_key: value.section_key.trim().toLowerCase(),
    title: value.title.trim(),
    href: value.href.trim(),
    image_url: value.image_url?.trim() || '',
    sort_order: value.sort_order,
    status: value.status,
    filters: buildBannerFilters(value)
  };
}
