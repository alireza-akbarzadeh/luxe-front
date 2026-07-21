import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { marketingNumbers } from '@/lib/i18n/marketing-numbers';
import { cn } from '@/lib/utils';

import { HeroEditorialPanel } from './hero-editorial-panel';
import { HeroIconArrowRight, HeroIconSparkles, HeroIconStar } from './hero-icons';

const primaryCtaClass = cn(
  'group flex h-11 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-wide',
  'bg-primary text-primary-foreground shadow-md transition-[color,background-color,transform] duration-200',
  'active:scale-[0.98]'
);

const secondaryCtaClass = cn(
  'flex h-11 w-full items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold tracking-wide transition-colors',
  'border-border bg-card text-foreground hover:border-gold active:scale-[0.98]'
);

/** Mobile-only compact split hero — matches storefront home density. */
export async function HeroMobile() {
  const t = await getTranslations('home.hero');
  const year = new Date().getFullYear();

  return (
    <Box
      asChild
      className={cn(
        'hero-mobile-perf bg-background relative block overflow-x-hidden md:hidden',
        'px-5 pt-2 [padding-bottom:calc(1.25rem+env(safe-area-inset-bottom))] pb-6'
      )}
    >
      <section aria-label='LUXE mobile hero'>
        <Flex direction='column' spacing={5} className='relative'>
          <Flex direction='column' align='start' spacing={3} className='w-full'>
            <span className='border-border/60 bg-card inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide uppercase'>
              <HeroIconSparkles className='text-gold size-3 shrink-0' />
              <span className='text-foreground'>{t('seasonBadge', { year })}</span>
              <span className='text-muted-foreground'>— {t('seasonLive')}</span>
            </span>

            <Typography.H1
              family='display'
              className='hero-lcp-title w-full text-[clamp(1.85rem,8vw,2.35rem)] leading-[1.08] font-semibold tracking-tight text-balance'
            >
              {t('titleLine1')}
              <span className='hero-lcp-accent text-gold-gradient mt-1 block font-semibold italic'>
                {t('titleLine2')}
              </span>
            </Typography.H1>

            <Typography.Muted className='max-w-[20rem] text-sm leading-relaxed text-pretty'>
              {t('description')}
            </Typography.Muted>

            <Flex direction='row' align='center' gap={2} className='text-xs'>
              <span className='inline-flex shrink-0 items-center gap-0.5' aria-hidden>
                {Array.from({ length: 5 }).map((_, index) => (
                  <HeroIconStar key={index} className='text-gold size-3' />
                ))}
              </span>
              <Typography.Muted className='text-xs'>
                <Text as='span' weight='semibold'>
                  {t('ratingValue', { rating: marketingNumbers.heroRating })}
                </Text>
                {' · '}
                {t('socialProof', { count: marketingNumbers.heroShopperCount })}
              </Typography.Muted>
            </Flex>

            <Flex direction='row' gap={2} className='w-full pt-1'>
              <Link href='/shop' className={cn(primaryCtaClass, 'flex-1')}>
                {t('shopNewArrivals')}
                <HeroIconArrowRight className='cn-rtl-flip size-3.5 shrink-0' />
              </Link>
              <Link href='/collections' className={cn(secondaryCtaClass, 'flex-1')}>
                {t('exploreCollections')}
              </Link>
            </Flex>
          </Flex>

          <HeroEditorialPanel />
        </Flex>
      </section>
    </Box>
  );
}
