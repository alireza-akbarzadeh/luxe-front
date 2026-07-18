'use client';

import { IconInbox, IconSend } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/typography';
import {
  type PaginatedGiftCardsData,
  readPaginatedData
} from '@/domains/account/lib/account-list-data';
import { usePostGiftCardsCodeClaim } from '@/services/-gift-cards-{code}-claim-post';
import type { DtoCreateGiftCardResponse } from '@/services/-gift-cards-post.schemas';
import {
  getGetGiftCardsReceivedQueryKey,
  useGetGiftCardsReceived
} from '@/services/-gift-cards-received-get';
import { useGetGiftCardsSent } from '@/services/-gift-cards-sent-get';

import { GiftCardEmptyState } from '../components/gift-card-list-item';
import { GiftCardTransferDialog } from '../components/gift-card-transfer-dialog';
import { GiftCardsCardList } from '../components/gift-cards-card-list';
import { isActiveGiftCard } from '../lib/gift-card-format';

type GiftCardsMyCardsProps = {
  onBuyClick?: () => void;
};

/** Sent + received gift cards for the public gift-cards hub. */
export function GiftCardsMyCards({ onBuyClick }: GiftCardsMyCardsProps) {
  const t = useTranslations('giftCardsPage.myCards');
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const queryClient = useQueryClient();
  const [listTab, setListTab] = useState<'received' | 'sent'>('received');
  const [transferCard, setTransferCard] = useState<DtoCreateGiftCardResponse | null>(null);
  const [claimingCode, setClaimingCode] = useState<string | null>(null);

  const sentQuery = useGetGiftCardsSent(
    { limit: 20, offset: 0 },
    { query: { enabled: isAuthenticated } }
  );
  const receivedQuery = useGetGiftCardsReceived(
    { limit: 20, offset: 0 },
    { query: { enabled: isAuthenticated } }
  );
  const { mutateAsync: claimGiftCard } = usePostGiftCardsCodeClaim();

  const sentCards = readPaginatedData<PaginatedGiftCardsData>(sentQuery.data)?.gift_cards ?? [];
  const receivedCards =
    readPaginatedData<PaginatedGiftCardsData>(receivedQuery.data)?.gift_cards ?? [];

  const activeReceived = receivedCards.filter((card) =>
    isActiveGiftCard(card.status, card.balance)
  );
  const activeSent = sentCards.filter((card) => isActiveGiftCard(card.status, card.balance));

  const handleClaim = async (card: DtoCreateGiftCardResponse) => {
    if (!card.code) return;
    setClaimingCode(card.code);
    try {
      await claimGiftCard({ code: card.code });
      await queryClient.invalidateQueries({ queryKey: getGetGiftCardsReceivedQueryKey() });
      toast.success(t('claimSuccess'));
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          t('claimFailed')
      );
    } finally {
      setClaimingCode(null);
    }
  };

  if (isAuthLoading) {
    return (
      <div className='space-y-3'>
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className='bg-muted/50 h-32 animate-pulse rounded-2xl' />
        ))}
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <GiftCardEmptyState
        title={t('signInTitle')}
        description={t('signInDescription')}
        actionLabel={t('signInCta')}
        onAction={() => {
          window.location.assign('/login?redirect=%2Fgift-cards%3Ftab%3Dmine');
        }}
      />
    );
  }

  return (
    <div className='space-y-6'>
      <Flex justify='between' align='start' wrap='wrap' gap={3}>
        <div>
          <Text className='text-sm font-medium'>{t('title')}</Text>
          <Text variant='muted' className='mt-1 text-sm'>
            {t('subtitle')}
          </Text>
        </div>
        <Button asChild variant='outline' size='sm' className='rounded-full'>
          <Link href='/account?tab=giftCards'>{t('openAccount')}</Link>
        </Button>
      </Flex>

      {activeReceived.length > 0 || activeSent.length > 0 ? (
        <Text variant='muted' className='text-xs'>
          {t('activeSummary', {
            received: activeReceived.length,
            sent: activeSent.length
          })}
        </Text>
      ) : null}

      <Tabs
        value={listTab}
        onValueChange={(value) => setListTab(value as 'received' | 'sent')}
        className='space-y-4'
      >
        <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 rounded-full p-1 sm:w-auto'>
          <TabsTrigger value='received' className='gap-2 rounded-full px-4 py-2'>
            <IconInbox className='size-4' aria-hidden />
            {t('receivedTab')}
          </TabsTrigger>
          <TabsTrigger value='sent' className='gap-2 rounded-full px-4 py-2'>
            <IconSend className='size-4' aria-hidden />
            {t('sentTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='received' className='mt-0 space-y-3'>
          <GiftCardsCardList
            cards={receivedCards}
            isLoading={receivedQuery.isLoading}
            isError={receivedQuery.isError}
            onRetry={() => void receivedQuery.refetch()}
            emptyTitle={t('receivedEmptyTitle')}
            emptyDescription={t('receivedEmptyDescription')}
            variant='received'
            claimingCode={claimingCode}
            onClaim={handleClaim}
            onTransfer={setTransferCard}
            onBuyClick={onBuyClick}
            buyLabel={t('buyCta')}
            retryLabel={t('retry')}
            loadError={t('loadError')}
          />
        </TabsContent>

        <TabsContent value='sent' className='mt-0 space-y-3'>
          <GiftCardsCardList
            cards={sentCards}
            isLoading={sentQuery.isLoading}
            isError={sentQuery.isError}
            onRetry={() => void sentQuery.refetch()}
            emptyTitle={t('sentEmptyTitle')}
            emptyDescription={t('sentEmptyDescription')}
            variant='sent'
            onTransfer={setTransferCard}
            onBuyClick={onBuyClick}
            buyLabel={t('buyCta')}
            retryLabel={t('retry')}
            loadError={t('loadError')}
          />
        </TabsContent>
      </Tabs>

      <GiftCardTransferDialog
        card={transferCard}
        open={transferCard != null}
        onOpenChange={(open) => {
          if (!open) setTransferCard(null);
        }}
      />
    </div>
  );
}
