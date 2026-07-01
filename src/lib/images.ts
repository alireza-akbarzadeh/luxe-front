/** Local fallback when a product or remote image fails to load. */
export const IMAGE_FALLBACK = '/placeholder.svg';

const PRE_OPTIMIZED_HOSTS = new Set(['images.unsplash.com', 'picsum.photos']);

/**
 * CDN-hosted demo images already include width/quality params.
 * Skipping the Next.js optimizer avoids double-proxy latency and server-side upstream timeouts.
 */
export function shouldBypassImageOptimizer(src: string): boolean {
  if (!src || src.startsWith('/')) return false;

  try {
    const { hostname } = new URL(src);
    return PRE_OPTIMIZED_HOSTS.has(hostname);
  } catch {
    return false;
  }
}

/** Normalize API/mock image strings; empty values use the local placeholder. */
export function resolveImageSrc(src?: string | null): string {
  if (typeof src === 'string' && src.trim().length > 0) {
    return src.trim();
  }

  return IMAGE_FALLBACK;
}
