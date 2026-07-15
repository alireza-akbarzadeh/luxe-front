'use client';

import { IconCheck, IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';

interface NotificationsHeaderProps {
  total: number;
  unreadCount: number;
  isMarkingAllRead: boolean;
  onMarkAllRead: () => void;
  onRefresh: () => void;
}

export function NotificationsHeader({
  total,
  unreadCount,
  isMarkingAllRead,
  onMarkAllRead,
  onRefresh
}: NotificationsHeaderProps) {
  const t = useTranslations('notifications.inbox');

  return (
    <Flex align='start' justify='between' gap={4} className='flex-wrap md:flex-row'>
      <div>
        <Typography.H2 className='font-display text-3xl font-semibold tracking-tight sm:text-4xl'>
          {t('title')}
        </Typography.H2>
        <Text variant='muted' className='mt-2 max-w-2xl text-sm'>
          {t('subtitle')}
        </Text>
        <Text variant='muted' className='mt-1 text-xs'>
          {t('summary', { total, unread: unreadCount })}
        </Text>
      </div>

      <Flex align='center' gap={2} className='shrink-0 flex-row'>
        <Button
          variant='outline'
          className='border-gold/30 hover:bg-gold/10 rounded-full'
          disabled={isMarkingAllRead || unreadCount === 0}
          onClick={onMarkAllRead}
        >
          <IconCheck className='size-4' />
          {t('markAllRead')}
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='rounded-full'
          aria-label={t('refreshAria')}
          onClick={onRefresh}
        >
          <IconRefresh className='size-4' />
        </Button>
      </Flex>
    </Flex>
  );
}
