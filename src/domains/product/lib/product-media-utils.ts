import type { DtoProductWithLike } from '@/services/-products-get.schemas';

/** Fallback showcase when no product video is configured in attributes/tags. */
const DEFAULT_VIDEO_EMBED = 'https://www.youtube.com/embed/1La4QzGe55Q';

function extractYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1) || null;
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v') ?? parsed.pathname.split('/').pop() ?? null;
    }
  } catch {
    if (/^[\w-]{11}$/.test(url)) return url;
  }
  return null;
}

function toEmbedUrl(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (trimmed.includes('youtube.com/embed/') || trimmed.includes('player.vimeo.com')) {
    return trimmed;
  }

  const youtubeId = extractYouTubeId(trimmed);
  if (youtubeId) {
    return `https://www.youtube.com/embed/${youtubeId}`;
  }

  if (trimmed.startsWith('http')) return trimmed;
  return null;
}

/**
 * Resolves a product video embed URL from attributes, tags, or a curated fallback.
 */
export function resolveProductVideoUrl(product: DtoProductWithLike): string {
  const attributeVideo = product.attributes?.find((attribute) => {
    const name = attribute.name?.toLowerCase() ?? '';
    return name === 'video' || name === 'video_url' || name === 'product_video';
  });

  for (const value of attributeVideo?.values ?? []) {
    const embed = toEmbedUrl(value);
    if (embed) return embed;
  }

  for (const tag of product.tags ?? []) {
    const embed = toEmbedUrl(tag);
    if (embed) return embed;
  }

  return DEFAULT_VIDEO_EMBED;
}

export function hasCustomProductVideo(product: DtoProductWithLike): boolean {
  const attributeVideo = product.attributes?.some((attribute) => {
    const name = attribute.name?.toLowerCase() ?? '';
    return name === 'video' || name === 'video_url' || name === 'product_video';
  });

  const tagVideo = product.tags?.some((tag) => /youtube|youtu\.be|vimeo|embed/i.test(tag));

  return Boolean(attributeVideo || tagVideo);
}
