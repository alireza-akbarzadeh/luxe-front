'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';
import type { DtoCreateGiftCardResponse } from '@/services/-gift-cards-post.schemas';
import { getGetGiftCardsReceivedQueryKey } from '@/services/-gift-cards-received-get';
import { getGetGiftCardsSentQueryKey } from '@/services/-gift-cards-sent-get';

import { type GiftRecipientLookup, postGiftCardTransfer } from '../lib/gift-card-transfer-api';
import { GiftCardRecipientPicker } from './gift-card-recipient-picker';

type GiftCardTransferDialogProps = {
  card: DtoCreateGiftCardResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Transfer an active gift card to another Luxe member with confirmation. */
export function GiftCardTransferDialog({ card, open, onOpenChange }: GiftCardTransferDialogProps) {
  const t = useTranslations('account.giftCards.transfer');
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<GiftRecipientLookup | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const balance = card?.balance ?? card?.initial_amount ?? 0;

  const reset = () => {
    setSelectedUser(null);
    setConfirmOpen(false);
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    onOpenChange(nextOpen);
  };

  const handleTransfer = async () => {
    if (!card?.code || !selectedUser) return;
    setIsSubmitting(true);
    try {
      await postGiftCardTransfer(card.code, selectedUser.id);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: getGetGiftCardsSentQueryKey() }),
        queryClient.invalidateQueries({ queryKey: getGetGiftCardsReceivedQueryKey() })
      ]);
      toast.success(t('success', { name: selectedUser.display_name }));
      handleClose(false);
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          t('error')
      );
    } finally {
      setIsSubmitting(false);
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('description')}</DialogDescription>
          </DialogHeader>

          {card ? (
            <div className='bg-muted/40 border-border/60 space-y-1 rounded-xl border p-4'>
              <Text className='font-semibold tabular-nums'>{formatPrice(balance)}</Text>
              <Text variant='muted' className='font-mono text-xs'>
                {card.code}
              </Text>
            </div>
          ) : null}

          <GiftCardRecipientPicker
            label={t('searchLabel')}
            placeholder={t('searchPlaceholder')}
            emptyLabel={t('searchEmpty')}
            searchingLabel={t('searching')}
            value={selectedUser ? String(selectedUser.id) : ''}
            onChange={setSelectedUser}
          />

          <Button
            className='w-full rounded-full'
            disabled={!selectedUser}
            onClick={() => setConfirmOpen(true)}
          >
            {t('continue')}
          </Button>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('confirmDescription', {
                amount: formatPrice(balance),
                name: selectedUser?.display_name ?? ''
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction disabled={isSubmitting} onClick={() => void handleTransfer()}>
              {isSubmitting ? t('submitting') : t('confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
