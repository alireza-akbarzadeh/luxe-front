'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import type { Locale } from '@/i18n/config';
import { formatLocaleNumber } from '@/lib/i18n/format-number';
import { cn } from '@/lib/utils';

export interface PriceInputProps extends Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode'
> {
  value: number | null;
  onValueChange: (value: number | null) => void;
  /** Locale used for thousand separators (defaults to `en`). */
  locale?: Locale;
}

/** Convert Eastern Arabic / Persian digits to Western 0–9. */
function toWesternDigits(value: string): string {
  return value
    .replace(/[\u06F0-\u06F9]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[\u0660-\u0669]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

/** Format a whole-number amount with locale thousand separators for the input. */
export function formatPriceInputValue(value: number | null, locale: Locale = 'en'): string {
  if (value == null || Number.isNaN(value)) return '';
  return formatLocaleNumber(Math.trunc(value), locale, {
    maximumFractionDigits: 0,
    useGrouping: true
  });
}

/**
 * Parse a formatted price string into a whole-number amount.
 * Thousand separators are ignored; any decimal/fraction part is dropped
 * (e.g. `15.26` → `15`, `1,234` → `1234`).
 */
export function parsePriceInputValue(raw: string): number | null {
  let normalized = toWesternDigits(raw);
  // Strip grouping separators / spaces used for readability
  normalized = normalized.replace(/[,\u066C\u2009\u202F\s]/g, '');
  // Drop cents / fractional part — gift cards are whole dollars only
  normalized = normalized.split(/[.\u066B]/)[0] ?? '';
  const digits = normalized.replace(/\D/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  if (!Number.isFinite(parsed)) return null;
  return Math.trunc(parsed);
}

/**
 * Currency-style amount input: thousand separators for readability,
 * whole numbers only (no cents / decimal amounts).
 */
export const PriceInput = forwardRef<HTMLInputElement, PriceInputProps>(
  ({ value, onValueChange, locale = 'en', className, onBlur, ...props }, ref) => {
    const [internal, setInternal] = useState(() => formatPriceInputValue(value, locale));
    const lastExternal = useRef<number | null>(value);

    useEffect(() => {
      if (value !== lastExternal.current) {
        lastExternal.current = value;
        setInternal(formatPriceInputValue(value, locale));
      }
    }, [value, locale]);

    function commit(raw: string) {
      const parsed = parsePriceInputValue(raw);
      lastExternal.current = parsed;
      setInternal(formatPriceInputValue(parsed, locale));
      onValueChange(parsed);
    }

    return (
      <Input
        {...props}
        ref={ref}
        type='text'
        inputMode='numeric'
        autoComplete='off'
        value={internal}
        onChange={(e) => commit(e.target.value)}
        onBlur={(e) => {
          commit(e.target.value);
          onBlur?.(e);
        }}
        className={cn('tabular-nums', className)}
      />
    );
  }
);

PriceInput.displayName = 'PriceInput';
