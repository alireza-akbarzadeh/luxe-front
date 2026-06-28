'use client';

import { IconArrowRight, IconTag } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import { getProductPath } from '@/domains/product/lib/product-routes';
import { useCountdown } from '@/hooks/useCountdown';
import { formatLocaleCountdownUnit } from '@/lib/i18n/format-number';
import { cn } from '@/lib/utils';
import { useGetHomeFlashDeals } from '@/services/-home-flash-deals-get';

import { useHomeContent } from '../hooks/use-home-content';
import { sectionContainerClass } from '../lib/home-utils';

export function PromoSection() {
  const { locale, marketingCopy, t } = useHomeContent();
  const { data, isLoading, isError } = useGetHomeFlashDeals({ limit: 1 });

  const deal = data?.data?.deals?.[0];
  const promoImage = deal?.product?.images?.[0];
  const promoEnd = deal?.ends_at ? new Date(deal.ends_at) : null;
  const { hours, minutes, seconds } = useCountdown(promoEnd ?? new Date(0));
  const promoCode = t('promo.code');

  if (!isLoading && (isError || !deal || !promoEnd || !promoImage)) {
    return null;
  }

  const countdownItems = [
    { value: formatLocaleCountdownUnit(hours, locale), label: t('promo.countdown.hours') },
    { value: formatLocaleCountdownUnit(minutes, locale), label: t('promo.countdown.minutes') },
    { value: formatLocaleCountdownUnit(seconds, locale), label: t('promo.countdown.seconds') }
  ];

  return (
    <section className='py-16 sm:py-20 lg:py-28' aria-busy={isLoading}>
      <div className={sectionContainerClass}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className='border-border/60 bg-card dark:border-border/40 relative overflow-hidden rounded-2xl border shadow-sm sm:rounded-3xl dark:shadow-none'
        >
          <div className='relative grid min-h-[28rem] lg:min-h-[24rem] lg:grid-cols-2'>
            <div className='relative min-h-[14rem] lg:min-h-full'>
              {isLoading ? (
                <div className='bg-muted absolute inset-0 animate-pulse' />
              ) : promoImage ? (
                <Image
                  src={promoImage}
                  alt={deal?.product?.name ?? t('common.promoImageAlt')}
                  fill
                  className='object-cover'
                  sizes='(max-width: 1024px) 100vw, 50vw'
                />
              ) : null}
              <div className='from-background/80 via-background/30 absolute inset-0 bg-linear-to-r to-transparent lg:hidden' />
              <div className='from-card via-card/40 absolute inset-0 bg-linear-to-t to-transparent lg:hidden' />
              <div className='from-card/90 absolute inset-0 hidden bg-linear-to-l to-transparent lg:block' />
            </div>

            <div className='bg-card text-card-foreground relative flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16'>
              <div className='bg-gold/10 dark:bg-gold/15 pointer-events-none absolute -top-20 right-0 h-56 w-56 rounded-full blur-3xl' />
              <div className='bg-accent/5 dark:bg-accent/10 pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full blur-3xl' />

              <span className='border-gold/30 bg-surface/90 text-foreground dark:bg-muted/50 inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm'>
                <IconTag className='text-gold h-3.5 w-3.5' />
                {t('promo.badge')}
              </span>

              <h2 className='font-display text-foreground mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl'>
                {t('promo.title', marketingCopy.promo)}
              </h2>
              <p className='text-muted-foreground mt-4 max-w-md text-sm leading-relaxed sm:text-base'>
                {t('promo.description', { code: promoCode })}
              </p>

              <div className='mt-8 flex flex-wrap gap-3 sm:gap-4'>
                {countdownItems.map((item) => (
                  <div
                    key={item.label}
                    className='border-border/60 bg-muted/60 dark:bg-muted/30 min-w-[4.5rem] rounded-xl border px-4 py-3 text-center'
                  >
                    <div className='font-display text-foreground text-3xl font-semibold tabular-nums sm:text-4xl'>
                      {item.value}
                    </div>
                    <div className='text-muted-foreground text-xs tracking-widest uppercase'>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-10 flex flex-col gap-3 sm:flex-row'>
                <Link
                  href={deal?.product ? getProductPath(deal.product) : '/shop'}
                  className={cn(
                    buttonVariants({ size: 'lg' }),
                    'bg-accent text-accent-foreground hover:bg-accent/90 h-12 rounded-full px-8 shadow-sm'
                  )}
                >
                  {t('promo.shopSale')}
                  <IconArrowRight className='cn-rtl-flip ms-2 h-4 w-4' />
                </Link>
                <Button
                  variant='outline'
                  size='lg'
                  className='border-border text-foreground hover:bg-muted/70 dark:hover:bg-muted/40 h-12 rounded-full px-8'
                  asChild
                >
                  <Link href='/register'>{t('promo.createAccount')}</Link>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
