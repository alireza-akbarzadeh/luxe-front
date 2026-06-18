'use client';

import { IconGift, IconTicket } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { useAppForm } from '@/components/forms/useAppForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { zodFormValidators } from '@/domains/menus/schemas/form-validator';
import { SupportPageHero } from '@/domains/support/components/support-page-hero';

import {
  GIFT_CARD_AMOUNTS,
  giftCardPurchaseSchema,
  giftCardRedeemSchema
} from './gift-cards.schema';

export function GiftCardsDomain() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);

  const purchaseForm = useAppForm({
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
      const subject = encodeURIComponent(
        `Gift card purchase request — ${formatPrice(value.amount)}`
      );
      const body = encodeURIComponent(
        [
          `Amount: ${formatPrice(value.amount)}`,
          `Recipient: ${value.recipientName} <${value.recipientEmail}>`,
          `From: ${value.senderName}`,
          value.deliveryDate ? `Delivery date: ${value.deliveryDate}` : '',
          value.message ? `Message: ${value.message}` : ''
        ]
          .filter(Boolean)
          .join('\n')
      );

      window.location.href = `mailto:concierge@luxe.com?subject=${subject}&body=${body}`;
      toast.success('Email app opened — send the request to complete your gift card order.');
    }
  });

  const redeemForm = useAppForm({
    defaultValues: { code: '' },
    validators: { onSubmit: giftCardRedeemSchema },
    onSubmit: async ({ value }) => {
      toast.message('Gift card redemption', {
        description: `Code ${value.code} will be applied at checkout once online redemption is enabled.`
      });
    }
  });

  const selectAmount = (amount: number) => {
    setSelectedAmount(amount);
    purchaseForm.setFieldValue('amount', amount);
  };

  return (
    <main className='pb-24'>
      <SupportPageHero
        eyebrow='Gift cards'
        title='Give the gift of choice'
        description='Send a digital Luxe gift card by email. Redeem at checkout on any marketplace purchase.'
        breadcrumbs={[{ name: 'Home', href: '/' }, { name: 'Gift Cards' }]}
      />

      <div className='app-container mt-16 max-w-4xl'>
        <Tabs defaultValue='purchase' className='space-y-8'>
          <TabsList className='bg-muted/60 h-auto w-full justify-start gap-1 rounded-full p-1 sm:w-auto'>
            <TabsTrigger value='purchase' className='gap-2 rounded-full px-5 py-2.5'>
              <IconGift className='h-4 w-4' />
              Purchase
            </TabsTrigger>
            <TabsTrigger value='redeem' className='gap-2 rounded-full px-5 py-2.5'>
              <IconTicket className='h-4 w-4' />
              Redeem
            </TabsTrigger>
          </TabsList>

          <TabsContent value='purchase'>
            <div className='border-border/60 bg-card/40 rounded-3xl border p-6 backdrop-blur sm:p-8'>
              <p className='text-muted-foreground mb-6 text-sm'>
                Choose an amount and recipient details. We&apos;ll email you a secure payment link
                within one business day.
              </p>

              <div className='mb-8'>
                <p className='mb-3 text-sm font-medium'>Select amount</p>
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
                      <field.TextField label='Your name' placeholder='Alex Morgan' required />
                    )}
                  />
                  <purchaseForm.AppField
                    name='recipientName'
                    children={(field) => (
                      <field.TextField label='Recipient name' placeholder='Jordan Lee' required />
                    )}
                  />
                </div>

                <purchaseForm.AppField
                  name='recipientEmail'
                  children={(field) => (
                    <field.TextField
                      label='Recipient email'
                      placeholder='recipient@email.com'
                      type='email'
                      required
                    />
                  )}
                />

                <div className='grid gap-5 sm:grid-cols-2'>
                  <purchaseForm.AppField
                    name='deliveryDate'
                    children={(field) => <field.TextField label='Send on (optional)' type='date' />}
                  />
                  <purchaseForm.AppField
                    name='message'
                    children={(field) => (
                      <field.TextField label='Personal message (optional)' placeholder='Enjoy!' />
                    )}
                  />
                </div>

                <purchaseForm.Subscribe
                  selector={(state) => [state.isSubmitting]}
                  children={([isSubmitting]) => (
                    <Button
                      type='submit'
                      size='lg'
                      className='w-full rounded-full sm:w-auto'
                      disabled={isSubmitting}
                    >
                      Request {formatPrice(selectedAmount)} gift card
                    </Button>
                  )}
                />
              </purchaseForm.Root>
            </div>
          </TabsContent>

          <TabsContent value='redeem'>
            <div className='border-border/60 bg-card/40 rounded-3xl border p-6 backdrop-blur sm:p-8'>
              <p className='text-muted-foreground mb-6 text-sm'>
                Enter your gift card code at checkout in the payment step. Online balance lookup is
                coming soon — contact concierge if you need help.
              </p>

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
                      label='Gift card code'
                      placeholder='LUXE-XXXX-XXXX'
                      className='font-mono uppercase'
                      required
                    />
                  )}
                />

                <div className='flex flex-wrap gap-3'>
                  <redeemForm.Subscribe
                    selector={(state) => [state.isSubmitting]}
                    children={([isSubmitting]) => (
                      <Button type='submit' className='rounded-full' disabled={isSubmitting}>
                        Check code
                      </Button>
                    )}
                  />
                  <Button asChild variant='outline' className='rounded-full'>
                    <Link href='/shop'>Shop now</Link>
                  </Button>
                </div>
              </redeemForm.Root>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
