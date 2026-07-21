import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { HERO_EDITORIAL_SPOTLIGHT_IMAGE } from '@/domains/home/lib/home-mock-data';

/**
 * Compact hero promo card — rounded media panel like a storefront sale tile.
 * Image is below the LCP text path; keep lazy so the headline paints first.
 */
export async function HeroEditorialPanel() {
  const t = await getTranslations('home.hero.promoPanel');

  return (
    <Link
      href='/shop'
      className='group border-border/50 bg-card relative block aspect-[5/4] overflow-hidden rounded-2xl border shadow-sm sm:aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]'
    >
      <AppImage
        src={HERO_EDITORIAL_SPOTLIGHT_IMAGE}
        alt=''
        aria-hidden
        fill
        sizes='(max-width: 1024px) 100vw, 48vw'
        loading='lazy'
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

      <Flex direction='column' justify='end' className='absolute inset-0 p-5 sm:p-6 lg:p-8'>
        <Typography.Overline className='text-primary-foreground/80'>
          {t('eyebrow')}
        </Typography.Overline>
        <Typography.H2
          family='display'
          className='text-primary-foreground mt-2 max-w-xs text-2xl font-semibold tracking-tight text-balance sm:text-3xl'
        >
          {t('title')}
        </Typography.H2>
        <Typography.Text
          variant='small'
          weight='medium'
          className='text-primary-foreground mt-4 inline-flex items-center gap-2'
        >
          {t('cta')}
          <span
            className='cn-rtl-flip transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5'
            aria-hidden
          >
            →
          </span>
        </Typography.Text>
      </Flex>
    </Link>
  );
}
