'use client';

import { IconCamera, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useSearchStore } from '@/domains/search/search.store';

/** Shows how AI interpreted an uploaded visual search image. */
export function SearchVisualBanner() {
  const t = useTranslations('search.visual');
  const interpretation = useSearchStore((state) => state.visualInterpretation);
  const imagePreview = useSearchStore((state) => state.visualImagePreview);
  const clearVisualContext = useSearchStore((state) => state.clearVisualContext);

  if (!interpretation) {
    return null;
  }

  return (
    <Flex
      direction='row'
      align='start'
      spacing={3}
      className='border-gold/25 bg-gold/8 mb-6 rounded-2xl border px-4 py-3'
    >
      {imagePreview ? (
        <div className='relative mt-0.5 size-14 shrink-0 overflow-hidden rounded-xl border'>
          <AppImage src={imagePreview} alt='' fill sizes='56px' className='object-cover' />
        </div>
      ) : (
        <Flex
          align='center'
          justify='center'
          className='bg-gold/15 mt-0.5 size-10 shrink-0 rounded-full'
        >
          <IconCamera className='text-gold-strong size-4' />
        </Flex>
      )}
      <Flex direction='column' spacing={1} className='min-w-0 flex-1'>
        <Typography.Small weight='semibold' className='block'>
          {t('bannerTitle')}
        </Typography.Small>
        <Typography.Muted className='text-sm leading-relaxed'>{interpretation}</Typography.Muted>
      </Flex>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='size-8 shrink-0'
        onClick={clearVisualContext}
        aria-label={t('dismiss')}
      >
        <IconX className='size-4' />
      </Button>
    </Flex>
  );
}
