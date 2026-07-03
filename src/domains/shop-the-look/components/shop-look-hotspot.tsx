'use client';

import Link from 'next/link';
import { useState } from 'react';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Typography } from '@/components/ui/typography';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoHomeProductItem } from '@/services/-shop-looks-{slug}-get.schemas';

export type ShopLookHotspotProps = {
  id: number;
  xPercent: number;
  yPercent: number;
  label?: string;
  product: DtoHomeProductItem;
  isActive: boolean;
  onActivate: (id: number) => void;
  shopLabel: string;
  closeLabel: string;
};

/** Interactive hotspot pin on a shoppable look image. */
export function ShopLookHotspot({
  id,
  xPercent,
  yPercent,
  label,
  product,
  isActive,
  onActivate,
  shopLabel,
  closeLabel
}: ShopLookHotspotProps) {
  const { formatPrice } = useLocaleFormatters();
  const [open, setOpen] = useState(false);
  const imageSrc = product.images?.[0] ?? IMAGE_FALLBACK;
  const productHref = product.slug ? getProductPath({ slug: product.slug }) : '#';
  const displayLabel = label || product.name || shopLabel;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) {
      onActivate(id);
    }
  };

  return (
    <Popover open={open || isActive} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type='button'
          aria-label={displayLabel}
          className={cn(
            'absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full',
            'focus-visible:ring-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
          )}
          style={{ left: `${xPercent}%`, top: `${yPercent}%` }}
          onClick={() => onActivate(id)}
        >
          <span
            aria-hidden
            className={cn(
              'bg-gold/30 absolute inset-0 animate-ping rounded-full',
              open || isActive ? 'opacity-100' : 'opacity-70'
            )}
          />
          <span
            aria-hidden
            className={cn(
              'border-gold bg-background relative flex size-5 items-center justify-center rounded-full border-2 shadow-md sm:size-6',
              open || isActive ? 'scale-110' : 'scale-100'
            )}
          >
            <span className='bg-gold size-1.5 rounded-full sm:size-2' />
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        side='top'
        align='center'
        className='w-64 p-0 sm:w-72'
        onEscapeKeyDown={() => setOpen(false)}
      >
        <Flex direction='column' spacing={0}>
          <Link href={productHref} className='group relative block aspect-[4/3] overflow-hidden'>
            <AppImage
              src={imageSrc}
              alt={product.name ?? ''}
              fill
              sizes='288px'
              className='object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </Link>
          <Flex direction='column' spacing={2} className='p-4'>
            <Typography.Small weight='semibold' className='line-clamp-2 leading-snug'>
              {product.name}
            </Typography.Small>
            <Typography.Small className='text-muted-foreground'>
              {formatPrice(product.price)}
            </Typography.Small>
            <Flex spacing={2}>
              <Button asChild size='sm' className='flex-1'>
                <Link href={productHref}>{shopLabel}</Link>
              </Button>
              <Button
                type='button'
                size='sm'
                variant='outline'
                onClick={() => {
                  setOpen(false);
                  onActivate(0);
                }}
              >
                {closeLabel}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </PopoverContent>
    </Popover>
  );
}
