'use client';

import { IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { useAuth } from '@/components/providers/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { useReplenishmentReminders } from '@/domains/replenishment-reminders/hooks/use-replenishment-reminders';
import { ShoppingAssistantRecommendationCard } from '@/domains/shopping-assistant/components/shopping-assistant-recommendation-card';
import { cn } from '@/lib/utils';
import type { DtoAiReplenishmentRemindersResponse } from '@/services/-ai-replenishment-reminders-post.schemas';

function urgencyBadgeClass(urgency?: string) {
  switch (urgency) {
    case 'overdue':
      return 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300';
    case 'soon':
      return 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-300';
    case 'due':
      return 'border-sky-600/30 bg-sky-500/10 text-sky-900 dark:text-sky-300';
    default:
      return 'border-border/60 bg-muted/40 text-muted-foreground';
  }
}

/** AI reorder timing from past purchases. */
export function ReplenishmentRemindersDomain() {
  const t = useTranslations('replenishmentReminders');
  const { isAuthenticated } = useAuth();
  const { fetchReminders, isPending, offlineMessage } = useReplenishmentReminders();
  const [data, setData] = useState<DtoAiReplenishmentRemindersResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const cancelled = false;

    const load = async () => {
      setError(null);
      const result = await fetchReminders();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setData(result);
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
          <IconRefresh className='text-gold-strong size-10' />
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
          <IconRefresh className='text-gold-strong size-6' />
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
        ) : data ? (
          <Flex direction='column' spacing={6}>
            {data.summary ? (
              <Typography.Text className='text-muted-foreground leading-relaxed'>
                {data.summary}
              </Typography.Text>
            ) : null}

            {data.reminders && data.reminders.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Typography.H2 className='text-sm font-semibold tracking-wide uppercase'>
                  {t('reminders')}
                </Typography.H2>
                <ul className='divide-border/60 divide-y rounded-xl border'>
                  {data.reminders.map((item) => (
                    <li key={`${item.product_id}-${item.product_name}`} className='space-y-2 p-4'>
                      <Flex className='flex-wrap items-start justify-between gap-2'>
                        <Typography.Text className='font-medium'>
                          {item.product_name}
                        </Typography.Text>
                        {item.urgency ? (
                          <Badge
                            variant='outline'
                            className={cn(
                              'rounded-full capitalize',
                              urgencyBadgeClass(item.urgency)
                            )}
                          >
                            {t(`urgency.${item.urgency}`)}
                          </Badge>
                        ) : null}
                      </Flex>
                      {item.message ? (
                        <Typography.Muted className='text-sm leading-relaxed'>
                          {item.message}
                        </Typography.Muted>
                      ) : null}
                      {item.days_since_order != null && item.days_since_order > 0 ? (
                        <Typography.Muted className='text-xs'>
                          {t('daysSince', { count: item.days_since_order })}
                        </Typography.Muted>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Flex>
            ) : null}

            {data.recommendations && data.recommendations.length > 0 ? (
              <Flex direction='column' spacing={3}>
                <Typography.H2 className='text-sm font-semibold tracking-wide uppercase'>
                  {t('picks')}
                </Typography.H2>
                <Flex direction='column' spacing={3}>
                  {data.recommendations.map((item) => (
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
