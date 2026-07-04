'use client';

import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { DynamicBreadcrumb } from '@/components/breadcrumb-list';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';

import { GiftFinderWizard } from './components/gift-finder-wizard';
import { useGiftFinderStore } from './stores/gift-finder-store';

/** Guided AI gift recommendation experience — recipient, occasion, budget, and style. */
export function GiftFinderDomain() {
  const t = useTranslations('giftFinder');

  useEffect(() => {
    useGiftFinderStore.getState().reset();
  }, []);

  return (
    <main className='pb-24'>
      <div className='app-container pt-24'>
        <DynamicBreadcrumb
          items={[
            { label: t('parentBreadcrumb'), href: '/gift-cards' },
            { label: t('breadcrumb') }
          ]}
          direction='column'
          separator={<IconChevronRight className='h-3 w-3' />}
          className='text-muted-foreground text-xs'
          breadcrumbClassName='flex items-center gap-1.5'
        />

        <Flex direction='column' spacing={3} className='mt-10 max-w-2xl'>
          <Typography.Overline className='text-gold-strong tracking-[0.2em] uppercase'>
            {t('eyebrow')}
          </Typography.Overline>
          <Typography.H1 className='font-display text-4xl font-bold tracking-tight lg:text-5xl'>
            {t('title')}
          </Typography.H1>
          <Typography.Muted className='text-base leading-relaxed'>{t('subtitle')}</Typography.Muted>
          <Link
            href='/gift-cards'
            className='text-accent hover:text-accent/80 text-sm font-medium transition-colors'
          >
            {t('giftCardLink')} →
          </Link>
        </Flex>
      </div>

      <div className='app-container mt-12 max-w-2xl lg:mt-16'>
        <GiftFinderWizard />
      </div>
    </main>
  );
}
