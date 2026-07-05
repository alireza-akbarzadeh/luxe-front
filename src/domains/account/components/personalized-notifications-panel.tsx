'use client';

import { IconAlertTriangle, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Shimmer } from '@/components/ai/shimmer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { usePersonalizedNotifications } from '@/domains/account/hooks/use-personalized-notifications';
import { cn } from '@/lib/utils';
import type { DtoAiPersonalizedNotificationsResponse } from '@/services/-ai-personalized-notifications-post.schemas';

function priorityBadgeClass(priority?: string) {
  switch (priority) {
    case 'high':
      return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
    case 'medium':
      return 'border-sky-600/30 bg-sky-500/10 text-sky-900 dark:text-sky-300';
    case 'low':
      return 'border-border/60 bg-muted/40 text-muted-foreground';
    default:
      return 'border-border/60 bg-muted/40 text-muted-foreground';
  }
}

/** AI-recommended alert types on the account notifications page. */
export function PersonalizedNotificationsPanel() {
  const t = useTranslations('account.notifications.personalized');
  const { fetchSuggestions, isPending, offlineMessage } = usePersonalizedNotifications();
  const [suggestions, setSuggestions] = useState<DtoAiPersonalizedNotificationsResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setError(null);
      const result = await fetchSuggestions();
      if (cancelled) {
        return;
      }
      if (!result) {
        setError(offlineMessage);
        return;
      }
      setSuggestions(result);
    };

    void load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load once on mount
  }, []);

  if (!isPending && !error && !suggestions) {
    return null;
  }

  return (
    <Card className='border-border/70 from-card to-muted/15 rounded-2xl border bg-linear-to-br p-5 sm:p-6'>
      <Flex direction='row' align='center' spacing={2} className='mb-4'>
        <IconSparkles className='text-gold-strong size-5 shrink-0' />
        <Typography.H3 className='text-base font-semibold tracking-tight'>
          {t('title')}
        </Typography.H3>
      </Flex>

      {isPending ? (
        <Shimmer as='span' className='text-muted-foreground text-sm'>
          {t('loading')}
        </Shimmer>
      ) : error ? (
        <Flex direction='row' align='start' spacing={2}>
          <IconAlertTriangle className='text-muted-foreground mt-0.5 size-4 shrink-0' />
          <Typography.Muted className='text-sm leading-relaxed'>{error}</Typography.Muted>
        </Flex>
      ) : suggestions ? (
        <Flex direction='column' spacing={4}>
          {suggestions.summary ? (
            <Typography.Muted className='text-sm leading-relaxed'>
              {suggestions.summary}
            </Typography.Muted>
          ) : null}

          {suggestions.suggestions && suggestions.suggestions.length > 0 ? (
            <ul className='divide-border/60 divide-y rounded-xl border'>
              {suggestions.suggestions.map((item) => (
                <li
                  key={`${item.type}-${item.title}`}
                  className='flex flex-col gap-2 p-3 sm:flex-row sm:items-start sm:justify-between'
                >
                  <Flex direction='column' spacing={1} className='min-w-0'>
                    <Typography.Text className='text-sm font-medium'>{item.title}</Typography.Text>
                    {item.description ? (
                      <Typography.Muted className='text-xs leading-relaxed'>
                        {item.description}
                      </Typography.Muted>
                    ) : null}
                  </Flex>
                  <Flex className='shrink-0 flex-wrap gap-2'>
                    {item.priority ? (
                      <Badge
                        variant='outline'
                        className={cn('rounded-full capitalize', priorityBadgeClass(item.priority))}
                      >
                        {t(`priority.${item.priority}`)}
                      </Badge>
                    ) : null}
                    {item.suggested ? (
                      <Badge variant='secondary' className='rounded-full'>
                        {t('recommended')}
                      </Badge>
                    ) : null}
                  </Flex>
                </li>
              ))}
            </ul>
          ) : null}

          <Typography.Muted className='text-center text-xs'>{t('footer')}</Typography.Muted>
        </Flex>
      ) : null}
    </Card>
  );
}
