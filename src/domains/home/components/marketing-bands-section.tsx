import { getLocale, getTranslations } from 'next-intl/server';

import { PromoCountdown } from '@/domains/home/components/ui/promo-countdown';
import { HOME_RAIL_SECTION_CLASS } from '@/domains/home/lib/home-density';
import { safeHomeFetch } from '@/domains/home/lib/safe-home-fetch';
import { marketingNumbers } from '@/lib/i18n/marketing-numbers';
import { cn } from '@/lib/utils';
import { getHomeFlashDeals } from '@/services/-home-flash-deals-get';
import { getHomeMarketingBands } from '@/services/-home-marketing-bands-get';
import type { DtoHomeMarketingBand } from '@/services/-home-marketing-bands-get.schemas';
import type { Locale } from '~/src/i18n/config';

import { sectionContainerClass } from '../lib/home-utils';

const DEAL_LIMIT = 8;

function resolveBandTheme(theme?: string): 'dark' | 'light' {
  return theme === 'light' ? 'light' : 'dark';
}

function resolvePromoEnd(band: DtoHomeMarketingBand): Date | null {
  if (band.promo?.ends_at) return new Date(band.promo.ends_at);
  const lead = band.deals?.find((deal) => deal.ends_at);
  return lead?.ends_at ? new Date(lead.ends_at) : null;
}

async function loadMarketingBands(): Promise<DtoHomeMarketingBand[]> {
  const data = await safeHomeFetch(() => getHomeMarketingBands({ limit: DEAL_LIMIT }));
  const bands = (data?.data?.bands ?? []).filter(
    (band) => band.deals && band.deals.length > 0 && band.promo
  );
  if (bands.length > 0) return bands;

  const flash = await safeHomeFetch(() => getHomeFlashDeals({ limit: DEAL_LIMIT }));
  const deals = (flash?.data?.deals ?? []).filter((deal) => deal.product && deal.ends_at);
  const promo = flash?.data?.promo;
  if (!promo || deals.length === 0) return [];

  return [
    {
      key: 'flash-deals-promo',
      promo,
      deals,
      theme: 'dark'
    }
  ];
}

/** Renders one or more admin-configured marketing promo bands on the home page. */
export async function MarketingBandsSection() {
  const [t, tCommon, locale] = await Promise.all([
    getTranslations('home.promo'),
    getTranslations('home.common'),
    getLocale()
  ]);

  const bands = await loadMarketingBands();
  if (bands.length === 0) return null;

  const promoCode = t('code') || 'LUXE20';
  const countdown = {
    hours: t('countdown.hours'),
    minutes: t('countdown.minutes'),
    seconds: t('countdown.seconds')
  };

  return (
    <section className={cn(HOME_RAIL_SECTION_CLASS, 'py-8 sm:py-10')}>
      <div className={cn(sectionContainerClass, 'flex flex-col gap-6')}>
        {bands.map((band) => {
          const promoEnd = resolvePromoEnd(band);
          const deals = (band.deals ?? []).filter((deal) => deal.product && deal.ends_at);
          if (!promoEnd || deals.length === 0) return null;

          const product = deals[0]?.product;
          const discount =
            product?.discount_percent != null && product.discount_percent > 0
              ? product.discount_percent / 100
              : product?.compare_at_price != null &&
                  product.price != null &&
                  product.compare_at_price > product.price
                ? (product.compare_at_price - product.price) / product.compare_at_price
                : marketingNumbers.promoDiscountPercent;

          const promo = band.promo;
          const badge = promo?.badge?.trim() || t('badge');
          const title = promo?.title?.trim() || t('title', { discount });
          const description =
            promo?.description?.trim() || t('description', { discount, code: promoCode });
          const shopSale = promo?.cta_label?.trim() || t('shopSale');
          const ctaHref = promo?.cta_href?.trim() || '/shop';

          return (
            <PromoCountdown
              key={band.key ?? title}
              promoEnd={promoEnd}
              deals={deals}
              ctaHref={ctaHref}
              theme={resolveBandTheme(band.theme)}
              locale={locale as Locale}
              t={{
                badge,
                title,
                description,
                shopSale,
                countdown
              }}
              common={{
                promoImageAlt: tCommon('promoImageAlt')
              }}
            />
          );
        })}
      </div>
    </section>
  );
}
