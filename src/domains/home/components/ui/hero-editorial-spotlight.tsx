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
      <div className='relative aspect-[5/4] min-h-[13.5rem] w-full sm:aspect-[16/10]'>
        <AppImage
          src={HERO_EDITORIAL_SPOTLIGHT_IMAGE}
          alt='Curated luxury edit in a considered boutique setting'
          fill
          sizes='100vw'
          loading='lazy'
          className='z-0 object-cover transition-transform duration-700 group-hover:scale-[1.03]'
        />

        <span
          aria-hidden
          className='pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/90 via-black/45 to-black/10'
        />
        <span
          aria-hidden
          className='bg-gold/15 pointer-events-none absolute -end-8 top-6 z-[1] size-28 rounded-full blur-2xl'
        />

        <Flex
          direction='column'
          spacing={2}
          className='absolute inset-0 z-[2] justify-end px-5 py-4'
        >
          <Typography.Overline className='text-white/75'>Editorial spotlight</Typography.Overline>
          <Typography.Small
            weight='semibold'
            className='max-w-[16rem] text-base leading-snug text-pretty text-white'
          >
            Craftsmanship, curation, and delivery — considered end to end.
          </Typography.Small>
          <span className='inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-white/90'>
            Explore collections
            <HeroIconArrowRight className='cn-rtl-flip size-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5' />
          </span>
        </Flex>
      </div>
    </Link>
  );
}
