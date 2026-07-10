'use client';

import { useTranslations } from 'next-intl';

import { TRUSTED_BRANDS } from '@/domains/vendor/landing/data/vendor-landing.data';

/** Duplicated sequence so the -50% CSS translate loops seamlessly. */
const MARQUEE_BRANDS = [...TRUSTED_BRANDS, ...TRUSTED_BRANDS];

export function VendorBrandsMarquee() {
  const t = useTranslations('vendor.landing.logoCloud');

  return (
    <div
      className='vendor-brands-marquee relative z-20 w-full overflow-hidden'
      aria-label={t('partnerBrandsAria')}
    >
      <ul className='vendor-brands-marquee-track m-0 list-none p-0'>
        {MARQUEE_BRANDS.map((brand, index) => (
          <li
            key={`${brand}-${index}`}
            aria-hidden={index >= TRUSTED_BRANDS.length}
            className='flex w-[220px] shrink-0 items-center justify-center rounded-[1.25rem] border border-white/8 bg-white/[0.03] px-7 py-5 shadow-[0_16px_40px_-28px_rgba(0,0,0,0.75)] backdrop-blur-xl md:w-[260px]'
          >
            <span className='font-display text-foreground/85 text-sm font-semibold tracking-[0.22em] uppercase'>
              {brand}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
