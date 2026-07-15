import type {
  DtoBlogHomepageData,
  DtoBlogPostListItem
} from '@/services/-blog-homepage-get.schemas';

const VIDEO_SECTION_TYPES = new Set(['tutorial', 'how_to', 'listicle']);

/** Prefer homepage tutorials; fall back to tutorial-like posts, then trending. */
export function resolveLatestVideos(data: DtoBlogHomepageData): DtoBlogPostListItem[] {
  if (data.tutorials && data.tutorials.length > 0) return data.tutorials;

  const pool = [...(data.trending ?? []), ...(data.latest ?? []), ...(data.editor_picks ?? [])];
  const seen = new Set<string>();
  const videos: DtoBlogPostListItem[] = [];

  for (const post of pool) {
    const key = post.slug ?? String(post.id ?? '');
    if (!key || seen.has(key)) continue;
    if (post.section_type && VIDEO_SECTION_TYPES.has(post.section_type)) {
      seen.add(key);
      videos.push(post);
    }
  }

  if (videos.length > 0) return videos;
  return (data.trending ?? data.latest ?? []).slice(0, 5);
}
