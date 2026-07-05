'use client';

import { IconAlertTriangle, IconBrain, IconSparkles } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import { useShoppingMemory } from '@/domains/shopping-memory/hooks/use-shopping-memory';
import type { DtoAiShoppingMemoryResponse } from '@/services/-ai-shopping-memory-post.schemas';

/** AI summary of browsing taste and matching product picks. */
export function ShoppingMemoryDomain() {
  const t = useTranslations('shoppingMemory');
  const { isAuthenticated } = useAuth();
  const { fetchShoppingMemory, isPending, offlineMessage } = useShoppingMemory();
  const [memory, setMemory] = useState<DtoAiShoppingMemoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const cancelled = false;

    const load = async () => {
      setError(null);
      const result = await fetchShoppingMemory();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setMemory(result);
    };

    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- auth gate only
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className='app-container py-16'>
        <Flex
          direction='column'
          align='center'
          spacing={4}
          className='mx-auto max-w-lg text-center'
        >
          <IconBrain className='text-gold-strong size-10' />
          <Typography.H1 className='font-display text-3xl font-semibold'>
            {t('guestTitle')}
          </Typography.H1>
          <Typography.Muted>{t('guestDescription')}</Typography.Muted>
          <Button asChild className='rounded-full'>
            <Link href='/login'>{t('signIn')}</Link>
          </Button>
        </Flex>
      </main>
    );
  }

  return (
    <main className='app-container py-12 pb-24'>
      <Flex direction='column' spacing={3} className='mb-8 max-w-2xl'>
        <Flex direction='row' align='center' spacing={2}>
          <IconBrain className='text-gold-strong size-6' />
          <Typography.H1 className='font-display text-3xl font-semibold tracking-tight lg:text-4xl'>
            {t('title')}
          </Typography.H1>
        </Flex>
        <Typography.Muted className='leading-relaxed'>{t('subtitle')}</Typography.Muted>
      </Flex>

      <Card className='border-border/70 rounded-2xl border p-6 sm:p-8'>
        {isPending ? (
          <Shimmer as='span' className='text-muted-foreground text-sm'>
            {t('loading')}
          </Shimmer>
        ) : error ? (
          <Flex direction='row' align='start' spacing={2}>
            <IconAlertTriangle className='text-muted-foreground mt-0.5 size-4 shrink-0' />
            <Typography.Muted className='text-sm'>{error}</Typography.Muted>
          </Flex>
        ) : memory ? (
          <Flex direction='column' spacing={6}>
            {memory.summary ? (
              <Typography.Text className='text-muted-foreground leading-relaxed'>
                {memory.summary}
              </Typography.Text>
            ) : null}

            {memory.style_notes && memory.style_notes.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Text className='text-sm font-medium'>{t('styleNotes')}</Typography.Text>
                <ul className='text-muted-foreground space-y-1.5 ps-1 text-sm'>
                  {memory.style_notes.map((note) => (
                    <li key={note} className='flex gap-2'>
                      <IconSparkles className='text-gold-strong mt-0.5 size-3.5 shrink-0' />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </Flex>
            ) : null}

            {memory.signals && memory.signals.length > 0 ? (
              <Flex direction='column' spacing={2}>
                <Typography.Text className='text-sm font-medium'>{t('signals')}</Typography.Text>
                <ul className='divide-border/60 divide-y rounded-xl border'>
                  {memory.signals.map((signal) => (
                    <li key={`${signal.label}-${signal.detail}`} className='px-4 py-3'>
                      <Typography.Text className='text-sm font-medium'>
                        {signal.label}
                      </Typography.Text>
                      <Typography.Muted className='text-xs'>{signal.detail}</Typography.Muted>
                    </li>
                  ))}
                </ul>
              </Flex>
            ) : null}

            {memory.recommendations && memory.recommendations.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Typography.Text className='text-sm font-medium'>{t('picks')}</Typography.Text>
                <Flex direction='column' spacing={2}>
                  {memory.recommendations.map((item) => (
                    <ShoppingAssistantRecommendationCard
                      key={item.product?.id ?? item.reason}
                      item={item}
                    />
                  ))}
                </Flex>
              </Flex>
            ) : null}

            <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
          </Flex>
        ) : null}
      </Card>
    </main>
  );
}
