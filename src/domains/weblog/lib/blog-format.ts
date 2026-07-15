import type { DtoBlogPostListItem } from '@/services/-blog-homepage-get.schemas';

/** Public path for an article. */
export function blogPostPath(slug: string | undefined): string {
  return `/weblog/${slug ?? ''}`;
}

/** Public path for a category landing page. */
export function blogCategoryPath(slug: string | undefined): string {
  return `/weblog/category/${slug ?? ''}`;
}

/** Human labels for the API `section_type` values. */
const SECTION_LABELS: Record<string, string> = {
  article: 'Article',
  buying_guide: 'Buying Guide',
  product_review: 'Review',
  comparison: 'Comparison',
  tutorial: 'Tutorial',
  how_to: 'How-To',
  industry_news: 'News',
  gift_guide: 'Gift Guide',
  seasonal: 'Seasonal',
  new_technology: 'New Tech',
  listicle: 'List',
  opinion: 'Opinion',
  interview: 'Interview'
};

export function sectionLabel(sectionType: string | undefined): string {
  if (!sectionType) return 'Article';
  return SECTION_LABELS[sectionType] ?? 'Article';
}

/** Format a publication date as e.g. "Jul 15, 2026". Returns '' for missing/invalid input. */
export function formatPublishedDate(value: string | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/** Reading-time label, e.g. "6 min read". */
export function readingTimeLabel(minutes: number | undefined): string {
  const value = minutes && minutes > 0 ? minutes : 1;
  return `${value} min read`;
}

/** Compact view-count label, e.g. "1.2k views". */
export function formatViews(count: number | undefined): string {
  const value = count ?? 0;
  if (value >= 1000) return `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k views`;
  return `${value} view${value === 1 ? '' : 's'}`;
}

/**
 * Display duration for video-style cards (mm:ss).
 * Uses reading time as minutes; seconds are derived from id for stable UI.
 */
export function formatVideoDuration(readingTimeMinutes: number | undefined, id?: number): string {
  const minutes = Math.max(
    1,
    readingTimeMinutes && readingTimeMinutes > 0 ? readingTimeMinutes : 5
  );
  const seconds = Math.abs((id ?? minutes * 11) * 7) % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** True when a post has a hero image URL set. */
export function hasHero(post: DtoBlogPostListItem): boolean {
  return Boolean(post.hero_image_url && post.hero_image_url.length > 0);
}
