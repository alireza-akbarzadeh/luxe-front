'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { DotIndicators } from '@/components/section-carousel/dot-Indicators';
import { AppImage } from '@/components/ui/app-image';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import type { HeroSlide } from '@/domains/home/lib/hero-slides';
import { useCarouselState } from '@/hooks/useCarouselState';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 5500;

type HeroSlidesCarouselProps = {
  slides: HeroSlide[];
  className?: string;
  /** Prioritize the first slide image (desktop hero). */
  priorityFirst?: boolean;
};

/** Admin-driven hero image carousel with autoplay and dot navigation. */
export function HeroSlidesCarousel({
  slides,
  className,
  priorityFirst = false
}: HeroSlidesCarouselProps) {
  const { setApi, current, count, scrollTo, scrollNext } = useCarouselState();
  const hasMultiple = slides.length > 1;

  useEffect(() => {
    if (!hasMultiple) return;
    const timer = window.setInterval(() => {
      scrollNext();
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [hasMultiple, scrollNext]);

  if (slides.length === 0) return null;

  return (
    <div className={cn('relative', className)}>
      <Carousel setApi={setApi} opts={{ loop: hasMultiple, align: 'start' }} className='w-full'>
        <CarouselContent className='ml-0'>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.key} className='basis-full pl-0'>
              <Link
                href={slide.href}
                className='group border-border/50 bg-card relative block aspect-[5/4] overflow-hidden rounded-2xl border shadow-sm sm:aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]'
              >
                <AppImage
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  sizes='(max-width: 1024px) 100vw, 48vw'
                  priority={priorityFirst && index === 0}
                  loading={priorityFirst && index === 0 ? undefined : 'lazy'}
                  className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
                />
                <div
                  aria-hidden
                  className='from-foreground/85 via-foreground/35 absolute inset-0 bg-gradient-to-t to-transparent'
                />
                <div
                  aria-hidden
                  className='bg-gold/20 pointer-events-none absolute -end-10 -top-10 size-40 rounded-full blur-3xl'
                />

                <Flex
                  direction='column'
                  justify='end'
                  className='absolute inset-0 p-5 sm:p-6 lg:p-8'
                >
                  {slide.eyebrow ? (
                    <Typography.Overline className='text-primary-foreground/80'>
                      {slide.eyebrow}
                    </Typography.Overline>
                  ) : null}
                  {slide.title ? (
                    <Typography.H2
                      family='display'
                      className='text-primary-foreground mt-2 max-w-xs text-2xl font-semibold tracking-tight text-balance sm:text-3xl'
                    >
                      {slide.title}
                    </Typography.H2>
                  ) : null}
                  {slide.subtitle ? (
                    <Typography.Text
                      variant='small'
                      className='text-primary-foreground/85 mt-2 line-clamp-2 max-w-sm'
                    >
                      {slide.subtitle}
                    </Typography.Text>
                  ) : null}
                  <Typography.Text
                    variant='small'
                    weight='medium'
                    className='text-primary-foreground mt-4 inline-flex items-center gap-2'
                  >
                    Shop now
                    <span
                      className='cn-rtl-flip transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'
                      aria-hidden
                    >
                      →
                    </span>
                  </Typography.Text>
                </Flex>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {hasMultiple ? (
        <div className='absolute inset-x-0 bottom-3 flex justify-center'>
          <DotIndicators count={count} active={current} onDotClick={scrollTo} />
        </div>
      ) : null}
    </div>
  );
}
