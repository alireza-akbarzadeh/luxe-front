'use client';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/typography';
import type { DtoCreateGiftCardResponse } from '@/services/-gift-cards-post.schemas';

import { GiftCardEmptyState, GiftCardListItem } from '../components/gift-card-list-item';
import { isActiveGiftCard } from '../lib/gift-card-format';

type GiftCardsCardListProps = {
  cards: DtoCreateGiftCardResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription: string;
  variant: 'sent' | 'received';
  claimingCode?: string | null;
  onClaim?: (card: DtoCreateGiftCardResponse) => void;
  onTransfer?: (card: DtoCreateGiftCardResponse) => void;
  onBuyClick?: () => void;
  buyLabel: string;
  retryLabel: string;
  loadError: string;
};

/** Loading / error / empty / populated list for sent or received gift cards. */
export function GiftCardsCardList({
  cards,
  isLoading,
  isError,
  onRetry,
  emptyTitle,
  emptyDescription,
  variant,
  claimingCode,
  onClaim,
  onTransfer,
  onBuyClick,
  buyLabel,
  retryLabel,
  loadError
}: GiftCardsCardListProps) {
  if (isLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className='bg-muted/50 h-32 animate-pulse rounded-2xl' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='border-border rounded-2xl border p-8 text-center'>
        <Text className='text-destructive text-sm font-medium'>{loadError}</Text>
        <Button variant='outline' size='sm' className='mt-4 rounded-full' onClick={onRetry}>
          {retryLabel}
        </Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <GiftCardEmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={onBuyClick ? buyLabel : undefined}
        onAction={onBuyClick}
      />
    );
  }

  const sorted = [...cards].sort((a, b) => {
    const aActive = isActiveGiftCard(a.status, a.balance) ? 1 : 0;
    const bActive = isActiveGiftCard(b.status, b.balance) ? 1 : 0;
    return bActive - aActive;
  });

  return (
    <div className='space-y-3'>
      {sorted.map((card) => (
        <GiftCardListItem
          key={card.id ?? card.code}
          card={card}
          variant={variant}
          claiming={claimingCode === card.code}
          onClaim={onClaim}
          onTransfer={onTransfer}
        />
      ))}
    </div>
  );
}
