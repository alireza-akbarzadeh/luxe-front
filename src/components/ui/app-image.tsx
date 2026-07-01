'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';

import { IMAGE_FALLBACK, resolveImageSrc, shouldBypassImageOptimizer } from '@/lib/images';

type AppImageProps = ImageProps & {
  fallbackSrc?: string;
};

function toRenderableSrc(src: ImageProps['src']): ImageProps['src'] {
  return typeof src === 'string' ? resolveImageSrc(src) : src;
}

function AppImageInner({
  src,
  unoptimized,
  fallbackSrc = IMAGE_FALLBACK,
  onError,
  ...props
}: AppImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const resolvedSrc = toRenderableSrc(src);
  const srcKey = typeof resolvedSrc === 'string' ? resolvedSrc : 'static';
  const currentSrc = failedSrc === srcKey ? fallbackSrc : resolvedSrc;

  const bypassOptimizer =
    unoptimized ??
    (typeof currentSrc === 'string' ? shouldBypassImageOptimizer(currentSrc) : false);

  return (
    <Image
      {...props}
      src={currentSrc}
      unoptimized={bypassOptimizer}
      onError={(event) => {
        if (failedSrc !== srcKey) {
          setFailedSrc(srcKey);
        }
        onError?.(event);
      }}
    />
  );
}

/**
 * Next/Image wrapper for catalog and marketing photos.
 * - Skips optimizer for pre-sized CDN URLs (e.g. Unsplash) to reduce dev/prod latency.
 * - Falls back to a local placeholder when the upstream image is missing or times out.
 */
export function AppImage({ src, ...props }: AppImageProps) {
  const resetKey = typeof src === 'string' ? src : 'static';

  return <AppImageInner key={resetKey} src={src} {...props} />;
}
