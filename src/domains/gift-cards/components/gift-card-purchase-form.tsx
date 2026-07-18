'use client';

import { startOfToday } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { useRequireAuth } from '@/hooks/use-require-auth';

import { GIFT_CARD_MAX_AMOUNT, GIFT_CARD_MIN_AMOUNT } from '../gift-cards.schema';
import type { useGiftCardPurchase } from '../hooks/use-gift-card-purchase';

type GiftCardPurchaseFormProps = {
  purchase: ReturnType<typeof useGiftCardPurchase>;
};

type AmountMode = 'preset' | 'custom';

/** Amount picker + recipient form for buying a digital gift card. */
export function GiftCardPurchaseForm({ purchase }: GiftCardPurchaseFormProps) {
  const t = useTranslations('giftCardsPage.purchase');
  const { openAuthDialog } = useRequireAuth();
  const {
    form: purchaseForm,
    amounts,
    selectAmount,
    isCreating,
    isAuthenticated,
    isAuthLoading
  } = purchase;
  const [amountMode, setAmountMode] = useState<AmountMode>('preset');

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
          <Button
            type='button'
            className='w-fit rounded-full'
            onClick={() => openAuthDialog({ callbackUrl: '/gift-cards', reason: 'gift-card' })}
          >
            {t('signInCta')}
          </Button>
        </Flex>
      ) : null}

      <purchaseForm.AppForm>
        <purchaseForm.Root
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void purchaseForm.handleSubmit();
          }}
          className='space-y-5'
        >
          <div>
            <Text className='mb-3 text-sm font-medium'>{t('selectAmount')}</Text>
            <Tabs
              value={amountMode}
              onValueChange={(value) => setAmountMode(value as AmountMode)}
              className='space-y-4'
            >
              <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 rounded-full p-1 sm:w-auto'>
                <TabsTrigger value='preset' className='rounded-full px-4 py-2'>
                  {t('amountTabs.preset')}
                </TabsTrigger>
                <TabsTrigger value='custom' className='rounded-full px-4 py-2'>
                  {t('amountTabs.custom')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value='preset' className='mt-0'>
                <purchaseForm.Subscribe
                  selector={(state) => state.values.amount}
                  children={(selectedAmount) => (
                    <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
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
                    </div>
                  )}
                />
              </TabsContent>

              <TabsContent value='custom' className='mt-0'>
                <purchaseForm.AppField
                  name='amount'
                  children={(field) => (
                    <field.PriceField
                      label={t('customAmount')}
                      detail={t('customAmountHint', {
                        min: formatPrice(GIFT_CARD_MIN_AMOUNT),
                        max: formatPrice(GIFT_CARD_MAX_AMOUNT)
                      })}
                      placeholder={formatPrice(GIFT_CARD_MIN_AMOUNT)}
                    />
                  )}
                />
              </TabsContent>
            </Tabs>
          </div>

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

          <purchaseForm.ErrorMessages />

          <purchaseForm.Subscribe
            selector={(state) => [state.isSubmitting, state.values.amount]}
            children={([isSubmitting, amount]) => (
              <Button
                type='submit'
                size='lg'
                className='w-full rounded-full sm:w-auto'
                disabled={Boolean(isSubmitting) || isCreating || Boolean(isAuthLoading)}
              >
                {t('submit', {
                  amount: formatPrice(typeof amount === 'number' ? amount : 0)
                })}
              </Button>
            )}
          />
        </purchaseForm.Root>
      </purchaseForm.AppForm>
    </div>
  );
}
