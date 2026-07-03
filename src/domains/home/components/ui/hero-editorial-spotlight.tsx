'use client';

import Link from 'next/link';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import { HERO_EDITORIAL_SPOTLIGHT_IMAGE } from '../../lib/home-mock-data';
import { HeroIconArrowRight } from './hero-icons';

/** Mobile hero editorial band — photography + copy instead of an empty gradient slab. */
export function HeroEditorialSpotlight({ className }: { className?: string }) {
  return (
    <Link
      href='/collections'
      className={cn(
        'group border-gold/20 relative -mx-5 block overflow-hidden border-y no-underline',
        className
      )}
    >
      <Flex
        direction='column'
        justify='end'
        className='relative aspect-[5/4] min-h-[13.5rem] w-full sm:aspect-[16/10]'
      >
        <AppImage
          src={HERO_EDITORIAL_SPOTLIGHT_IMAGE}
          alt='Curated luxury edit in a considered boutique setting'
          fill
          sizes='100vw'
          loading='lazy'
          className='object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />

        <span
          aria-hidden
          className='from-foreground/92 via-foreground/45 to-foreground/15 pointer-events-none absolute inset-0 bg-gradient-to-t'
        />
        <span
          aria-hidden
          className='bg-gold/15 pointer-events-none absolute -end-8 top-6 size-28 rounded-full blur-2xl'
        />

        <Flex direction='column' spacing={2} className='relative px-5 py-4'>
          <Typography.Overline tone='accent' className='text-primary-foreground/80'>
            Editorial spotlight
          </Typography.Overline>
          <Typography.Small
            weight='semibold'
            className='text-primary-foreground max-w-[16rem] text-base leading-snug text-pretty'
          >
            Craftsmanship, curation, and delivery — considered end to end.
          </Typography.Small>
          <span className='text-primary-foreground/90 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide'>
            Explore collections
            <HeroIconArrowRight className='cn-rtl-flip size-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
          </span>
        </Flex>
      </Flex>
    </Link>
  );
}
