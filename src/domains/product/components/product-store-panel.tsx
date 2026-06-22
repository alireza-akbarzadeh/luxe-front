'use client';

import {
  IconArrowUpRight,
  IconMapPin,
  IconStar,
  IconStarFilled,
  IconTruck
} from '@tabler/icons-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { useLocaleFormatters } from '@/lib/i18n/use-locale-formatters';
import { cn } from '@/lib/utils';
import type { DtoProductStoreSummary } from '@/services/-products-{id}-get.schemas';

interface ProductStorePanelProps {
  store?: DtoProductStoreSummary | null;
}

/** Compact seller strip on the product detail page. */
export function ProductStorePanel({ store }: ProductStorePanelProps) {
  const t = useTranslations('pdp.store');
  const { formatDecimal, moneyClassName } = useLocaleFormatters();

  if (!store?.slug) return null;

  const rating = store.rating ?? 0;

  return (
    <section className='border-border/60 bg-muted/20 rounded-2xl border p-4 sm:p-5'>
      <div className='flex items-center gap-4'>
        <div className='bg-background relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border shadow-sm'>
          {store.logo_url ? (
            <Image src={store.logo_url} alt='' fill className='object-cover' sizes='56px' />
          ) : (
            <div className='flex h-full items-center justify-center text-base font-semibold'>
              {store.name?.charAt(0)}
            </div>
          )}
        </div>

        <div className='min-w-0 flex-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <p className='text-muted-foreground text-[11px] tracking-[0.18em] uppercase'>
              {t('soldBy')}
            </p>
            {store.is_verified && (
              <Badge variant='secondary' className='rounded-full px-2 py-0 text-[10px]'>
                {t('verified')}
              </Badge>
            )}
          </div>
          <div className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1'>
            <h3 className='font-display text-base font-semibold sm:text-lg'>{store.name}</h3>
            <div className='flex items-center gap-1.5'>
              <div className='flex'>
                {Array.from({ length: 5 }).map((_, i) => {
                  const Icon = i < Math.round(rating) ? IconStarFilled : IconStar;
                  return (
                    <Icon
                      key={i}
                      className={cn(
                        'h-3 w-3',
                        i < Math.round(rating) ? 'fill-accent text-accent' : 'text-muted-foreground/30'
                      )}
                    />
                  );
                })}
              </div>
              <span className={cn('text-muted-foreground text-xs', moneyClassName)}>
                {t('ratingReviews', {
                  rating: formatDecimal(rating),
                  count: store.review_count ?? 0
                })}
              </span>
            </div>
          </div>
          {store.location && (
            <p className='text-muted-foreground mt-1 flex items-center gap-1 text-xs'>
              <IconMapPin className='h-3.5 w-3.5' />
              {store.location}
            </p>
          )}
        </div>

        <Link
          href={`/store/${store.slug}`}
          className='text-foreground hover:bg-background hidden shrink-0 items-center gap-1 rounded-full border px-4 py-2 text-sm font-medium transition sm:inline-flex'
        >
          {t('visit')}
          <IconArrowUpRight className='h-4 w-4 cn-rtl-flip' />
        </Link>
      </div>

      {(store.shipping_info || store.return_policy) && (
        <div className='border-border/60 mt-4 space-y-1 border-t pt-4 text-xs leading-relaxed'>
          {store.shipping_info && (
            <p className='text-muted-foreground flex gap-2'>
              <IconTruck className='text-accent mt-0.5 h-4 w-4 shrink-0' />
              {store.shipping_info}
            </p>
          )}
          {store.return_policy && <p className='text-muted-foreground ps-6'>{store.return_policy}</p>}
        </div>
      )}

      <Link
        href={`/store/${store.slug}`}
        className='text-foreground mt-4 inline-flex w-full items-center justify-center gap-1 rounded-full border py-2.5 text-sm font-medium sm:hidden'
      >
        {t('visitStore')}
        <IconArrowUpRight className='h-4 w-4 cn-rtl-flip' />
      </Link>
    </section>
  );
}
