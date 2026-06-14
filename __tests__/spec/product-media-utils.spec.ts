import { describe, expect, it } from 'vitest';

import {
  hasCustomProductVideo,
  resolveProductVideoUrl
} from '@/domains/product/lib/product-media-utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

function createProduct(overrides: Partial<DtoProductWithLike> = {}): DtoProductWithLike {
  return {
    id: 1,
    name: 'Test Product',
    ...overrides
  };
}

describe('resolveProductVideoUrl', () => {
  it('resolves YouTube watch URLs from attributes', () => {
    const product = createProduct({
      attributes: [
        {
          name: 'video_url',
          values: ['https://www.youtube.com/watch?v=dQw4w9WgXcQ']
        }
      ]
    });

    expect(resolveProductVideoUrl(product)).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('resolves youtu.be links from tags', () => {
    const product = createProduct({
      tags: ['https://youtu.be/abc123xyz01']
    });

    expect(resolveProductVideoUrl(product)).toBe('https://www.youtube.com/embed/abc123xyz01');
  });

  it('returns default embed when no video is configured', () => {
    const product = createProduct();

    expect(resolveProductVideoUrl(product)).toBe('https://www.youtube.com/embed/1La4QzGe55Q');
  });
});

describe('hasCustomProductVideo', () => {
  it('detects video attributes', () => {
    const product = createProduct({
      attributes: [{ name: 'product_video', values: ['https://example.com/video.mp4'] }]
    });

    expect(hasCustomProductVideo(product)).toBe(true);
  });

  it('detects video-related tags', () => {
    const product = createProduct({
      tags: ['featured', 'youtube showcase']
    });

    expect(hasCustomProductVideo(product)).toBe(true);
  });

  it('returns false when no video metadata exists', () => {
    expect(hasCustomProductVideo(createProduct({ tags: ['sale', 'new'] }))).toBe(false);
  });
});
