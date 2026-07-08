'use client';

import { useTranslations } from 'next-intl';

import { InfiniteMovingCards } from '@/components/card/infinite-moving-cards';
import { TRUSTED_BRANDS } from '@/domains/vendor/landing/data/vendor-landing.data';

const brandItems = TRUSTED_BRANDS.map((brand) => ({
  quote: brand,
  name: '',
  title: ''
}));

export function VendorBrandsMarquee() {
  const t = useTranslations('vendor.landing.logoCloud');

  return (
    <div aria-label={t('partnerBrandsAria')}>
      <InfiniteMovingCards
        items={brandItems}
        direction='right'
        speed='normal'
        variant='brand'
        pauseOnHover={false}
      />
    </div>
  );
}
