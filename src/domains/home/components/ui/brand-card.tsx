'use client';

import { IconPackage, IconStarFilled, IconTrendingUp } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import type { DtoHomeBrandItem } from '@/services/-home-top-brands-get.schemas';

export function BrandCard({ brand }: { brand: DtoHomeBrandItem }) {
  const href = brand.slug ? `/brands/${brand.slug}` : '/shop';
  const hasRating = typeof brand.rating === 'number' && brand.rating > 0;
  const hasProductCount = typeof brand.product_count === 'number' && brand.product_count > 0;

  return (
    <Link
      href={href}
      className='group border-border/60 bg-card hover:border-accent/40 hover:shadow-accent/8 relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
    >
      {/* ── Banner ──────────────────────────────────────────────────────── */}
      <div className='bg-muted relative h-24 w-full overflow-hidden sm:h-28'>
        {brand.banner_url ? (
          <AppImage
            src={brand.banner_url}
            alt=''
            aria-hidden
            fill
            sizes='(max-width: 640px) 90vw, 25vw'
            loading='lazy'
            className='object-cover transition-transform duration-700 group-hover:scale-105'
          />
        ) : (
          <div className='from-accent/15 via-muted to-muted absolute inset-0 bg-gradient-to-br' />
        )}
        {/* Fade into card background so the logo plate below reads cleanly */}
        <div className='from-card absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t to-transparent' />

        {/* Workflow state badge, top-right of banner */}
        {brand.workflow_state?.name && (
          <span
            className='absolute end-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide shadow-sm'
            style={{
              color: brand.workflow_state.text_color ?? undefined,
              backgroundColor: brand.workflow_state.color ?? 'rgba(0,0,0,0.6)'
            }}
          >
            {brand.workflow_state.name}
          </span>
        )}
      </div>

      {/* ── Logo plate — overlaps banner/body seam ─────────────────────── */}
      <div className='-mt-8 flex justify-center'>
        <div className='border-border/60 bg-background flex size-16 items-center justify-center overflow-hidden rounded-2xl border-4 shadow-md sm:size-[4.5rem]'>
          {brand.logo_url ? (
            <AppImage
              src={brand.logo_url}
              alt={brand.name ?? 'Brand logo'}
              width={64}
              height={64}
              loading='lazy'
              className='size-full object-contain p-2'
            />
          ) : (
            <span className='text-muted-foreground text-lg font-semibold'>
              {brand.name?.charAt(0)?.toUpperCase() ?? '—'}
            </span>
          )}
        </div>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className='flex flex-1 flex-col items-center gap-1 px-4 pt-3 pb-5 text-center'>
        <h3 className='font-display group-hover:text-accent line-clamp-1 text-base font-semibold transition-colors'>
          {brand.name ?? '—'}
        </h3>

        {brand.description && (
          <p className='text-muted-foreground line-clamp-2 text-xs leading-relaxed'>
            {brand.description}
          </p>
        )}

        {/* Stats row */}
        <div className='text-muted-foreground mt-2 flex items-center gap-3 text-xs'>
          {hasRating && (
            <span className='inline-flex items-center gap-1'>
              <IconStarFilled className='fill-accent text-accent size-3.5' />
              <span className='text-foreground font-medium tabular-nums'>
                {brand.rating?.toFixed(1)}
              </span>
            </span>
          )}

          {hasRating && hasProductCount && <span className='bg-border h-3 w-px' aria-hidden />}

          {hasProductCount && (
            <span className='inline-flex items-center gap-1'>
              <IconPackage className='size-3.5' />
              <span className='tabular-nums'>{brand.product_count}</span>
            </span>
          )}
        </div>

        {/* Min price pill */}
        {typeof brand.min_price === 'number' && brand.min_price > 0 && (
          <div className='bg-accent/10 text-accent mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium'>
            <IconTrendingUp className='size-3' />
            From {brand.min_price.toLocaleString()}
          </div>
        )}
      </div>
    </Link>
  );
}
