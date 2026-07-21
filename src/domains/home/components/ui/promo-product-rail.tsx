'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';

import { ChevronButton } from '@/components/section-carousel/chevron-button';
import { AppImage } from '@/components/ui/app-image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Flex } from '@/components/ui/flex';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { useCarouselState } from '@/hooks/useCarouselState';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { Locale } from '~/src/i18n/config';
import type { DtoHomeFlashDealItem } from '~/src/services/-home-flash-deals-get.schemas';

function dealDiscountPercent(deal: DtoHomeFlashDealItem): number | null {
  const product = deal.product;
  if (!product) return null;
  if (product.discount_percent != null && product.discount_percent > 0) {
    return Math.round(product.discount_percent);
  }
  if (
    product.compare_at_price != null &&
    product.price != null &&
    product.compare_at_price > product.price
  ) {
    return Math.round(
      ((product.compare_at_price - product.price) / product.compare_at_price) * 100
    );
  }
  return null;
}

type PromoProductRailProps = {
  deals: DtoHomeFlashDealItem[];
  promoImageAlt: string;
  theme?: 'dark' | 'light';
};

/** Horizontal flash-deal rail with prev/next controls. */
export function PromoProductRail({ deals, promoImageAlt, theme = 'dark' }: PromoProductRailProps) {
  const locale = useLocale() as Locale;
  const { setApi, scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarouselState();
  const isDark = theme === 'dark';

  if (deals.length === 0) return null;

  return (
    <div className='relative min-w-0 flex-1'>
      <Flex
        direction='row'
        align='center'
        justify='end'
        gap={2}
        className='absolute end-0 -top-10 z-10 hidden sm:flex'
      >
        <ChevronButton
          direction='prev'
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className={cn(
            isDark &&
              'border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15 disabled:text-white/25'
          )}
        />
        <ChevronButton
          direction='next'
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={cn(
            isDark &&
              'border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15 disabled:text-white/25'
          )}
        />
      </Flex>

      <Carousel
        setApi={setApi}
        opts={{ align: 'start', loop: false, dragFree: true }}
        className='w-full'
      >
        <CarouselContent className='-ms-2.5'>
          {deals.map((deal) => {
            const product = deal.product;
            if (!product) return null;
            const href = getProductPath(product);
            const image = product.images?.[0] ?? IMAGE_FALLBACK;
            const discount = dealDiscountPercent(deal);

            return (
              <CarouselItem key={deal.id ?? product.id} className='basis-auto ps-2.5'>
                <Link
                  href={href}
                  className={cn(
                    'group flex h-[13.75rem] w-[10rem] flex-col overflow-hidden rounded-xl border transition-colors sm:w-[9.5rem]',
                    isDark
                      ? 'hover:border-gold/40 border-white/15 bg-white/10'
                      : 'border-border/60 bg-card hover:border-gold/30'
                  )}
                >
                  <div
                    className={cn(
                      'relative aspect-square overflow-hidden',
                      isDark ? 'bg-white/5' : 'bg-muted/40'
                    )}
                  >
                    <AppImage
                      src={image}
                      alt={product.name ?? promoImageAlt}
                      fill
                      loading='lazy'
                      sizes='160px'
                      className='object-cover transition-transform duration-500 group-hover:scale-105'
                    />
                    {discount != null ? (
                      <span className='bg-gold text-gold-foreground absolute end-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold'>
                        -{discount}%
                      </span>
                    ) : null}
                  </div>
                  <div className='flex flex-1 flex-col gap-0.5 p-2.5'>
                    <p
                      className={cn(
                        'line-clamp-2 text-[11px] leading-snug font-medium',
                        isDark ? 'text-white' : 'text-foreground'
                      )}
                    >
                      {product.name}
                    </p>
                    <Flex direction='row' align='baseline' gap={1.5} className='mt-auto pt-1'>
                      <span className='text-gold text-xs font-semibold tabular-nums'>
                        {formatPrice(product.price, locale)}
                      </span>
                      {product.compare_at_price != null &&
                      product.price != null &&
                      product.compare_at_price > product.price ? (
                        <span
                          className={cn(
                            'text-[10px] tabular-nums line-through',
                            isDark ? 'text-white/50' : 'text-muted-foreground'
                          )}
                        >
                          {formatPrice(product.compare_at_price, locale)}
                        </span>
                      ) : null}
                    </Flex>
                  </div>
                </Link>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      <Flex direction='row' align='center' justify='center' gap={2} className='mt-3 sm:hidden'>
        <ChevronButton
          direction='prev'
          onClick={scrollPrev}
          disabled={!canScrollPrev}
          className={cn(
            isDark &&
              'border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15 disabled:text-white/25'
          )}
        />
        <ChevronButton
          direction='next'
          onClick={scrollNext}
          disabled={!canScrollNext}
          className={cn(
            isDark &&
              'border-white/20 bg-white/10 text-white hover:border-white/35 hover:bg-white/15 disabled:text-white/25'
          )}
        />
      </Flex>
    </div>
  );
}
