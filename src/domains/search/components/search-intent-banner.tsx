'use client';

import { IconSparkles, IconX } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useSearchStore } from '@/domains/search/search.store';

/** Shows how AI interpreted a natural-language search query. */
export function SearchIntentBanner() {
  const t = useTranslations('search.intent');
  const interpretation = useSearchStore((state) => state.intentInterpretation);
  const naturalQuery = useSearchStore((state) => state.naturalQuery);
  const clearIntentContext = useSearchStore((state) => state.clearIntentContext);

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
      <Flex
        align='center'
        justify='center'
        className='bg-gold/15 mt-0.5 size-8 shrink-0 rounded-full'
      >
        <IconSparkles className='text-gold-strong size-4' />
      </Flex>
      <Flex direction='column' spacing={1} className='min-w-0 flex-1'>
        <Typography.Small weight='semibold' className='block'>
          {t('title')}
        </Typography.Small>
        <Typography.Muted className='text-sm leading-relaxed'>{interpretation}</Typography.Muted>
        {naturalQuery ? (
          <Typography.Subtle className='line-clamp-2 text-xs italic'>
            {t('original', { query: naturalQuery })}
          </Typography.Subtle>
        ) : null}
      </Flex>
      <Button
        type='button'
        variant='ghost'
        size='icon'
        className='size-8 shrink-0'
        onClick={clearIntentContext}
        aria-label={t('dismiss')}
      >
        <IconX className='size-4' />
      </Button>
    </Flex>
  );
}
