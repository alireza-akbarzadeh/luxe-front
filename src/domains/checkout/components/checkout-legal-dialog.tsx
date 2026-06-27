'use client';

import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrivacyPolicyContent } from '@/domains/legal/components/privacy-policy-content';
import { TermsOfServiceContent } from '@/domains/legal/components/terms-of-service-content';

type LegalDoc = 'terms' | 'privacy';

interface CheckoutLegalDialogProps {
  type: LegalDoc;
  children: ReactNode;
}

/** Opens terms or privacy in a dialog so checkout users are not navigated away. */
export function CheckoutLegalDialog({ type, children }: CheckoutLegalDialogProps) {
  const t = useTranslations('checkout.legal');

  const title = type === 'terms' ? t('termsTitle') : t('privacyTitle');
  const description = type === 'terms' ? t('termsDescription') : t('privacyDescription');

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-lg'>
        <DialogHeader className='border-border border-b px-6 py-4 text-start'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[min(60vh,32rem)] px-6 py-4'>
          {type === 'terms' ? <TermsOfServiceContent /> : <PrivacyPolicyContent />}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
