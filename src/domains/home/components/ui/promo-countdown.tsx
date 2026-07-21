'use client';

import { IconArrowRight, IconTag } from '@tabler/icons-react';
import Link from 'next/link';
import { useLocale } from 'next-intl';

import { AppImage } from '@/components/ui/app-image';
import { Flex } from '@/components/ui/flex';
import { Typography } from '@/components/ui/typography';
import { formatPrice } from '@/domains/home/lib/home-utils';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { useCountdown } from '@/hooks/useCountdown';
import { formatLocaleCountdownUnit } from '@/lib/i18n/format-number';
import { IMAGE_FALLBACK } from '@/lib/images';
import { cn } from '@/lib/utils';
import type { Locale } from '~/src/i18n/config';
import type { DtoHomeFlashDealItem } from '~/src/services/-home-flash-deals-get.schemas';

interface PromoCountdownProps {
  promoEnd: Date;
  deals: DtoHomeFlashDealItem[];
  promoCode: string;
  t: {
    badge: string;
    title: string;
    description: string;
    shopSale: string;
    createAccount: string;
    countdown: {
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
  common: {
    promoImageAlt: string;
    shopNow: string;
  };
}

function dealDiscountPercent(deal: DtoHomeFlashDealItem): number | null {
  const product = deal.product;
  if (!product) return null;
  if (product.discount_percent != null && product.discount_percent > 0) {
    return Math.round(product.discount_percent);
  }
  if (
    product.compare_at_price != null &&
    product.price != null &&
    product.compare_at_price > product.price
  ) {
    return Math.round(
      ((product.compare_at_price - product.price) / product.compare_at_price) * 100
    );
  }
  return null;
}

/** Dense flash-deals band — countdown + compact product rail. */
export function PromoCountdown({ promoEnd, deals, t, common }: PromoCountdownProps) {
  const locale = useLocale() as Locale;
  const { hours, minutes, seconds } = useCountdown(promoEnd);

  const countdownItems = [
    { value: formatLocaleCountdownUnit(hours, locale), label: t.countdown.hours },
    { value: formatLocaleCountdownUnit(minutes, locale), label: t.countdown.minutes },
    { value: formatLocaleCountdownUnit(seconds, locale), label: t.countdown.seconds }
  ];

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-foreground text-background',
        'px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7'
      )}
    >
      <div
        aria-hidden
        className='bg-gold/15 pointer-events-none absolute -start-16 top-0 size-48 rounded-full blur-3xl'
      />

      <Flex
        direction='column'
        className='relative gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8'
      >
        <Flex direction='column' className='shrink-0 lg:max-w-xs'>
          <span className='border-background/20 bg-background/10 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase'>
            <IconTag className='text-gold size-3.5' />
            {t.badge}
          </span>

          <Typography.H2
            family='display'
            className='text-background mt-3 text-xl font-semibold tracking-tight sm:text-2xl'
          >
            {t.title}
          </Typography.H2>

          <Typography.Muted className='text-background/70 mt-1.5 line-clamp-2 text-xs sm:text-sm'>
            {t.description}
          </Typography.Muted>

          <Flex direction='row' gap={2} className='mt-4'>
            {countdownItems.map((item) => (
              <div
                key={item.label}
                className='border-background/15 bg-background/10 min-w-[3.25rem] rounded-lg border px-2.5 py-2 text-center'
              >
                <div className='font-display text-background text-lg font-semibold tabular-nums sm:text-xl'>
                  {item.value}
                </div>
                <div className='text-background/55 text-[9px] tracking-wider uppercase'>
                  {item.label}
                </div>
              </div>
            ))}
          </Flex>

          <Link
            href='/shop'
            className={cn(
              'mt-4 inline-flex h-9 w-fit items-center gap-1.5 rounded-full px-4 text-xs font-semibold',
              'bg-gold text-gold-foreground hover:bg-gold/90 transition-colors'
            )}
          >
            {t.shopSale}
            <IconArrowRight className='cn-rtl-flip size-3.5' />
          </Link>
        </Flex>

        <div className='min-w-0 flex-1'>
          <ul className='flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {deals.map((deal) => {
              const product = deal.product;
              if (!product) return null;
              const href = getProductPath(product);
              const image = product.images?.[0] ?? IMAGE_FALLBACK;
              const discount = dealDiscountPercent(deal);

              return (
                <li key={deal.id ?? product.id} className='w-[8.5rem] shrink-0 sm:w-[9.5rem]'>
                  <Link
                    href={href}
                    className='border-background/10 bg-background/10 hover:bg-background/15 group flex h-full flex-col overflow-hidden rounded-xl border transition-colors'
                  >
                    <div className='bg-background/5 relative aspect-square overflow-hidden'>
                      <AppImage
                        src={image}
                        alt={product.name ?? common.promoImageAlt}
                        fill
                        loading='lazy'
                        sizes='160px'
                        className='object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                      {discount != null ? (
                        <span className='bg-gold text-gold-foreground absolute end-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold'>
                          -{discount}%
                        </span>
                      ) : null}
                    </div>
                    <div className='flex flex-1 flex-col gap-0.5 p-2.5'>
                      <p className='text-background line-clamp-2 text-[11px] leading-snug font-medium'>
                        {product.name}
                      </p>
                      <Flex direction='row' align='baseline' gap={1.5} className='mt-auto pt-1'>
                        <span className='text-gold text-xs font-semibold tabular-nums'>
                          {formatPrice(product.price, locale)}
                        </span>
                        {product.compare_at_price != null &&
                        product.price != null &&
                        product.compare_at_price > product.price ? (
                          <span className='text-background/45 text-[10px] tabular-nums line-through'>
                            {formatPrice(product.compare_at_price, locale)}
                          </span>
                        ) : null}
                      </Flex>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Flex>
    </div>
  );
}
