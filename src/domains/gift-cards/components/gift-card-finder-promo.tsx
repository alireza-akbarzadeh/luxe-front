'use client';

import { IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

/** CTA on the gift cards hub — routes shoppers to the AI gift finder. */
export function GiftCardFinderPromo() {
  const t = useTranslations('giftCardsPage.finderPromo');

  return (
    <Flex
      align='start'
      justify='between'
      spacing={4}
      className='border-gold/30 from-gold/10 via-card to-card relative overflow-hidden rounded-3xl border bg-linear-to-br p-6 sm:items-center sm:p-8'
    >
      <div
        aria-hidden
        className='bg-accent/20 pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl'
      />
      <Flex direction='column' spacing={2} className='relative max-w-xl'>
        <Flex align='center' spacing={2}>
          <IconSparkles className='text-gold-strong size-5 shrink-0' aria-hidden />
          <Typography.H3 className='text-xl font-semibold'>{t('title')}</Typography.H3>
        </Flex>
        <Typography.Muted className='text-sm leading-relaxed sm:text-base'>
          {t('description')}
        </Typography.Muted>
      </Flex>
      <Button asChild size='lg' className='relative shrink-0 rounded-full'>
        <Link href='/gift-cards/finder'>{t('cta')}</Link>
      </Button>
    </Flex>
  );
}
