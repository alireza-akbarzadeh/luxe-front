'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiRoomPreviewResponse } from '@/services/-ai-room-preview-post.schemas';

import { VisualizationResultList } from './visualization-result-list';

interface RoomPreviewResultsProps {
  result: DtoAiRoomPreviewResponse;
}

export function RoomPreviewResults({ result }: RoomPreviewResultsProps) {
  const t = useTranslations('pdp.roomPreview');

  return (
    <Flex direction='column' spacing={5} className='max-h-[50vh] overflow-y-auto pe-1'>
      <Typography.Text className='leading-relaxed'>{result.summary}</Typography.Text>
      {result.scale_advice ? (
        <Typography.Muted className='text-sm leading-relaxed'>
          {result.scale_advice}
        </Typography.Muted>
      ) : null}
      <VisualizationResultList title={t('placementTips')} items={result.placement_tips} />
      <VisualizationResultList title={t('harmonyNotes')} items={result.harmony_notes} />
      <VisualizationResultList title={t('warnings')} items={result.warnings} />
      {result.recommendations && result.recommendations.length > 0 ? (
        <Flex direction='column' spacing={3}>
          <Typography.Text className='font-medium'>{t('recommendations')}</Typography.Text>
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
