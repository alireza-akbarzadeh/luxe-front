'use client';

import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
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

  return (
    <div
      data-checkout-terms
      className={cn(
        'flex items-start gap-3 rounded-xl border p-3 transition-shadow',
        compact ? 'bg-muted/30 border-border/50' : 'bg-muted/40 border-border/60 p-4',
        termsAttention && !agreedToTerms && 'border-destructive/60 ring-destructive/30 ring-2',
        className
      )}
    >
      <Checkbox
        id={id}
        checked={agreedToTerms}
        onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
        className='mt-0.5 shrink-0'
        aria-invalid={termsAttention && !agreedToTerms}
      />
      <Label
        htmlFor={id}
        className={cn('text-muted-foreground leading-relaxed', compact ? 'text-xs' : 'text-sm')}
      >
        {t('termsPrefix')}{' '}
        <CheckoutLegalDialog type='terms' presentation={compact ? 'drawer' : 'dialog'}>
          <button type='button' className='text-accent underline'>
            {t('termsLink')}
          </button>
        </CheckoutLegalDialog>{' '}
        {t('termsAnd')}{' '}
        <CheckoutLegalDialog type='privacy' presentation={compact ? 'drawer' : 'dialog'}>
          <button type='button' className='text-accent underline'>
            {t('privacyLink')}
          </button>
        </CheckoutLegalDialog>
        {t('termsSuffix')}
      </Label>
    </div>
  );
}
