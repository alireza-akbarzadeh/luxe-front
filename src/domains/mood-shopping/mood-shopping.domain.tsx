'use client';

import { IconMoodSmile } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Textarea } from '@/components/ui/textarea';
import { Typography } from '@/components/ui/typography';
import { GiftFinderChipSelect } from '@/domains/gift-finder/components/gift-finder-chip-select';
import { useMoodShopping } from '@/domains/mood-shopping/hooks/use-mood-shopping';
import { MOOD_SHOPPING_KEYS } from '@/domains/mood-shopping/lib/mood-shopping-options';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import type { DtoAiMoodShoppingResponse } from '@/services/-ai-mood-shopping-post.schemas';
import { DynamicBreadcrumb } from '~/src/components/breadcrumb-list';

/** Mood-based discovery — pick a vibe, get style cues and catalog picks. */
export function MoodShoppingDomain() {
  const t = useTranslations('moodShopping');
  const { shopByMood, offlineMessage } = useMoodShopping();
  const [mood, setMood] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<DtoAiMoodShoppingResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!mood) {
      toast.error(t('errors.moodRequired'));
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    const response = await shopByMood({
      mood,
      context: context.trim() || undefined
    });
    setIsSubmitting(false);

    if (!response) {
      toast.error(offlineMessage);
      return;
    }
    setResult(response);
  };

  return (
    <main className='app-container py-12 pb-24'>
      <DynamicBreadcrumb
        showBackButton={false}
        items={[{ label: t('title'), href: '/mood-shopping' }]}
      />
      <Flex direction='column' spacing={3} className='mt-6 mb-8 max-w-2xl'>
        <Flex direction='row' align='center' spacing={2}>
          <IconMoodSmile className='text-gold-strong size-6' />
          <Typography.H1 className='font-display text-3xl font-semibold tracking-tight lg:text-4xl'>
            {t('title')}
          </Typography.H1>
        </Flex>
        <Typography.Muted className='leading-relaxed'>{t('subtitle')}</Typography.Muted>
      </Flex>

      <Flex direction='column' spacing={8} className='max-w-2xl'>
        <Flex direction='column' spacing={4} className='border-border/70 rounded-2xl border p-6'>
          <Typography.Text className='text-sm font-medium'>{t('fields.mood')}</Typography.Text>
          <GiftFinderChipSelect
            options={MOOD_SHOPPING_KEYS}
            value={mood}
            onChange={setMood}
            labelFor={(key) => t(`moods.${key}` as never)}
          />

          <Flex direction='column' spacing={2}>
            <Typography.Text className='text-sm font-medium'>{t('fields.context')}</Typography.Text>
            <Textarea
              className='min-h-24 rounded-xl'
              placeholder={t('fields.contextPlaceholder')}
              value={context}
              onChange={(event) => setContext(event.target.value)}
            />
          </Flex>

          <Button
            type='button'
            className='rounded-full'
            disabled={isSubmitting || !mood}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </Button>
        </Flex>

        {result ? (
          <Flex direction='column' spacing={5}>
            {result.reply ? (
              <Typography.Text className='text-muted-foreground leading-relaxed'>
                {result.reply}
              </Typography.Text>
            ) : null}

            {result.mood_tags && result.mood_tags.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Text className='text-sm font-medium'>{t('moodTags')}</Typography.Text>
                <Flex direction='row' className='flex-wrap gap-2'>
                  {result.mood_tags.map((tag) => (
                    <span
                      key={tag}
                      className='bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-xs font-medium'
                    >
                      {tag}
                    </span>
                  ))}
                </Flex>
              </Flex>
            ) : null}

            {result.style_cues && result.style_cues.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Text className='text-sm font-medium'>{t('styleCues')}</Typography.Text>
                <ul className='text-muted-foreground space-y-1.5 ps-5 text-sm'>
                  {result.style_cues.map((cue) => (
                    <li key={cue} className='list-disc'>
                      {cue}
                    </li>
                  ))}
                </ul>
              </Flex>
            ) : null}

            {result.recommendations && result.recommendations.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Typography.Text className='text-sm font-medium'>{t('picks')}</Typography.Text>
                <Flex direction='column' spacing={2}>
                  {result.recommendations.map((item) => (
                    <ShoppingAssistantRecommendationCard
                      key={item.product?.id ?? item.reason}
                      item={item}
                    />
                  ))}
                </Flex>
              </Flex>
            ) : null}

            <Typography.Muted className='text-xs'>{t('footer')}</Typography.Muted>
          </Flex>
        ) : null}
      </Flex>
    </main>
  );
}
