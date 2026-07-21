'use client';

import { IconArrowRight, IconTag } from '@tabler/icons-react';
import Link from 'next/link';

import { useTheme } from '@/components/providers/client/theme';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { PromoProductRail } from '@/domains/home/components/ui/promo-product-rail';
import { useCountdown } from '@/hooks/useCountdown';
import { formatLocaleCountdownUnit } from '@/lib/i18n/format-number';
import { cn } from '@/lib/utils';
import type { Locale } from '~/src/i18n/config';
import type { DtoHomeFlashDealItem } from '~/src/services/-home-flash-deals-get.schemas';

interface PromoCountdownProps {
  promoEnd: Date;
  deals: DtoHomeFlashDealItem[];
  ctaHref: string;
  theme?: 'dark' | 'light';
  locale: Locale;
  t: {
    badge: string;
    title: string;
    description: string;
    shopSale: string;
    countdown: {
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
  common: {
    promoImageAlt: string;
  };
}

/** Dense flash-deals band — admin copy + countdown + carousel product rail. */
export function PromoCountdown({
  promoEnd,
  deals,
  ctaHref,
  theme = 'dark',
  locale,
  t,
  common
}: PromoCountdownProps) {
  const { hours, minutes, seconds } = useCountdown(promoEnd);
  const { resolvedTheme } = useTheme();
  /** Light admin bands render as dark surfaces when the storefront is in dark mode. */
  const useDarkBand = theme === 'dark' || resolvedTheme === 'dark';

  const countdownItems = [
    { value: formatLocaleCountdownUnit(hours, locale), label: t.countdown.hours },
    { value: formatLocaleCountdownUnit(minutes, locale), label: t.countdown.minutes },
    { value: formatLocaleCountdownUnit(seconds, locale), label: t.countdown.seconds }
  ];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7',
        'min-h-[18.5rem] sm:min-h-[18rem] lg:min-h-[17.5rem]',
        useDarkBand
          ? 'border border-white/10 bg-[#141414] text-white'
          : 'border-border/60 bg-muted/55 text-foreground border'
      )}
    >
      <div
        aria-hidden
        className={cn(
          'bg-gold/10 pointer-events-none absolute -start-16 top-0 size-48 rounded-full blur-3xl',
          !useDarkBand && 'opacity-80'
        )}
      />

      <Flex
        direction='column'
        className='relative h-full gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8'
      >
        <Flex direction='column' className='shrink-0 lg:max-w-xs'>
          <span
            className={cn(
              'inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase',
              useDarkBand
                ? 'border-white/15 bg-white/10 text-white'
                : 'border-border/70 bg-background/80 text-foreground'
            )}
          >
            <IconTag className='text-gold size-3.5' />
            {t.badge}
          </span>

          <Typography.H2
            family='display'
            className={cn(
              'mt-3 text-xl font-semibold tracking-tight sm:text-2xl',
              useDarkBand ? 'text-white' : 'text-foreground'
            )}
          >
            {t.title}
          </Typography.H2>

          <Typography.Muted
            className={cn(
              'mt-1.5 line-clamp-2 text-xs sm:text-sm',
              useDarkBand ? 'text-white/70' : undefined
            )}
          >
            {t.description}
          </Typography.Muted>

          <Flex direction='row' gap={2} className='mt-4'>
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className={cn(
                  'min-w-[3.25rem] rounded-lg border px-2.5 py-2 text-center',
                  useDarkBand
                    ? 'border-white/15 bg-white/10'
                    : 'border-border/70 bg-background shadow-sm'
                )}
              >
                <div
                  className={cn(
                    'font-display text-lg font-semibold tabular-nums sm:text-xl',
                    useDarkBand ? 'text-white' : 'text-foreground'
                  )}
                >
                  {item.value}
                </div>
                <div
                  className={cn(
                    'text-[9px] tracking-wider uppercase',
                    useDarkBand ? 'text-white/55' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </Flex>

          <Link
            href={ctaHref}
            className={cn(
              'mt-4 inline-flex h-9 w-fit items-center gap-1.5 rounded-full px-4 text-xs font-semibold',
              'bg-gold text-gold-foreground hover:bg-gold/90 transition-colors'
            )}
          >
            {t.shopSale}
            <IconArrowRight className='cn-rtl-flip size-3.5' />
          </Link>
        </Flex>

        <PromoProductRail
          deals={deals}
          promoImageAlt={common.promoImageAlt}
          theme={useDarkBand ? 'dark' : 'light'}
        />
      </Flex>
    </div>
  );
}
