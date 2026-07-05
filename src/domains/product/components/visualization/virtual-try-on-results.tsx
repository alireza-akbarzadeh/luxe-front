'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiVirtualTryOnResponse } from '@/services/-ai-virtual-try-on-post.schemas';

import { VisualizationResultList } from './visualization-result-list';

interface VirtualTryOnResultsProps {
  result: DtoAiVirtualTryOnResponse;
}

export function VirtualTryOnResults({ result }: VirtualTryOnResultsProps) {
  const t = useTranslations('pdp.virtualTryOn');

  return (
    <Flex direction='column' spacing={5} className='max-h-[50vh] overflow-y-auto pe-1'>
      <Flex direction='row' align='center' spacing={2} className='flex-wrap'>
        <Typography.Text className='font-medium capitalize'>
          {t('styleMatch', { match: result.style_match ?? 'mixed' })}
        </Typography.Text>
        <Typography.Muted className='text-xs capitalize'>
          {t('confidence', { level: result.confidence ?? 'medium' })}
        </Typography.Muted>
      </Flex>
      <Typography.Text className='leading-relaxed'>{result.summary}</Typography.Text>
      {result.fit_notes ? (
        <Typography.Muted className='text-sm leading-relaxed'>{result.fit_notes}</Typography.Muted>
      ) : null}
      <VisualizationResultList title={t('tips')} items={result.tips} />
      {result.recommendations && result.recommendations.length > 0 ? (
        <Flex direction='column' spacing={3}>
          <Typography.Text className='font-medium'>{t('alternatives')}</Typography.Text>
          {result.recommendations.map((item) => (
            <ShoppingAssistantRecommendationCard
              key={item.product?.id ?? item.reason}
              item={item}
            />
          ))}
        </Flex>
      ) : null}
    </Flex>
  );
}
