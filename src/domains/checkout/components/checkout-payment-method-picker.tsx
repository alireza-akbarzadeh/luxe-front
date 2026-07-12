'use client';

import { useTranslations } from 'next-intl';

import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { cn } from '@/lib/utils';

import type { CheckoutPaymentMethodOption } from '../lib/checkout-payment-methods';
import { CheckoutPaymentBrandIcon } from './checkout-payment-brand-icon';

interface CheckoutPaymentMethodPickerProps {
  methods: CheckoutPaymentMethodOption[];
  value: string;
  onChange: (value: string) => void;
  isLoading?: boolean;
}

/** Horizontal payment provider chips — dynamic catalog, Luxe theme accents. */
export function CheckoutPaymentMethodPicker({
  methods,
  value,
  onChange,
  isLoading = false
}: CheckoutPaymentMethodPickerProps) {
  const t = useTranslations('checkout.payment');

  if (isLoading) {
    return (
      <Flex direction='row' gap={3} className='overflow-x-auto pb-1'>
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className='bg-muted/60 size-14 shrink-0 animate-pulse rounded-full'
            aria-hidden
          />
        ))}
      </Flex>
    );
  }

  if (methods.length === 0) {
    return <Typography.Muted className='text-sm'>{t('noMethods')}</Typography.Muted>;
  }

  const selected = methods.find((method) => method.id === value) ?? methods[0];

  return (
    <Flex direction='column' gap={4}>
      <div
        role='radiogroup'
        aria-label={t('methodLabel')}
        className='flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
      >
        {methods.map((method) => {
          const isSelected = method.id === value;
          return (
            <button
              key={method.id}
              type='button'
              role='radio'
              aria-checked={isSelected}
              aria-label={method.displayName}
              onClick={() => onChange(method.id)}
              className={cn(
                'border-border/70 bg-background relative flex size-14 shrink-0 items-center justify-center rounded-full border shadow-sm transition-all',
                'hover:border-gold/50 hover:bg-muted/40 active:scale-95',
                isSelected && 'border-gold ring-gold/30 bg-gold/10 ring-2'
              )}
            >
              <CheckoutPaymentBrandIcon method={method} />
              {method.comingSoon ? (
                <span className='bg-muted text-muted-foreground absolute -end-1 -top-1 rounded-full px-1 text-[8px] font-semibold tracking-wide uppercase'>
                  {t('soon')}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selected ? (
        <Flex
          direction='column'
          gap={1}
          className='border-border/60 from-muted/40 to-background rounded-2xl border bg-gradient-to-br px-4 py-3.5'
        >
          <Typography.Small weight='semibold'>{selected.displayName}</Typography.Small>
          {selected.description ? (
            <Typography.Muted className='text-xs leading-relaxed'>
              {selected.description}
            </Typography.Muted>
          ) : null}
          {selected.comingSoon ? (
            <Typography.Muted className='text-gold text-xs'>{t('soonHint')}</Typography.Muted>
          ) : null}
        </Flex>
      ) : null}
    </Flex>
  );
}
