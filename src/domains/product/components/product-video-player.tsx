'use client';

import { IconPlayerPlay } from '@tabler/icons-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { DtoProductWithLike } from '@/services/-products-get.schemas';

import { hasCustomProductVideo, resolveProductVideoUrl } from '../lib/product-media-utils';

interface ProductVideoPlayerProps {
  product: DtoProductWithLike;
  className?: string;
}

export function ProductVideoPlayer({ product, className }: ProductVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedUrl = resolveProductVideoUrl(product);
  const isCustom = hasCustomProductVideo(product);

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className='bg-foreground/95 relative aspect-[4/5] max-h-[min(78vh,720px)] overflow-hidden rounded-none lg:aspect-[4/3] lg:max-h-[min(480px,50vh)] lg:rounded-2xl'>
        {!isPlaying ? (
          <button
            type='button'
            onClick={() => setIsPlaying(true)}
            className='group relative flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center'
            aria-label={`Play video about ${product.name}`}
          >
            <div className='from-accent/20 via-accent/5 absolute inset-0 bg-linear-to-br to-transparent' />
            {product.images?.[0] && (
              <Image
                src={product.images[0]}
                alt=''
                aria-hidden
                fill
                sizes='(max-width: 1024px) 100vw, 50vw'
                className='object-cover opacity-30 blur-[1px]'
              />
            )}
            <div className='bg-accent text-accent-foreground relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-105'>
              <IconPlayerPlay className='ml-1 h-7 w-7' />
            </div>
            <div className='relative space-y-2'>
              <p className='font-display text-primary-foreground text-xl font-semibold'>
                Watch this product
              </p>
              <p className='text-primary-foreground/75 max-w-xs text-sm'>
                See materials, fit, and craftsmanship in motion before you buy.
              </p>
            </div>
          </button>
        ) : (
          <iframe
            src={`${embedUrl}?autoplay=1&rel=0`}
            title={`${product.name ?? 'Product'} video`}
            className='absolute inset-0 h-full w-full'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        )}

        <div className='pointer-events-none absolute top-4 left-4 flex gap-2'>
          <Badge variant='inverse'>Product video</Badge>
          {!isCustom && (
            <Badge variant='accentOutline' className='bg-background/80'>
              Preview
            </Badge>
          )}
        </div>
      </div>

      <p className='text-muted-foreground text-xs leading-relaxed'>
        {isCustom
          ? 'Official product video from the brand.'
          : 'Preview video — add a `video_url` attribute on the product to show your own clip.'}
      </p>
    </div>
  );
}
