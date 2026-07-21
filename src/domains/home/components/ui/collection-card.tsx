'use client';

import { IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
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
    <article
      className={cn(
        'group border-border/50 flex h-full min-h-[14rem] flex-col overflow-hidden rounded-2xl border shadow-sm sm:min-h-[16rem] lg:min-h-[18rem] lg:flex-row',
        'bg-[#f3ede4] dark:border-white/10 dark:bg-[#222222]'
      )}
    >
      <Flex
        direction='column'
        justify='center'
        className='w-full shrink-0 p-4 sm:p-5 lg:w-[42%] lg:p-6 xl:w-[40%]'
      >
        {banner.eyebrow ? (
          <Typography.Text
            variant='subtle'
            weight='semibold'
            className='text-foreground/70 text-[10px] tracking-[0.2em] uppercase'
          >
            {banner.eyebrow}
          </Typography.Text>
        ) : null}

        <Typography.H3
          family='display'
          className='text-foreground mt-2 text-xl font-semibold tracking-tight sm:text-2xl'
        >
          {banner.title}
        </Typography.H3>

        {banner.description ? (
          <Typography.Muted className='mt-2 line-clamp-3 text-xs leading-relaxed sm:text-sm'>
            {banner.description}
          </Typography.Muted>
        ) : null}

        <Link
          href={href}
          className={cn(
            'bg-foreground text-background hover:bg-foreground/90 mt-4 inline-flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors sm:text-sm',
            'dark:bg-white dark:text-[#141414] dark:hover:bg-white/90'
          )}
        >
          {banner.cta_label ?? fallbackLabel}
          <IconArrowRight className='cn-rtl-flip size-4' />
        </Link>
      </Flex>

      <div className='bg-muted relative min-h-[10rem] flex-1 overflow-hidden lg:min-h-0'>
        {banner.image_url ? (
          <AppImage
            src={banner.image_url}
            alt={banner.title ?? fallbackLabel}
            fill
            sizes='(max-width: 1024px) 92vw, 35vw'
            loading='lazy'
            className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
          />
        ) : (
          <Flex
            align='center'
            justify='center'
            className='text-muted-foreground/40 absolute inset-0'
          >
            <span className='text-xs'>Image</span>
          </Flex>
        )}
      </div>
    </article>
  );
}
