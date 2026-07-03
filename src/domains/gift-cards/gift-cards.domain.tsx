'use client';

import { IconGift, IconTicket } from '@tabler/icons-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/ui/flex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/typography';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

import { GiftCardFinderPromo } from './components/gift-card-finder-promo';
import { GiftCardPurchaseForm } from './components/gift-card-purchase-form';
import { GiftCardsStripeReturnHandler } from './components/gift-cards-stripe-return-handler';
import { giftCardRedeemSchema } from './gift-cards.schema';
import { useGiftCardPurchase } from './hooks/use-gift-card-purchase';

export function GiftCardsDomain() {
  const t = useTranslations('giftCardsPage');
  const purchase = useGiftCardPurchase('/gift-cards');

  const redeemForm = useAppForm({
    defaultValues: { code: '' },
    validators: { onSubmit: giftCardRedeemSchema },
    onSubmit: async ({ value }) => {
      toast.message(t('redeem.toastTitle'), {
        description: t('redeem.toastDescription', { code: value.code })
      });
    }
  });

  return (
    <main className='pb-24'>
      <SupportPageHero
        eyebrow={t('eyebrow')}
        title={t('title')}
        description={t('description')}
        breadcrumbs={[{ name: t('breadcrumbHome'), href: '/' }, { name: t('breadcrumb') }]}
      />

      <div className='app-container mt-12 max-w-4xl space-y-10 lg:mt-16'>
        <GiftCardsStripeReturnHandler />
        <GiftCardFinderPromo />

        <Tabs defaultValue='purchase' className='space-y-8'>
          <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 rounded-full p-1 sm:w-auto'>
            <TabsTrigger value='purchase' className='gap-2 rounded-full px-5 py-2.5'>
              <IconGift className='h-4 w-4' />
              {t('tabs.purchase')}
            </TabsTrigger>
            <TabsTrigger value='redeem' className='gap-2 rounded-full px-5 py-2.5'>
              <IconTicket className='h-4 w-4' />
              {t('tabs.redeem')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value='purchase'>
            <GiftCardPurchaseForm purchase={purchase} />
          </TabsContent>

          <TabsContent value='redeem'>
            <div className='border-border/60 bg-card/40 rounded-3xl border p-6 backdrop-blur sm:p-8'>
              <Text variant='muted' className='mb-6 text-sm leading-relaxed'>
                {t('redeem.intro')}
              </Text>

              <redeemForm.Root
                onSubmit={(e) => {
                  e.preventDefault();
                  redeemForm.handleSubmit();
                }}
                className='space-y-5'
              >
                <redeemForm.AppField
                  name='code'
                  children={(field) => (
                    <field.TextField
                      label={t('redeem.codeLabel')}
                      placeholder={t('redeem.codePlaceholder')}
                      className='font-mono uppercase'
                      required
                    />
                  )}
                />

                <Flex wrap='wrap' spacing={3}>
                  <redeemForm.Subscribe
                    selector={(state) => [state.isSubmitting]}
                    children={([isSubmitting]) => (
                      <Button type='submit' className='rounded-full' disabled={isSubmitting}>
                        {t('redeem.checkCode')}
                      </Button>
                    )}
                  />
                  <Button asChild variant='outline' className='rounded-full'>
                    <Link href='/shop'>{t('redeem.shopNow')}</Link>
                  </Button>
                  <Button asChild variant='ghost' className='rounded-full'>
                    <Link href='/account?tab=giftCards'>{t('redeem.manageCards')}</Link>
                  </Button>
                </Flex>
              </redeemForm.Root>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
