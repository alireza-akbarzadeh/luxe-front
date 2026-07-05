import { IconRosetteDiscountCheck, IconShieldCheck, IconTruck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { TrustItems } from '@/domains/product/components/trust-Items';

export function ProductInfoTrustRow() {
  const t = useTranslations('pdp.info');

  const trustItems = [
    { icon: IconTruck, label: t('freeShipping') },
    { icon: IconRosetteDiscountCheck, label: t('authenticity') },
    { icon: IconShieldCheck, label: t('returns') }
  ] as const;

  return (
    <div className='border-border/60 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between'>
      {trustItems.map(({ icon, label }, index) => (
        <TrustItems key={label} icon={icon} label={label} index={index} />
      ))}
    </div>
  );
}
