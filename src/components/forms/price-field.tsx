'use client';

import { IconCurrencyDollar, type TablerIcon } from '@tabler/icons-react';
import { useLocale } from 'next-intl';
import type { ComponentProps } from 'react';

import { PriceInput } from '@/components/ui/price-input';
import { getDirection, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

import { FieldContainer } from './form';
import { useFieldContext } from './useFormContext';

interface PriceFieldProps extends Omit<
  ComponentProps<typeof PriceInput>,
  'value' | 'onValueChange' | 'locale'
> {
  label?: string;
  detail?: string;
  /** Prefix icon — defaults to a dollar currency icon. */
  startIcon?: TablerIcon;
}

/** Form field for whole-dollar amounts with thousand separators and a money icon. */
export function PriceField({
  label,
  detail,
  startIcon: StartIcon = IconCurrencyDollar,
  className,
  ...props
}: PriceFieldProps) {
  const field = useFieldContext<number | null>();
  const locale = useLocale() as Locale;
  const isRtl = getDirection(locale) === 'rtl';

  return (
    <FieldContainer label={label} detail={detail}>
      {/*
        Numbers stay LTR (`dir` on the input). Icon + padding use the layout
        inline-start edge so they flip correctly in RTL (fa) without fighting
        the number caret direction.
      */}
      <div className='relative w-full'>
        <StartIcon
          className={cn(
            'pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-green-500',
            isRtl ? 'end-4' : 'start-4'
          )}
        />
        <PriceInput
          {...props}
          dir='ltr'
          locale={locale}
          value={typeof field.state.value === 'number' ? field.state.value : null}
          onValueChange={(value) => field.handleChange(value ?? null)}
          onBlur={field.handleBlur}
          className={cn(isRtl ? 'pe-12' : 'ps-12', className)}
        />
      </div>
    </FieldContainer>
  );
}
