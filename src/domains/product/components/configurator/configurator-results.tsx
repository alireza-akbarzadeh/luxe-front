'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiProductConfiguratorResponse } from '@/services/-ai-product-configurator-post.schemas';

import { formatAttributeLabel } from '../../lib/product-attribute.utils';
import { VisualizationResultList } from '../visualization/visualization-result-list';

interface ConfiguratorResultsProps {
  result: DtoAiProductConfiguratorResponse;
  onApply: () => void;
  onStartOver: () => void;
}

/** AI configurator output with apply-to-variants action. */
export function ConfiguratorResults({ result, onApply, onStartOver }: ConfiguratorResultsProps) {
  const t = useTranslations('pdp.configurator');

  return (
    <Flex direction='column' spacing={5} className='max-h-[50vh] overflow-y-auto pe-1'>
      <Typography.Text className='leading-relaxed'>{result.summary}</Typography.Text>

      {result.selections && result.selections.length > 0 ? (
        <Flex direction='column' spacing={3}>
          <Typography.Text className='font-medium'>{t('recommendedOptions')}</Typography.Text>
          <ul className='space-y-3'>
            {result.selections.map((selection) => (
              <li
                key={`${selection.attribute}-${selection.value}`}
                className='border-border rounded-2xl border px-4 py-3'
              >
                <Flex
                  direction='row'
                  align='center'
                  justify='between'
                  spacing={3}
                  className='flex-wrap'
                >
                  <Typography.Text className='text-sm font-medium'>
                    {formatAttributeLabel(selection.attribute)}
                  </Typography.Text>
                  <Typography.Text className='text-sm'>{selection.value}</Typography.Text>
                </Flex>
                {selection.reason ? (
                  <Typography.Muted className='mt-1 text-xs leading-relaxed'>
                    {selection.reason}
                  </Typography.Muted>
                ) : null}
              </li>
            ))}
          </ul>
        </Flex>
      ) : null}

      <VisualizationResultList title={t('tips')} items={result.tips} />

      {result.add_ons && result.add_ons.length > 0 ? (
        <Flex direction='column' spacing={3}>
          <Typography.Text className='font-medium'>{t('addOns')}</Typography.Text>
          {result.add_ons.map((item) => (
            <ShoppingAssistantRecommendationCard
              key={item.product?.id ?? item.reason}
              item={item}
            />
          ))}
        </Flex>
      ) : null}

      <Flex direction='row' spacing={2}>
        <Button type='button' variant='outline' className='flex-1' onClick={onStartOver}>
          {t('startOver')}
        </Button>
        <Button
          type='button'
          className='flex-1'
          onClick={onApply}
          disabled={!result.selections?.length}
        >
          {t('applyConfiguration')}
        </Button>
      </Flex>
    </Flex>
  );
}
