'use client';
import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { Children, isValidElement, type ReactNode } from 'react';

import { ChevronButton } from '@/components/section-carousel/chevron-button';
import { DotIndicators } from '@/components/section-carousel/dot-Indicators';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselOptions
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { useCarouselState } from '@/hooks/useCarouselState';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * Controls how many slides are visible per breakpoint.
 * Each value maps to a Tailwind `basis-*` fraction.
 *
 * @example { mobile: 1, tablet: 2, desktop: 4 }
 */
export type SectionCarouselColumns = {
  /** Cards fully visible on mobile (default: 1) */
  mobile?: 1 | 2;
  /** Cards fully visible on sm/tablet (default: 2) */
  tablet?: 1 | 2 | 3;
  /** Cards fully visible on lg/desktop (default: 4) */
  desktop?: 1 | 2 | 3 | 4 | 5;
};

export type SectionCarouselProps<T> = {
  // ── Header ────────────────────────────────────────────────────────────────
  eyebrow?: string;
  title: string;
  description?: string;
  /** If provided, renders a "View all →" link */
  viewAllHref?: string;
  viewAllLabel?: string;
  headerSlot?: ReactNode;
  opts?: CarouselOptions;
  // ── Data ──────────────────────────────────────────────────────────────────
  /** Items to render. Required when using renderItem. Optional when using children. */
  items?: T[];
  isLoading?: boolean;
  /** Number of skeleton placeholders shown while loading (default: columns.desktop) */
  skeletonCount?: number;
  /** Custom skeleton card — falls back to a rounded rect if omitted */
  renderSkeleton?: () => ReactNode;

  // ── Card renderer ─────────────────────────────────────────────────────────
  /** Function to render each item. Called on client side. Used when children are not provided. */
  renderItem?: (item: T, index: number) => ReactNode;
  /** When provided, rendered directly instead of using renderItem. Each child wrapped in CarouselItem. */
  children?: ReactNode;

  // ── Layout ────────────────────────────────────────────────────────────────
  footerSlot?: ReactNode;
  columns?: SectionCarouselColumns;
  /**
   * Size slides to their content instead of equal column fractions
   * (e.g. Instagram-stories style rings). Ignores `columns` when true.
   */
  fitContent?: boolean;
  /** Gap between slides in px (default 16). */
  gapPx?: number;
  /** Extra classes on the outer <section> */
  className?: string;
  sectionId?: string;

  // ── Carousel options ──────────────────────────────────────────────────────
  loop?: boolean;
};

// ── Column → Tailwind basis map ───────────────────────────────────────────────

const mobileBasis: Record<number, string> = {
  1: 'basis-[88%]',
  2: 'basis-[48%]'
};

const tabletBasis: Record<number, string> = {
  1: 'sm:basis-[88%]',
  2: 'sm:basis-[48%]',
  3: 'sm:basis-[34%]'
};

const desktopBasis: Record<number, string> = {
  1: 'lg:basis-full',
  2: 'lg:basis-1/2',
  3: 'lg:basis-1/3',
  4: 'lg:basis-1/4',
  5: 'lg:basis-1/5'
};

// ── Main component ────────────────────────────────────────────────────────────

