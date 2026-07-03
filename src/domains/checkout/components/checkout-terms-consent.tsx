'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Flex } from '@/components/ui/flex';
import { Label } from '@/components/ui/label';
import { CheckoutLegalDialog } from '@/domains/checkout/components/checkout-legal-dialog';
import { useCheckoutStore } from '@/domains/checkout/store/checkout.store';
import { cn } from '@/lib/utils';

interface CheckoutTermsConsentProps {
  id?: string;
  compact?: boolean;
  className?: string;
}

/** Terms + privacy consent — shared between review step and mobile sticky bar. */
export function CheckoutTermsConsent({
  id = 'checkout-agree-terms',
  compact = false,
  className
}: CheckoutTermsConsentProps) {
  const t = useTranslations('checkout.review');
  const agreedToTerms = useCheckoutStore((s) => s.agreedToTerms);
  const termsAttention = useCheckoutStore((s) => s.termsAttention);
  const setAgreedToTerms = useCheckoutStore((s) => s.setAgreedToTerms);
  const setTermsAttention = useCheckoutStore((s) => s.setTermsAttention);

  useEffect(() => {
    if (agreedToTerms) {
      setTermsAttention(false);
    }
  }, [agreedToTerms, setTermsAttention]);

  const linkClassName =
    'text-accent hover:text-accent/90 inline font-medium underline underline-offset-2';

  return (
    <Flex
      direction='row'
      align='start'
      gap={3.5}
      data-checkout-terms
      className={cn(
        'w-full min-w-0 rounded-2xl border transition-shadow',
        compact ? 'bg-muted/30 border-border/50 p-3.5' : 'bg-muted/40 border-border/60 p-4 sm:p-5',
        termsAttention && !agreedToTerms && 'border-destructive/60 ring-destructive/30 ring-2',
        className
      )}
    >
      <Checkbox
        id={id}
        checked={agreedToTerms}
        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
        className='mt-1 shrink-0'
        aria-invalid={termsAttention && !agreedToTerms}
      />
      <Label
        htmlFor={id}
        className={cn(
          'text-muted-foreground !block min-w-0 flex-1 cursor-pointer font-normal',
          compact
            ? 'text-[13px] leading-6 sm:text-sm sm:leading-relaxed'
            : 'text-sm leading-relaxed sm:text-[15px]'
        )}
      >
        {t('termsPrefix')}{' '}
        <CheckoutLegalDialog type='terms' presentation={compact ? 'drawer' : 'dialog'}>
          <button type='button' className={linkClassName}>
            {t('termsLink')}
          </button>
        </CheckoutLegalDialog>{' '}
        {t('termsAnd')}{' '}
        <CheckoutLegalDialog type='privacy' presentation={compact ? 'drawer' : 'dialog'}>
          <button type='button' className={linkClassName}>
            {t('privacyLink')}
          </button>
        </CheckoutLegalDialog>
        {t('termsSuffix')}
      </Label>
    </Flex>
  );
}
