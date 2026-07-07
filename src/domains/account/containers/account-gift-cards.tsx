'use client';

import {
  IconChevronLeft,
  IconChevronRight,
  IconGift,
  IconInbox,
  IconSend
} from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { startOfToday } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text, Typography } from '@/components/ui/typography';
import { GiftCardTransferDialog } from '@/domains/gift-cards/components/gift-card-transfer-dialog';
import { GIFT_CARD_AMOUNTS, giftCardPurchaseSchema } from '@/domains/gift-cards/gift-cards.schema';
import {
  formatGiftCardDeliveryDate,
  redirectToGiftCardCheckout
} from '@/domains/gift-cards/lib/gift-card-checkout';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { usePostGiftCardsCodeClaim } from '@/services/-gift-cards-{code}-claim-post';
import { usePostGiftCards } from '@/services/-gift-cards-post';
import type { DtoCreateGiftCardResponse } from '@/services/-gift-cards-post.schemas';
import {
  getGetGiftCardsReceivedQueryKey,
  useGetGiftCardsReceived
} from '@/services/-gift-cards-received-get';
import { useGetGiftCardsSent } from '@/services/-gift-cards-sent-get';
import { AppDialog } from '~/src/components/app-dialog';

import { type PaginatedGiftCardsData, readPaginatedData } from '../lib/account-list-data';

const PAGE_SIZE = 8;

function formatGiftCardDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function AccountGiftCards() {
  const [section, setSection] = useState<'sent' | 'received'>('sent');
  const [sentPage, setSentPage] = useState(0);
  const [receivedPage, setReceivedPage] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [claimingCode, setClaimingCode] = useState<string | null>(null);
  const [transferCard, setTransferCard] = useState<DtoCreateGiftCardResponse | null>(null);
  const queryClient = useQueryClient();
  const t = useTranslations('account.giftCards');
  const tCommon = useTranslations('account.common');

  const sentOffset = sentPage * PAGE_SIZE;
  const receivedOffset = receivedPage * PAGE_SIZE;

  const sentQuery = useGetGiftCardsSent({ limit: PAGE_SIZE, offset: sentOffset });
  const receivedQuery = useGetGiftCardsReceived({ limit: PAGE_SIZE, offset: receivedOffset });

  const sentData = readPaginatedData<PaginatedGiftCardsData>(sentQuery.data);
  const receivedData = readPaginatedData<PaginatedGiftCardsData>(receivedQuery.data);

  const sentCards = sentData?.gift_cards ?? [];
  const sentTotal = sentData?.total ?? 0;
  const sentTotalPages = Math.max(1, Math.ceil(sentTotal / PAGE_SIZE));

  const receivedCards = receivedData?.gift_cards ?? [];
  const receivedTotal = receivedData?.total ?? 0;
  const receivedTotalPages = Math.max(1, Math.ceil(receivedTotal / PAGE_SIZE));

  const activeQuery = section === 'sent' ? sentQuery : receivedQuery;
  const activePage = section === 'sent' ? sentPage : receivedPage;
  const activeTotalPages = section === 'sent' ? sentTotalPages : receivedTotalPages;
  const setActivePage = section === 'sent' ? setSentPage : setReceivedPage;
  const activeTotal = section === 'sent' ? sentTotal : receivedTotal;

  const { mutateAsync: createGiftCard, isPending: isCreating } = usePostGiftCards();
  const { mutateAsync: claimGiftCard } = usePostGiftCardsCodeClaim();

  const createForm = useAppForm({
    defaultValues: {
      amount: 100,
      recipientEmail: '',
      recipientName: '',
      senderName: '',
      message: '',
      deliveryDate: ''
    },
    validators: zodFormValidators(giftCardPurchaseSchema),
    onSubmit: async ({ value }) => {
      try {
        const result = await createGiftCard({
          data: {
            amount: value.amount,
            recipient_email: value.recipientEmail,
            recipient_name: value.recipientName,
            sender_name: value.senderName,
            message: value.message || undefined,
            delivery_date: formatGiftCardDeliveryDate(value.deliveryDate)
          }
        });

        if (redirectToGiftCardCheckout(result.data)) {
          return;
        }

        toast.error(t('paymentRequired'));
      } catch (error) {
        toast.error(
          (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
            t('createFailed')
        );
      }
    }
  });

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

  const selectAmount = (amount: number) => {
    setSelectedAmount(amount);
    createForm.setFieldValue('amount', amount);
  };

  return (
    <div className='space-y-6'>
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div>
          <Typography.H3>{t('title')}</Typography.H3>
          <Text variant='muted' className='mt-1 text-sm'>
            {t('subtitle')}
          </Text>
        </div>
        <Button className='gap-2' onClick={() => setCreateOpen(true)}>
          <IconGift className='h-4 w-4' />
          {t('createGiveaway')}
        </Button>
      </div>

      <Tabs
        value={section}
        onValueChange={(value) => setSection(value as 'sent' | 'received')}
        className='space-y-6'
      >
        <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 rounded-full p-1 sm:w-auto'>
          <TabsTrigger value='sent' className='gap-2 rounded-full px-5 py-2.5'>
            <IconSend className='h-4 w-4' />
            {t('sentTab')}
          </TabsTrigger>
          <TabsTrigger value='received' className='gap-2 rounded-full px-5 py-2.5'>
            <IconInbox className='h-4 w-4' />
            {t('receivedTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value='sent' className='space-y-4'>
          <GiftCardList
            cards={sentCards}
            isLoading={sentQuery.isLoading}
            isError={sentQuery.isError}
            emptyTitle={t('sentEmptyTitle')}
            emptyDescription={t('sentEmptyDescription')}
            emptyActionLabel={t('createGiveaway')}
            onEmptyAction={() => setCreateOpen(true)}
            onRetry={() => void sentQuery.refetch()}
            variant='sent'
            onTransfer={(card) => setTransferCard(card)}
            t={t}
            tCommon={tCommon}
          />
        </TabsContent>

        <TabsContent value='received' className='space-y-4'>
          <GiftCardList
            cards={receivedCards}
            isLoading={receivedQuery.isLoading}
            isError={receivedQuery.isError}
            emptyTitle={t('receivedEmptyTitle')}
            emptyDescription={t('receivedEmptyDescription')}
            onRetry={() => void receivedQuery.refetch()}
            variant='received'
            claimingCode={claimingCode}
            onClaim={handleClaim}
            onTransfer={(card) => setTransferCard(card)}
            t={t}
            tCommon={tCommon}
          />
        </TabsContent>
      </Tabs>

      {activeTotal > PAGE_SIZE && !activeQuery.isLoading && !activeQuery.isError ? (
        <div className='flex items-center justify-between gap-4'>
          <Text variant='muted' className='text-sm'>
            {tCommon('pageOf', { current: activePage + 1, total: activeTotalPages })}
          </Text>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              disabled={activePage === 0}
              onClick={() => setActivePage((current) => Math.max(0, current - 1))}
            >
              <IconChevronLeft className='h-4 w-4' />
              {tCommon('previous')}
            </Button>
            <Button
              variant='outline'
              size='sm'
              disabled={activePage + 1 >= activeTotalPages}
              onClick={() => setActivePage((current) => current + 1)}
            >
              {tCommon('next')}
              <IconChevronRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      ) : null}

      <AppDialog
        contentClassName='max-h-[90vh] overflow-y-auto sm:max-w-lg'
        open={createOpen}
        onOpenChange={setCreateOpen}
        title={t('createDialogTitle')}
        description={t('createDialogDescription')}
      >
        <>
          <div className='mb-4'>
            <Text className='mb-3 text-sm font-medium'>{t('selectAmount')}</Text>
            <div className='flex flex-wrap gap-2'>
              {GIFT_CARD_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type='button'
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  className='rounded-full tabular-nums'
                  onClick={() => selectAmount(amount)}
                >
                  {formatPrice(amount)}
                </Button>
              ))}
            </div>
          </div>
          <createForm.Root
            onSubmit={(e) => {
              e.preventDefault();
              createForm.handleSubmit();
            }}
            className='space-y-4'
          >
            <div className='grid gap-4 sm:grid-cols-2'>
              <createForm.AppField
                name='senderName'
                children={(field) => (
                  <field.TextField
                    label={t('senderName')}
                    placeholder={t('senderNamePlaceholder')}
                    required
                  />
                )}
              />
              <createForm.AppField
                name='recipientName'
                children={(field) => (
                  <field.TextField
                    label={t('recipientName')}
                    placeholder={t('recipientNamePlaceholder')}
                    required
                  />
                )}
              />
            </div>

            <createForm.AppField
              name='recipientEmail'
              children={(field) => (
                <field.TextField
                  label={t('recipientEmail')}
                  placeholder={t('recipientEmailPlaceholder')}
                  type='email'
                  required
                />
              )}
            />

            <div className='grid gap-4 sm:grid-cols-2'>
              <createForm.AppField
                name='deliveryDate'
                children={(field) => (
                  <field.DatePicker
                    label={t('deliveryDate')}
                    calendar={{ disabled: { before: startOfToday() } }}
                  />
                )}
              />
              <createForm.AppField
                name='message'
                children={(field) => (
                  <field.TextField label={t('message')} placeholder={t('messagePlaceholder')} />
                )}
              />
            </div>

            <createForm.Subscribe
              selector={(state) => [state.isSubmitting]}
              children={([isSubmitting]) => (
                <Button type='submit' disabled={isSubmitting || isCreating} className='w-full'>
                  {t('createSubmit', { amount: formatPrice(selectedAmount) })}
                </Button>
              )}
            />
          </createForm.Root>
        </>
      </AppDialog>

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

function GiftCardList({
  cards,
  isLoading,
  isError,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  onRetry,
  variant,
  claimingCode,
  onClaim,
  onTransfer,
  t,
  tCommon
}: {
  cards: DtoCreateGiftCardResponse[];
  isLoading: boolean;
  isError: boolean;
  emptyTitle: string;
  emptyDescription: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  onRetry: () => void;
  variant: 'sent' | 'received';
  claimingCode?: string | null;
  onClaim?: (card: DtoCreateGiftCardResponse) => void;
  onTransfer?: (card: DtoCreateGiftCardResponse) => void;
  t: ReturnType<typeof useTranslations<'account.giftCards'>>;
  tCommon: ReturnType<typeof useTranslations<'account.common'>>;
}) {
  if (isLoading) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='bg-muted/60 h-28 animate-pulse rounded-xl' />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center'>
        <Text tone='destructive' className='font-medium'>
          {t('loadError')}
        </Text>
        <Text variant='muted' className='mt-2 text-sm'>
          {tCommon('connectionError')}
        </Text>
        <Button variant='outline' className='mt-5' onClick={onRetry}>
          {tCommon('retry')}
        </Button>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className='bg-card border-border rounded-2xl border p-10 text-center sm:p-14'>
        <div className='bg-muted/60 mx-auto mb-5 flex size-16 items-center justify-center rounded-full'>
          <IconGift className='text-muted-foreground size-8' />
        </div>
        <Typography.H4>{emptyTitle}</Typography.H4>
        <Text variant='muted' className='mx-auto mt-2 max-w-sm text-sm'>
          {emptyDescription}
        </Text>
        {emptyActionLabel && onEmptyAction ? (
          <Button className='mt-6 gap-2' onClick={onEmptyAction}>
            <IconGift className='h-4 w-4' />
            {emptyActionLabel}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {cards.map((card) => (
        <article
          key={card.id ?? card.code}
          className='bg-card border-border rounded-2xl border p-5 sm:p-6'
        >
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div>
              <Text className='font-semibold tabular-nums'>
                {formatPrice(card.balance ?? card.initial_amount ?? 0)}
              </Text>
              <Text variant='muted' className='mt-1 font-mono text-sm'>
                {card.code}
              </Text>
            </div>
            {card.status ? <Badge variant='outline'>{card.status}</Badge> : null}
          </div>

          <div className='mt-4 grid gap-2 text-sm sm:grid-cols-2'>
            {variant === 'sent' ? (
              <>
                <Text variant='muted'>
                  {t('toRecipient', {
                    name: card.recipient_name ?? card.recipient_email ?? '—'
                  })}
                </Text>
                <Text variant='muted'>
                  {t('createdOn', {
                    date: formatGiftCardDate(card.created_at) ?? tCommon('noDate')
                  })}
                </Text>
              </>
            ) : (
              <>
                <Text variant='muted'>{t('fromSender', { name: card.sender_name ?? '—' })}</Text>
                <Text variant='muted'>
                  {t('expiresOn', {
                    date: formatGiftCardDate(card.expires_at) ?? tCommon('noDate')
                  })}
                </Text>
              </>
            )}
          </div>

          {card.message ? (
            <Text variant='muted' className='mt-3 text-sm italic'>
              &ldquo;{card.message}&rdquo;
            </Text>
          ) : null}

          {variant === 'received' && !card.recipient_user_id && card.code && onClaim ? (
            <Button
              variant='outline'
              size='sm'
              className='mt-4'
              disabled={claimingCode === card.code}
              onClick={() => void onClaim(card)}
            >
              {claimingCode === card.code ? t('claiming') : t('claimCard')}
            </Button>
          ) : null}

          {card.status === 'active' && (card.balance ?? 0) > 0 && card.code && onTransfer ? (
            <Button variant='secondary' size='sm' className='mt-4' onClick={() => onTransfer(card)}>
              {t('transfer.giveToMember')}
            </Button>
          ) : null}
        </article>
      ))}
    </div>
  );
}
