'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DtoHomeCollectionItem } from '@/services/-home-popular-collections-get.schemas';

export function HomeCollectionCard({
  banner,
  fallbackLabel
}: Readonly<{
  banner: DtoHomeCollectionItem;
  index: number;
  fallbackLabel: string;
}>) {
  const href = banner.href ?? (banner.slug ? `/collections/${banner.slug}` : '/collections');

  return (
    <article className='group border-border/60 bg-card relative min-h-[22rem] overflow-hidden rounded-2xl border shadow-sm sm:min-h-[26rem] sm:rounded-3xl lg:min-h-[32rem]'>
      {banner.image_url ? (
        <AppImage
          src={banner.image_url}
          alt={banner.title ?? fallbackLabel}
          fill
          sizes='(max-width: 768px) 92vw, (max-width: 1024px) 80vw, 45vw'
          loading='lazy'
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />
      ) : (
        <div className='bg-muted absolute inset-0' />
      )}

      <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent' />

      <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10'>
        {banner.eyebrow ? (
          <span className='text-primary-foreground/75 text-xs font-semibold tracking-[0.2em] uppercase'>
            {banner.eyebrow}
          </span>
        ) : null}
        <h3 className='text-primary-foreground font-display mt-2 text-2xl font-semibold sm:text-3xl lg:text-4xl'>
          {banner.title}
        </h3>
        {banner.description ? (
          <p className='text-primary-foreground/80 mt-2 max-w-md text-sm leading-relaxed sm:text-base'>
            {banner.description}
          </p>
        ) : null}
        <Link
          href={href}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'text-gold-foreground [&_svg]:text-gold-foreground mt-6 w-fit border-0 bg-white shadow-md hover:bg-white/90'
          )}
        >
          {banner.cta_label ?? fallbackLabel}
          <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4' />
        </Link>
      </div>
    </article>
  );
}
