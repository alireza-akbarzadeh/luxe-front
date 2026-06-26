'use client';

import { IconArrowRight, IconChevronRight } from '@tabler/icons-react';
import { useLocale } from 'next-intl';

import { getDirection, type Locale } from '@/i18n/config';
import { cn } from '@/lib/utils';

function useIsRtl() {
  const locale = useLocale() as Locale;
  return getDirection(locale) === 'rtl';
}

/** Forward arrow that flips in RTL layouts. */
export function DirectionalArrow({ className }: { className?: string }) {
  const rtl = useIsRtl();
  return <IconArrowRight className={cn('size-4', rtl && 'rotate-180', className)} aria-hidden />;
}

/** Chevron for inline links that flips in RTL layouts. */
export function DirectionalChevron({ className }: { className?: string }) {
  const rtl = useIsRtl();
  return <IconChevronRight className={cn('size-4', rtl && 'rotate-180', className)} aria-hidden />;
}
