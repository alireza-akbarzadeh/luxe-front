import type { BannerFormValues } from '@/domains/promotions-admin/schemas/promotions.schema';
import type { ModelsHomepageSection } from '@/services/-admin-homepage-sections-get.schemas';
import type { DtoCreateHomepageSectionRequest } from '@/services/-admin-homepage-sections-post.schemas';

export function mapBannerToFormValues(section: ModelsHomepageSection): BannerFormValues {
  const status =
    section.status === 'published' || section.status === 'archived' ? section.status : 'draft';

  return {
    section_key: section.section_key ?? '',
    title: section.title ?? '',
    href: section.href ?? '/shop',
    image_url: section.image_url ?? '',
    sort_order: section.sort_order ?? 0,
    status
  };
}

export function mapBannerFormToPayload(value: BannerFormValues): DtoCreateHomepageSectionRequest {
  return {
    section_key: value.section_key.trim().toLowerCase(),
    title: value.title.trim(),
    href: value.href.trim(),
    image_url: value.image_url?.trim() || '',
    sort_order: value.sort_order,
    status: value.status
  };
}
