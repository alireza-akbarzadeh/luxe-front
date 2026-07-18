'use client';

import { IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

type GiftCardFinderPromoProps = {
  /** Vertical stack for the gift-cards page sidebar. */
  variant?: 'banner' | 'sidebar';
};

/** CTA on the gift cards hub — routes shoppers to the AI gift finder. */
export function GiftCardFinderPromo({ variant = 'banner' }: GiftCardFinderPromoProps) {
  const t = useTranslations('giftCardsPage.finderPromo');
  const isSidebar = variant === 'sidebar';

  return (
    <Flex
      direction={isSidebar ? 'column' : 'row'}
      align={isSidebar ? 'stretch' : 'start'}
      justify={isSidebar ? 'start' : 'between'}
      spacing={isSidebar ? 6 : 4}
      className={cn(
        'border-gold/30 from-gold/10 via-card to-card relative overflow-hidden rounded-3xl border bg-linear-to-br',
        isSidebar ? 'min-h-72 p-8 sm:min-h-80 sm:p-10' : 'p-6 sm:items-center sm:p-8'
      )}
    >
      <div
        aria-hidden
        className={cn(
          'bg-accent/20 pointer-events-none absolute rounded-full blur-3xl',
          isSidebar ? '-top-20 -right-12 h-56 w-56' : '-top-16 -right-16 h-40 w-40'
        )}
      />
      <Flex direction='column' spacing={isSidebar ? 3 : 2} className='relative'>
        <Flex align='center' spacing={2}>
          <IconSparkles
            className={cn('text-gold-strong shrink-0', isSidebar ? 'size-6' : 'size-5')}
            aria-hidden
          />
          <Typography.H3 className={cn('font-semibold', isSidebar ? 'text-2xl' : 'text-xl')}>
            {t('title')}
          </Typography.H3>
        </Flex>
        <Typography.Muted
          className={cn('leading-relaxed', isSidebar ? 'text-base sm:text-lg' : 'text-sm sm:text-base')}
        >
          {t('description')}
        </Typography.Muted>
      </Flex>
      <Button
        asChild
        size='lg'
        className={cn('relative rounded-full', isSidebar ? 'w-full' : 'shrink-0')}
      >
        <Link href='/gift-cards/finder'>{t('cta')}</Link>
      </Button>
    </Flex>
  );
}
