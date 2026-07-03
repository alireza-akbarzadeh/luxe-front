'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiGiftFinderResponse } from '@/services/-ai-gift-finder-post.schemas';

type GiftFinderResultsProps = {
  result: DtoAiGiftFinderResponse;
  onStartOver: () => void;
};

/** AI gift picks, message ideas, and restart action. */
export function GiftFinderResults({ result, onStartOver }: GiftFinderResultsProps) {
  const t = useTranslations('giftFinder.results');
  const recommendations = result.recommendations ?? [];
  const messageIdeas = result.gift_message_ideas ?? [];

  return (
    <Flex direction='column' spacing={6}>
      <Flex direction='column' spacing={3}>
        <Typography.H2 className='text-2xl font-semibold tracking-tight'>
          {t('title')}
        </Typography.H2>
        {result.reply ? (
          <Typography.Text className='text-muted-foreground leading-relaxed'>
            {result.reply}
          </Typography.Text>
        ) : null}
      </Flex>

      {messageIdeas.length > 0 ? (
        <Flex direction='column' spacing={2}>
          <Typography.Overline className='text-muted-foreground'>
            {t('messageIdeas')}
          </Typography.Overline>
          <Flex direction='column' spacing={2}>
            {messageIdeas.map((idea) => (
              <Flex key={idea} className='border-border bg-muted/40 rounded-xl border px-4 py-3'>
                <Typography.Text className='text-sm italic'>&ldquo;{idea}&rdquo;</Typography.Text>
              </Flex>
            ))}
          </Flex>
        </Flex>
      ) : null}

      {recommendations.length > 0 ? (
        <Flex direction='column' spacing={3}>
          <Typography.Overline className='text-muted-foreground'>{t('picks')}</Typography.Overline>
          <Flex direction='column' spacing={2}>
            {recommendations.map((item) => (
              <ShoppingAssistantRecommendationCard
                key={item.product?.id ?? item.reason}
                item={item}
              />
            ))}
          </Flex>
        </Flex>
      ) : (
        <Typography.Muted className='text-sm'>{t('empty')}</Typography.Muted>
      )}

      <Button type='button' variant='outline' className='rounded-2xl' onClick={onStartOver}>
        {t('startOver')}
      </Button>
    </Flex>
  );
}
