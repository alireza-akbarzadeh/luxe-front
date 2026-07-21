import { HERO_EDITORIAL_SPOTLIGHT_IMAGE } from '@/domains/home/lib/home-mock-data';
import type { DtoHomeSectionItem } from '@/services/-home-hero-slides-get.schemas';

export type HeroSlide = {
  key: string;
  title: string;
  href: string;
  imageUrl: string;
  eyebrow?: string;
  subtitle?: string;
};

function filterString(
  filters: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = filters?.[key];
  return typeof value === 'string' && value.trim() ? value : undefined;
}

/** Maps an admin homepage section row to a hero carousel slide. */
export function mapHeroSlide(section: DtoHomeSectionItem): HeroSlide | null {
  const imageUrl = section.image_url?.trim();
  if (!imageUrl) return null;

  const filters = section.filters as Record<string, unknown> | undefined;

  return {
    key: section.key ?? section.title ?? imageUrl,
    title: section.title ?? '',
    href: section.href ?? '/shop',
    imageUrl,
    eyebrow: filterString(filters, 'eyebrow'),
    subtitle: filterString(filters, 'subtitle') ?? filterString(filters, 'description')
  };
}

/** Fallback slide when admin has not published hero-* banners yet. */
export function buildFallbackHeroSlide(copy: {
  eyebrow: string;
  title: string;
  href?: string;
}): HeroSlide {
  return {
    key: 'fallback',
    eyebrow: copy.eyebrow,
    title: copy.title,
    href: copy.href ?? '/shop',
    imageUrl: HERO_EDITORIAL_SPOTLIGHT_IMAGE
  };
}
