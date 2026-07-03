'use client';

import { useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoShopLookResponse } from '@/services/-shop-looks-{slug}-get.schemas';

import { ShopLookHotspot } from './shop-look-hotspot';

type ShoppableLookImageProps = {
  look: DtoShopLookResponse;
  hint: string;
  taggedItemsLabel: string;
  shopLabel: string;
  closeLabel: string;
  className?: string;
};

/** Lifestyle image with percent-positioned product hotspots. */
export function ShoppableLookImage({
  look,
  hint,
  taggedItemsLabel,
  shopLabel,
  closeLabel,
  className
}: ShoppableLookImageProps) {
  const [activeTagId, setActiveTagId] = useState(0);
  const tags = look.tags ?? [];

  return (
    <Box className={cn('relative w-full overflow-hidden rounded-2xl', className)}>
      <div className='relative aspect-[4/5] w-full sm:aspect-[16/10]'>
        <AppImage
          src={look.image_url ?? IMAGE_FALLBACK}
          alt={look.title ?? ''}
          fill
          sizes='(max-width: 768px) 100vw, 70vw'
          priority
          className='object-cover'
        />
        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10'
        />

        {tags.map((tag) =>
          tag.id != null && tag.product ? (
            <ShopLookHotspot
              key={tag.id}
              id={tag.id}
              xPercent={tag.x_percent ?? 50}
              yPercent={tag.y_percent ?? 50}
              label={tag.label}
              product={tag.product}
              isActive={activeTagId === tag.id}
              onActivate={setActiveTagId}
              shopLabel={shopLabel}
              closeLabel={closeLabel}
            />
          ) : null
        )}
      </div>

      <Flex
        direction='column'
        spacing={1}
        className='border-border/60 bg-card/80 absolute inset-x-0 bottom-0 border-t px-4 py-3 backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:px-0 sm:py-4 sm:backdrop-blur-none'
      >
        <Typography.Small className='text-muted-foreground'>{hint}</Typography.Small>
        <Typography.Small weight='medium'>{taggedItemsLabel}</Typography.Small>
      </Flex>
    </Box>
  );
}
