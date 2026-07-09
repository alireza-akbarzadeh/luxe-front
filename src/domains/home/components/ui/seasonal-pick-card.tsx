'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { buttonVariants } from '@/components/ui/button';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { DtoHomeSectionItem } from '@/services/-home-seasonal-picks-get.schemas';

export function SeasonalPickCard({
  section,
  fallbackLabel
}: Readonly<{
  section: DtoHomeSectionItem;
  fallbackLabel: string;
}>) {
  const href = section.href ?? '/shop';
  const imageSrc = section.image_url ?? IMAGE_FALLBACK;

  return (
    <article className='group luxury-card luxury-image-zoom border-border/60 bg-card relative min-h-[20rem] overflow-hidden rounded-2xl border shadow-sm sm:min-h-[24rem] sm:rounded-3xl'>
      <AppImage
        src={imageSrc}
        alt={section.title ?? fallbackLabel}
        fill
        sizes='(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 30vw'
        loading='lazy'
        className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
      />

      <div className='from-foreground/90 via-foreground/40 absolute inset-0 bg-gradient-to-t to-transparent' />

      <div className='absolute inset-0 flex flex-col justify-end p-6 sm:p-8'>
        <h3 className='text-primary-foreground font-display text-2xl font-semibold sm:text-3xl'>
          {section.title}
        </h3>
        <Link
          href={href}
          className={cn(
            buttonVariants({ size: 'lg' }),
            'text-gold-foreground [&_svg]:text-gold-foreground mt-5 w-fit border-0 bg-white shadow-md hover:bg-white/90'
          )}
        >
          {fallbackLabel}
          <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4' />
        </Link>
      </div>
    </article>
  );
}