export function SectionCarousel<T>({
  eyebrow,
  title,
  description,
  viewAllHref,
  viewAllLabel = 'View all',
  items,
  isLoading = false,
  skeletonCount,
  renderSkeleton,
  renderItem,
  children,
  columns = { mobile: 1, tablet: 2, desktop: 4 },
  fitContent = false,
  gapPx = 16,
  className,
  sectionId,
  loop = true,
  headerSlot,
  footerSlot,
  opts
}: SectionCarouselProps<T>) {
  const { setApi, current, count, scrollTo, scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarouselState();

  const { mobile = 1, tablet = 2, desktop = 4 } = columns;
  const itemBasis = fitContent
    ? '!basis-auto'
    : cn(mobileBasis[mobile], tabletBasis[tablet], desktopBasis[desktop]);
  const contentStyle = fitContent ? ({ marginLeft: `-${gapPx}px` } as const) : undefined;
  const itemStyle = fitContent ? ({ paddingLeft: `${gapPx}px` } as const) : undefined;
  const itemClassName = cn(
    itemBasis,
    fitContent ? 'min-w-0 shrink-0 grow-0 !basis-auto !pl-0' : 'pl-4'
  );
  const placeholderCount = skeletonCount ?? desktop;
  const itemsToRender = items ?? [];
  const hasChildren = !!children;
  const shouldRenderItems = !hasChildren && itemsToRender.length > 0;

  return (
    <section id={sectionId} className={cn('py-16 sm:py-20 lg:py-28', className)}>
      <div className='app-container'>
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className='mb-8 flex items-end justify-between gap-4 md:mb-10'>
          <div className='min-w-0'>
            {eyebrow && (
              <p className='text-accent text-xs font-semibold tracking-[0.2em] uppercase'>
                {eyebrow}
              </p>
            )}
            <h2 className='font-display mt-2 text-3xl font-semibold tracking-tight sm:text-4xl'>
              {title}
            </h2>
            {description && (
              <p className='text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed sm:text-base'>
                {description}
              </p>
            )}
          </div>

          <div className='flex shrink-0 items-center gap-3 pb-1'>
            {/* Desktop chevrons */}
            <div className='hidden items-center gap-2 lg:flex'>
              <ChevronButton direction='prev' onClick={scrollPrev} disabled={!canScrollPrev} />
              <ChevronButton direction='next' onClick={scrollNext} disabled={!canScrollNext} />
            </div>

            {viewAllHref && (
              <Link
                href={viewAllHref}
                className='text-accent inline-flex items-center gap-1 text-sm font-medium hover:underline'
              >
                {viewAllLabel}
                <IconArrowRight className='cn-rtl-flip h-4 w-4' />
              </Link>
            )}
          </div>
        </div>
        {/* ── Header slot (e.g. Tabs) ──────────────────────────────────────── */}
        {headerSlot && <div className='mb-8 sm:mb-10'>{headerSlot}</div>}
        {/* ── Carousel ──────────────────────────────────────────────────── */}
        <Carousel
          setApi={setApi}
          opts={opts ?? { align: 'start', loop, skipSnaps: false }}
          className='w-full'
        >
          <CarouselContent className={cn(fitContent ? '!-ml-0' : '-ml-4')} style={contentStyle}>
            {isLoading
              ? Array.from({ length: placeholderCount }).map((_, i) => (
                  <CarouselItem key={i} className={itemClassName} style={itemStyle}>
                    {renderSkeleton ? (
                      renderSkeleton()
                    ) : (
                      <Skeleton className='h-64 w-full rounded-2xl' />
                    )}
                  </CarouselItem>
                ))
              : hasChildren
                ? Children.toArray(children)
                    .filter(isValidElement)
                    .map((child: React.ReactElement, index: number) => (
                      <CarouselItem key={index} className={itemClassName} style={itemStyle}>
                        {child}
                      </CarouselItem>
                    ))
                : shouldRenderItems
                  ? itemsToRender.map((item, index) => (
                      <CarouselItem key={index} className={itemClassName} style={itemStyle}>
                        {renderItem?.(item, index)}
                      </CarouselItem>
                    ))
                  : null}
          </CarouselContent>
        </Carousel>

        {/* ── Bottom controls ────────────────────────────────────────────── */}
        {!isLoading && (
          <div className='mt-6 flex items-center justify-between lg:justify-center'>
            {/* Mobile chevrons */}
            <div className='flex items-center gap-2 lg:hidden'>
              <ChevronButton direction='prev' onClick={scrollPrev} disabled={!canScrollPrev} />
              <ChevronButton direction='next' onClick={scrollNext} disabled={!canScrollNext} />
            </div>

            <DotIndicators count={count} active={current} onDotClick={scrollTo} />

            {/* Mirror spacer — keeps dots centred on mobile */}
            <div className='flex gap-2 opacity-0 lg:hidden' aria-hidden>
              <div className='size-9' />
              <div className='size-9' />
            </div>
          </div>
        )}
        {footerSlot}
      </div>
    </section>
  );
}
