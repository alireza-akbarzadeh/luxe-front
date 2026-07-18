'use client';

import { IconGift, IconSparkles } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text, Typography } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { cn } from '@/lib/utils';
import type { DtoCreateGiftCardResponse } from '@/services/-gift-cards-post.schemas';

import { formatGiftCardDate, isActiveGiftCard } from '../lib/gift-card-format';

type GiftCardListItemProps = {
  card: DtoCreateGiftCardResponse;
  variant: 'sent' | 'received';
  onTransfer?: (card: DtoCreateGiftCardResponse) => void;
  onClaim?: (card: DtoCreateGiftCardResponse) => void;
  claiming?: boolean;
};

/** Single gift card row — highlighted when active with remaining balance. */
export function GiftCardListItem({
  card,
  variant,
  onTransfer,
  onClaim,
  claiming
}: GiftCardListItemProps) {
  const t = useTranslations('giftCardsPage.myCards');
  const active = isActiveGiftCard(card.status, card.balance);
  const amount = card.balance ?? card.initial_amount ?? 0;

  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border transition-shadow',
        active
          ? 'border-accent/40 from-accent/10 via-card to-card bg-linear-to-br shadow-sm'
          : 'border-border/60 bg-card/60'
      )}
    >
      <div className='p-5 sm:p-6'>
        <Flex justify='between' align='start' wrap='wrap' gap={3}>
          <Flex direction='column' gap={1} className='min-w-0'>
            {active ? (
              <Flex align='center' gap={2} className='text-accent'>
                <IconSparkles className='size-3.5 shrink-0' aria-hidden />
                <Text className='text-xs font-semibold tracking-wide uppercase'>
                  {t('activeLabel')}
                </Text>
              </Flex>
            ) : null}
            <Text className='text-2xl font-semibold tabular-nums'>{formatPrice(amount)}</Text>
            <Text variant='muted' className='font-mono text-sm tracking-wide'>
              {card.code}
            </Text>
          </Flex>
          {card.status ? (
            <Badge variant={active ? 'default' : 'outline'} className='capitalize'>
              {card.status}
            </Badge>
          ) : null}
        </Flex>

        <div className='mt-4 grid gap-2 text-sm sm:grid-cols-2'>
          {variant === 'sent' ? (
            <>
              <Text variant='muted'>
                {t('toRecipient', {
                  name: card.recipient_name ?? card.recipient_email ?? '—'
                })}
              </Text>
              <Text variant='muted'>
                {t('createdOn', { date: formatGiftCardDate(card.created_at) ?? '—' })}
              </Text>
            </>
          ) : (
            <>
              <Text variant='muted'>{t('fromSender', { name: card.sender_name ?? '—' })}</Text>
              <Text variant='muted'>
                {t('expiresOn', { date: formatGiftCardDate(card.expires_at) ?? '—' })}
              </Text>
            </>
          )}
        </div>

        {card.message ? (
          <Text variant='muted' className='mt-3 line-clamp-2 text-sm italic'>
            &ldquo;{card.message}&rdquo;
          </Text>
        ) : null}

        <Flex wrap='wrap' gap={2} className='mt-4'>
          {variant === 'received' && !card.recipient_user_id && card.code && onClaim ? (
            <Button
              variant='outline'
              size='sm'
              className='rounded-full'
              disabled={claiming}
              onClick={() => onClaim(card)}
            >
              {claiming ? t('claiming') : t('claimCard')}
            </Button>
          ) : null}
          {active && card.code && onTransfer ? (
            <Button
              variant='secondary'
              size='sm'
              className='rounded-full'
              onClick={() => onTransfer(card)}
            >
              {t('transfer')}
            </Button>
          ) : null}
        </Flex>
      </div>
    </article>
  );
}

type GiftCardEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** Empty state when the shopper has no gift cards in a list. */
export function GiftCardEmptyState({
  title,
  description,
  actionLabel,
  onAction
}: GiftCardEmptyStateProps) {
  return (
    <div className='border-border/60 bg-card/40 rounded-3xl border border-dashed p-10 text-center sm:p-14'>
      <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
        <IconGift className='text-muted-foreground size-8' aria-hidden />
      </div>
      <Typography.H4 className='font-display'>{title}</Typography.H4>
      <Text variant='muted' className='mx-auto mt-2 max-w-sm text-sm leading-relaxed'>
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button className='mt-6 gap-2 rounded-full' onClick={onAction}>
          <IconGift className='size-4' aria-hidden />
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
