'use client';

import { useTranslations } from 'next-intl';
import { type ReactNode } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PrivacyPolicyContent } from '@/domains/legal/components/privacy-policy-content';
import { TermsOfServiceContent } from '@/domains/legal/components/terms-of-service-content';

type LegalDoc = 'terms' | 'privacy';
type LegalPresentation = 'dialog' | 'drawer';

interface CheckoutLegalDialogProps {
  type: LegalDoc;
  /** Drawer on mobile sticky bar — stacks above checkout action bar (z-60+). */
  presentation?: LegalPresentation;
  children: ReactNode;
}

function LegalDocBody({ type }: { type: LegalDoc }) {
  return type === 'terms' ? <TermsOfServiceContent /> : <PrivacyPolicyContent />;
}

/** Opens terms or privacy without leaving checkout. */
export function CheckoutLegalDialog({
  type,
  presentation = 'dialog',
  children
}: CheckoutLegalDialogProps) {
  const t = useTranslations('checkout.legal');

  const title = type === 'terms' ? t('termsTitle') : t('privacyTitle');
  const description = type === 'terms' ? t('termsDescription') : t('privacyDescription');

  if (presentation === 'drawer') {
    return (
      <Drawer>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent
          variant='ios'
          radius='full'
          showHandle
          className='z-[70] max-h-[min(90dvh,800px)]'
        >
          <DrawerHeader className='border-border shrink-0 border-b px-4 pt-1 pb-3 text-start'>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]'>
            <LegalDocBody type={type} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-lg'>
        <DialogHeader className='border-border border-b px-6 py-4 text-start'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className='max-h-[min(60vh,32rem)] px-6 py-4'>
          <LegalDocBody type={type} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
