'use client';

import { startOfToday } from 'date-fns';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Text } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';

import type { useGiftCardPurchase } from '../hooks/use-gift-card-purchase';

type GiftCardPurchaseFormProps = {
  purchase: ReturnType<typeof useGiftCardPurchase>;
};

/** Amount picker + recipient form for buying a digital gift card. */
export function GiftCardPurchaseForm({ purchase }: GiftCardPurchaseFormProps) {
  const t = useTranslations('giftCardsPage.purchase');
  const {
    form: purchaseForm,
    amounts,
    selectedAmount,
    selectAmount,
    isCreating,
    isAuthenticated,
    isAuthLoading
  } = purchase;

  return (
    <div className='border-border/60 bg-card/40 rounded-3xl border p-6 backdrop-blur sm:p-8'>
      <Text variant='muted' className='mb-6 text-sm leading-relaxed'>
        {t('intro')}
      </Text>

      {!isAuthLoading && !isAuthenticated ? (
        <Flex
          direction='column'
          spacing={3}
          className='border-border/60 bg-muted/30 mb-8 rounded-2xl border p-4'
        >
          <Text className='text-sm font-medium'>{t('signInTitle')}</Text>
          <Text variant='muted' className='text-sm'>
            {t('signInDescription')}
          </Text>
          <Button asChild className='w-fit rounded-full'>
            <Link href='/login?redirect=%2Fgift-cards'>{t('signInCta')}</Link>
          </Button>
        </Flex>
      ) : null}

      <div className='mb-8'>
        <Text className='mb-3 text-sm font-medium'>{t('selectAmount')}</Text>
        <Flex wrap='wrap' spacing={2}>
          {amounts.map((amount) => (
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
        </Flex>
      </div>

      <purchaseForm.Root
        onSubmit={(e) => {
          e.preventDefault();
          purchaseForm.handleSubmit();
        }}
        className='space-y-5'
      >
        <div className='grid gap-5 sm:grid-cols-2'>
          <purchaseForm.AppField
            name='senderName'
            children={(field) => (
              <field.TextField
                label={t('senderName')}
                placeholder={t('senderNamePlaceholder')}
                required
              />
            )}
          />
          <purchaseForm.AppField
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

        <purchaseForm.AppField
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

        <div className='grid gap-5 sm:grid-cols-2'>
          <purchaseForm.AppField
            name='deliveryDate'
            children={(field) => (
              <field.DatePicker
                label={t('deliveryDate')}
                calendar={{ disabled: { before: startOfToday() } }}
              />
            )}
          />
          <purchaseForm.AppField
            name='message'
            children={(field) => (
              <field.TextField label={t('message')} placeholder={t('messagePlaceholder')} />
            )}
          />
        </div>

        <Text variant='muted' className='text-xs leading-relaxed'>
          {t('stripeNote')}
        </Text>

        <purchaseForm.Subscribe
          selector={(state) => [state.isSubmitting]}
          children={([isSubmitting]) => (
            <Button
              type='submit'
              size='lg'
              className='w-full rounded-full sm:w-auto'
              disabled={isSubmitting || isCreating || isAuthLoading}
            >
              {t('submit', { amount: formatPrice(selectedAmount) })}
            </Button>
          )}
        />
      </purchaseForm.Root>
    </div>
  );
}
