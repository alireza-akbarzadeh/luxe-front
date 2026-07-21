'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
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
  const description =
    typeof section.filters?.['description'] === 'string'
      ? section.filters['description']
      : undefined;

  return (
    <article className='group relative min-h-[12rem] overflow-hidden rounded-2xl sm:min-h-[14rem] lg:min-h-[15rem]'>
      <AppImage
        src={imageSrc}
        alt={section.title ?? fallbackLabel}
        fill
        sizes='(max-width: 768px) 92vw, (max-width: 1024px) 45vw, 30vw'
        loading='lazy'
        className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
      />

      <div
        aria-hidden
        className='from-foreground/85 via-foreground/45 absolute inset-0 bg-gradient-to-r to-transparent'
      />

      <Flex
        direction='column'
        justify='center'
        className='relative h-full max-w-[78%] p-4 sm:max-w-[70%] sm:p-5 lg:p-6'
      >
        <Typography.H3
          family='display'
          className='text-primary-foreground text-lg font-semibold tracking-tight sm:text-xl lg:text-2xl'
        >
          {section.title}
        </Typography.H3>

        {description ? (
          <Typography.Text
            variant='small'
            className='text-primary-foreground/80 mt-1.5 line-clamp-2 text-xs sm:text-sm'
          >
            {description}
          </Typography.Text>
        ) : null}

        <Link
          href={href}
          className={cn(
            'mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#141414] shadow-md transition-colors hover:bg-white/90 sm:mt-4 sm:text-sm'
          )}
        >
          {fallbackLabel}
          <IconArrowRight className='cn-rtl-flip size-4' />
        </Link>
      </Flex>
    </article>
  );
}
